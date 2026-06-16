# Step 1 — Know Your Data
### Tekken 8 Win Predictor | Data Collection & Exploration

---

## What This Step Is About

Before you can train any machine learning model, you need to understand the data
you are training it on. Garbage in, garbage out — a model is only as good as what
it learns from.

In this step we:
1. Learned what the **Wavu Wank API** gives us
2. Wrote a script to **collect millions of real matches** into CSV files
3. Built a **visualization notebook** to explore and validate the data

---

## The Big Picture

Here is where Step 1 fits in the overall project:

```
[Step 1] Collect & Explore Data       ← YOU ARE HERE
[Step 2] Feature Engineering
[Step 3] Train the Neural Network (Embedding Layer)
[Step 4] Train the Classifier (Win % Layer)
[Step 5] Groq LLM Explanation
```

---

## Part 1 — The Data Source (Wavu Wank API)

### What is Wavu Wank?

Wavu Wank is a community-run Tekken 8 statistics site. It pulls ranked replay
data directly from the game's servers every ~60 seconds and stores it in a
database. As of writing, the database has **over 552 million matches** going
back to March 2024.

They expose this data through a public API that anyone can query for free.

### The API Endpoint

```
GET https://wank.wavu.wiki/api/replays?_format=json
```

**Important rules:**
- Always include the header `Accept-Encoding: gzip, deflate` — the server requires it
- Only send **one request at a time** (no parallel requests)
- Add `?before=<unix_timestamp>` to paginate backward through time
- Each response covers a **700-second window** of matches

### What One Response Looks Like

Each request returns roughly **5,000 match records**. Here is one record
broken down:

```json
{
  "battle_at":        1779484341,
  "battle_id":        "34812CF26BC84EACB5F3294147470145",
  "battle_type":      2,
  "game_version":     30002,
  "stage_id":         300,
  "winner":           2,

  "p1_name":          "Nihilus",
  "p1_polaris_id":    "5yMLMArGgQrQ",
  "p1_chara_id":      12,
  "p1_rank":          23,
  "p1_rating_before": 1435,
  "p1_rating_change": -12,
  "p1_power":         190477,
  "p1_rounds":        1,

  "p2_name":          "-mikakty-",
  "p2_polaris_id":    "...",
  "p2_chara_id":      6,
  ...
}
```

Every match has a **mirrored set of fields** for P1 and P2.

### Field Reference

| Field | Type | What it means |
|---|---|---|
| `battle_at` | timestamp | When the match happened (Unix seconds) |
| `battle_id` | string | Unique ID for this match |
| `battle_type` | int | `2` = ranked. We only care about ranked. |
| `game_version` | int | Which patch the match was played on |
| `stage_id` | int | Stage/arena (not used for prediction) |
| `winner` | int | `1` = P1 won, `2` = P2 won. **This is our training label.** |
| `p#_name` | string | Display name (changes if player renames) |
| `p#_polaris_id` | string | **Stable unique player ID** — use this to track players across matches |
| `p#_chara_id` | int | Character played (see table below) |
| `p#_rank` | int | Rank tier (1 = Beginner, 30 = God of Destruction) |
| `p#_rating_before` | int | **Glicko2 skill rating** before this match — our strongest feature |
| `p#_rating_change` | int | How much their rating changed after |
| `p#_power` | int | In-game power score |
| `p#_rounds` | int | Rounds won in the set |
| `p#_area_id` | int | Geographic region (often null — not reliable) |
| `p#_region_id` | int | Sub-region (often null — not reliable) |
| `p#_lang` | string | Language setting (often null — not reliable) |

### Character ID Mapping

| ID | Name | ID | Name | ID | Name |
|---|---|---|---|---|---|
| 0 | Paul | 14 | Lili | 28 | Reina |
| 1 | Law | 15 | Dragunov | 29 | Azucena |
| 2 | King | 16 | Leo | 30 | Victor |
| 3 | Yoshimitsu | 17 | Lars | 31 | Raven |
| 4 | Hwoarang | 18 | Alisa | 32 | Azazel |
| 5 | Xiaoyu | 19 | Claudio | 33 | Eddy |
| 6 | Jin | 20 | Shaheen | 34 | Lidia |
| 7 | Bryan | 21 | Nina | 35 | Heihachi |
| 8 | Kazuya | 22 | Lee | 36 | Clive |
| 9 | Steve | 23 | Kuma | 37 | Anna |
| 10 | Jack-8 | 24 | Panda | 38 | Armor King |
| 11 | Asuka | 25 | Zafina | 39 | Mairy Zo |
| 12 | Devil Jin | 26 | Leroy | | |
| 13 | Feng | 27 | Jun | | |

### What is Glicko2?

Glicko2 is a **mathematical rating system** (similar to Elo in chess) that
estimates a player's true skill level based on match results. The key insight
is that it accounts for the *reliability* of the rating — a player who has
played 500 ranked games has a more trustworthy rating than someone who just
started.

For us, `rating_before` is powerful because:
- It already encodes months of match history into one number
- Two players with similar ratings are genuinely close in skill
- It updates after every game, so it stays current

---

## Part 2 — Collecting the Data

### File: `scripts/collect_data.py`

This script paginates the Wavu Wank API backward through time and saves
matches to monthly CSV files.

### How Pagination Works

Think of the data like a long timeline of matches:

```
Oldest ◄────────────────────────────────► Newest (now)
         [Dec][Jan][Feb][Mar][Apr][May]
```

The API only gives you a **700-second slice** at a time. To walk backward
through a whole month, we repeatedly ask:

> "Give me all matches before timestamp X"

Then subtract 700 seconds from X and ask again. We keep going until we
reach the start of the month or hit our record limit.

```
Request 1: before=end_of_month      → gets matches from the last 700 seconds of the month
Request 2: before=end_of_month-700  → gets the 700 seconds before that
Request 3: before=end_of_month-1400 → ...and so on
```

### Key Settings (top of the file)

```python
# Which months to collect — add or remove as needed
MONTHS = [
    (2026, 5),
    (2026, 4),
    (2026, 3),
    ...
]

# Stop collecting after this many records per month.
# ~5,000 records per API request, so 500,000 = ~100 requests.
# Set to None to collect the ENTIRE month (takes ~1 hour per month).
MAX_RECORDS_PER_MONTH = 500_000
```

### Output

The script creates one CSV per month inside the `data/` folder:

```
data/
  replays_2026_05.csv   ← ~500,000 records
  replays_2026_04.csv   ← ~500,000 records
  replays_2026_03.csv   ← ~500,000 records
  replays_2026_02.csv   ← ~500,000 records
  replays_2026_01.csv   ← ~500,000 records
  replays_2025_12.csv   ← ~500,000 records
```

Total: ~3 million records. Each CSV has every field from the API as a column.

### Why Monthly Files?

- Easy to load just one month in Colab without running out of RAM
- Simple to add more months later without re-downloading everything
- Easy to see if data quality changes over time (patches, meta shifts)

### How to Run It

```bash
python scripts/collect_data.py
```

Takes about 3–5 minutes per month at the default settings.

> **Note:** The `data/` folder is in `.gitignore`. CSVs are never committed
> to git because they are large and fully reproducible by re-running this script.

---

## Part 3 — Exploring the Data

### File: `notebooks/01_data_exploration.ipynb`

This Jupyter notebook loads all the CSVs and produces visualizations that help
us understand the data before we start training.

### How to Run It in Google Colab

1. Upload the notebook to Colab (or open from Drive)
2. Upload your CSVs to Drive and uncomment the Drive mount lines at the top
3. Run all cells top to bottom

### Notebook Sections Explained

---

#### Section 1 — Load Data

Reads all `replays_*.csv` files, combines them into one big DataFrame,
and converts the `battle_at` Unix timestamp into a readable datetime.

```
Found 6 CSV files:
  replays_2026_05.csv: 432,100 records
  replays_2026_04.csv: 500,000 records
  ...
Total: 2,987,412 records
Date range: 2025-12-01 → 2026-05-22
```

---

#### Section 2 — Data Volume & Coverage

**Records per month** — confirms you collected a roughly even sample across months.

**Game version (patch) distribution** — tells you how much of your data is
from each patch. This matters because Tekken patches change character balance.
Old data from when a character was broken might teach the model the wrong thing.

> Rule of thumb: if one patch version has 10x more data than another,
> consider whether that imbalance will hurt the model.

---

#### Section 3 — Match Outcome Balance

The most important sanity check. The `winner` field should be **almost
exactly 50/50** between P1 and P2.

Why? Because every match has exactly one winner. There is no reason P1 should
win more than P2 in a large random sample.

**If it is NOT 50/50**, something is wrong — possibly the API puts the
higher-rated player as P1, which would mean our label is biased.

We also check `battle_type`. We only want ranked matches (`battle_type = 2`).

---

#### Section 4 — Character Analysis

**Pick rate chart** — how often each character appears. This tells us:
- Which characters are popular (Jin, Kazuya, Devil Jin will likely be top)
- Which characters are rarely played and may produce weak model predictions

If a character has fewer than **1,000 appearances**, the notebook flags it.
Those characters will have poor embeddings in the neural network because
the model does not have enough examples to learn from.

**Win rate chart** — what percentage of matches each character wins overall.

Characters above 50% are currently stronger in the meta. Characters below 50%
are weaker. This is essentially a data-driven tier list.

For our model, characters with win rates far from 50% are actually
**easier to learn from** — their matchup advantage is a strong signal.

---

#### Section 5 — Player Skill Distribution

**Rank distribution** — shows the population of rank tiers. Tekken (like most
ranked games) is a pyramid: most players are in the middle ranks, very few
are at the top. This is called a **right-skewed distribution**.

This matters because our training data will have far more mid-rank matches
than high-rank matches. The model may be less accurate at predicting
top-level play as a result.

**Glicko2 rating distribution** — both P1 and P2 curves should look like
a bell curve (normal distribution) and should nearly overlap each other.

If the curves are far apart, the API is systematically putting higher-rated
players as P1 or P2, which introduces bias into every match record.

---

#### Section 6 — Key Signal Checks ⭐

This is the most important section. We are asking: **does rating/rank
actually predict who wins?**

We bin matches by the *difference* in rating between P1 and P2, then plot
the win rate for each bin.

**What a good result looks like:**

```
Win Rate %
   80 |                                    ╭───
   70 |                               ╭───╯
   60 |                          ╭───╯
   50 |─────────────────────────●───────────── ← 50% baseline
   40 |                    ╭───╯
   30 |               ╭───╯
   20 |──────────────╯
       ◄──────────────────┬──────────────────►
             P1 worse   0   P1 better
                   Rating Difference
```

This S-curve shape means: **the higher your rating relative to your opponent,
the more likely you are to win.** That is exactly what we want to see.

A flat line would mean rating has no predictive power and we would need to
find different features.

We run this check for **both rating and rank**. Rating tends to produce a
smoother, steeper curve because it is more precise than rank tiers.

---

#### Section 7 — Player History Depth

To build powerful per-player features (like "this player's win rate with
Devil Jin over their last 20 games"), we need each player to have appeared
in our dataset **multiple times**.

This chart shows the distribution of how many games each unique player
(`polaris_id`) has in our dataset.

The notebook prints a breakdown like:

```
Total unique players: 287,433
  Players with ≥  5 games: 134,201 (46.7%)
  Players with ≥ 10 games:  89,442 (31.1%)
  Players with ≥ 20 games:  52,108 (18.1%)
  Players with ≥ 50 games:  21,334  (7.4%)
  Players with ≥100 games:   9,871  (3.4%)
```

If fewer than 20% of players have 20+ games, we may need to collect more
months of data before player history features are reliable.

---

#### Section 8 — Summary Diagnostic

Runs automatically and prints a final report:

```
=======================================================
  DATASET DIAGNOSTIC SUMMARY
=======================================================

Total records      : 2,987,412
Unique players     : 287,433
Date range         : 2025-12-01 → 2026-05-22

[OK] Class balance    : P1 wins 50.03% (balanced)
[OK] Sparse characters : 0 chars with <1,000 appearances
[OK] History depth     : 18.1% of players have ≥20 games (viable)
[OK] High-null fields  : none — all fields usable
=======================================================
```

Any `[!!]` flag means something needs attention before moving to model training.

---

## Project File Structure (After Step 1)

```
tekken-win-predictor/
│
├── data/                          ← CSV files (git-ignored, run collect_data.py to regenerate)
│   ├── replays_2026_05.csv
│   ├── replays_2026_04.csv
│   └── ...
│
├── docs/
│   └── STEP1_Know_Your_Data.md   ← This file
│
├── notebooks/
│   └── 01_data_exploration.ipynb ← Visualization notebook
│
├── scripts/
│   └── collect_data.py           ← API data collection script
│
├── .gitignore
└── README.md
```

---

## What Comes Next (Step 2)

Now that we understand our raw data, the next step is **Feature Engineering** —
transforming the raw match records into inputs the neural network can actually
learn from.

Raw fields like `p1_chara_id = 12` and `p1_rank = 23` are not very useful on
their own. We need to compute things like:

- **Player recent form** — win rate over last 20 games (from `polaris_id` history)
- **Character mastery** — how often does this player win *with this specific character*?
- **Matchup history** — how has character A historically done against character B?
- **Rating differential** — just `p1_rating_before - p2_rating_before` (already validated above)

These engineered features become the inputs to the embedding layer of our
neural network.

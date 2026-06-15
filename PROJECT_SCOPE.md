# Tekken 8 Win Predictor — Project Scope
**Course:** SDEV378  
**Team size:** 4  
**Deliverable:** Web app  

---

## What This Project Does

A web app where a Tekken 8 player enters their username and their opponent's username. The app returns a predicted win probability and a plain-English explanation of why.

**Example flow:**
1. You type your username → app pulls your last ~500 ranked matches
2. You type your opponent's username → app pulls their last ~500 ranked matches
3. The model compares both profiles → outputs "Player 1 wins: 63%"
4. A Groq LLM turns that into a readable explanation

---

## Architecture Overview

One model, two layers — both trained and used together.

```
[Player A username] ──┐
                      ├──► [Layer 1: Embedding Layer] ──► [Layer 2: Prediction Layer] ──► Win %
[Player B username] ──┘
```

### Layer 1 — Embedding Layer (the "scout")
Learns patterns from historical match data. For each player+character combination it builds a numerical profile (called an **embedding**) that captures:
- Win rates with each character
- Performance at their rank tier
- Glicko2 rating trajectory
- Character matchup tendencies

This layer does NOT predict. It just summarizes players into numbers the next layer can use.

### Layer 2 — Prediction Layer (the "analyst")
Takes the two embeddings from Layer 1 and outputs a single win probability. This is where the actual "who wins?" answer comes from.

Both layers train together as one model.

---

## Data

**Source:** Wavu Wank API (`https://wank.wavu.wiki/api/replays?_format=json`)

**Already collected:** Monthly CSV files from Dec 2025 through May 2026 (located in `data/`)

**Key fields used per match:**
| Field | Purpose |
|---|---|
| `polaris_id` | Stable unique player ID (use this, not username — names can change) |
| `chara_id` | Character played (integer) |
| `rank` | Rank tier |
| `rating_before` | Glicko2 rating before the match |
| `rating_change` | How much rating changed |
| `rounds` | Rounds won |
| `winner` | 1 or 2 — the label we're training on |
| `battle_type` | Filter to 2 = ranked only |

---

## Player Profile System (Pre-Computation)

To keep the app fast, players register themselves before using the predictor.

**Registration flow:**
1. Player types their in-game username
2. App hits the API, finds their `polaris_id`
3. Fetches their last ~500 ranked matches
4. Layer 1 processes those matches → generates their embedding
5. Embedding is saved to a database, keyed by `polaris_id`

**At prediction time:**
- Look up both players' stored embeddings (no live API calls needed)
- Feed into Layer 2 → prediction in milliseconds

**Edge case to handle:** What if the opponent hasn't registered yet?
- Option A: Prompt the user that the opponent needs to register first
- Option B: Fall back to rank/rating as a rough proxy (less accurate)
- **Decision needed by team**

---

## Work Breakdown (4 people, flexible)

These are natural modules — team can divide however makes sense.

### Module 1 — Feature Engineering
- Load the CSV data from `data/`
- Build the feature set per player: win rates by character, matchup stats, rating trends
- Output a clean dataset ready for model training

### Module 2 — Model (Layers 1 + 2)
- Design and train the two-layer neural network
- Layer 1: embedding architecture
- Layer 2: binary classification (win/lose)
- Save the trained model weights

### Module 3 — Player Profile Backend
- API integration: username → `polaris_id` → fetch 500 matches
- Run matches through Layer 1 → store embedding
- Database or file storage for saved profiles

### Module 4 — Web App (Frontend + API)
- Simple web UI: two username input fields, submit button, result display
- Backend route that receives two usernames, loads embeddings, runs Layer 2
- Display win probability + Groq LLM explanation

---

## Tech Stack (suggested, not locked in)

| Part | Tool |
|---|---|
| Model | PyTorch or TensorFlow |
| Backend | Python + Flask or FastAPI |
| Frontend | HTML/CSS/JS (keep it simple) |
| LLM explanation | Groq API |
| Data | Pandas (CSV → feature matrix) |
| Player DB | SQLite (simple) or just JSON files |

---

## What's Done

- [x] Data collection script (`scripts/collect_data.py`)
- [x] Historical match data scraped (Dec 2025 – May 2026, stored in `data/`)
- [x] Data visualized and confirmed balanced

## What's Left

- [ ] Feature engineering (Module 1)
- [ ] Model training (Module 2)
- [ ] Player profile backend (Module 3)
- [ ] Web app (Module 4)
- [ ] Groq LLM integration
- [ ] End-to-end testing

---

## Notes for Claude (AI assistant)

This document exists so future conversations can pick up with full context. Key things to remember:
- Use `polaris_id` as the player identifier, never username alone
- The model is one unit with two internal layers — not two separate models
- The team is learning ML as they build — explain concepts in plain terms, use Tekken analogies where helpful
- Deadline pressure is real — prioritize working over perfect

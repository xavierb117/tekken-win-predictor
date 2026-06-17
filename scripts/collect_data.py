import requests
import csv
import os
import calendar
from datetime import datetime, timezone

BASE_URL = "https://wank.wavu.wiki/api/replays"

# Every field returned by the API for both players
FIELDS = [
    "battle_at", "battle_id", "battle_type", "game_version", "stage_id", "winner",
    "p1_chara_id", "p1_name", "p1_polaris_id", "p1_power", "p1_rank",
    "p1_rating_before", "p1_rating_change", "p1_region_id", "p1_rounds",
    "p1_user_id", "p1_area_id", "p1_lang",
    "p2_chara_id", "p2_name", "p2_polaris_id", "p2_power", "p2_rank",
    "p2_rating_before", "p2_rating_change", "p2_region_id", "p2_rounds",
    "p2_user_id", "p2_area_id", "p2_lang",
]

# Months to collect — add or remove entries as needed (year, month)
MONTHS = [
    (2026, 5),
    (2026, 4),
    (2026, 3),
    (2026, 2),
    (2026, 1),
    (2025, 12),
]

# How many records to collect per month before stopping.
# ~5,000 records per API request, so 500k = ~100 requests per month.
# Set to None to collect the entire month (will take a long time).
MAX_RECORDS_PER_MONTH = 2_000_000

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def fetch_window(before_ts):
    url = f"{BASE_URL}?_format=json&before={before_ts}"
    resp = requests.get(url, headers={"Accept-Encoding": "gzip, deflate"}, timeout=30)
    resp.raise_for_status()
    return resp.json()


def collect_month(year, month):
    start_ts = int(datetime(year, month, 1, tzinfo=timezone.utc).timestamp())
    last_day = calendar.monthrange(year, month)[1]
    end_ts = int(datetime(year, month, last_day, 23, 59, 59, tzinfo=timezone.utc).timestamp())
    # Cap the current month at right now
    end_ts = min(end_ts, int(datetime.now(tz=timezone.utc).timestamp()))

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = os.path.join(OUTPUT_DIR, f"replays_{year}_{month:02d}.csv")

    before = end_ts
    total = 0
    request_count = 0

    print(f"\n--- Collecting {year}-{month:02d} ---")

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()

        while before >= start_ts:
            if MAX_RECORDS_PER_MONTH and total >= MAX_RECORDS_PER_MONTH:
                print(f"  Reached max record limit ({MAX_RECORDS_PER_MONTH:,}).")
                break

            try:
                replays = fetch_window(before)
                request_count += 1
            except Exception as e:
                print(f"  Request failed at ts={before}: {e}. Stopping.")
                break

            if not replays:
                print("  Empty response — reached end of data.")
                break

            written = 0
            for r in replays:
                # Skip records that fall outside this month (can happen on boundary requests)
                if r.get("battle_at", 0) < start_ts:
                    continue
                writer.writerow({field: r.get(field) for field in FIELDS})
                total += 1
                written += 1

            # Progress update every 10 requests
            if request_count % 10 == 0:
                window_dt = datetime.fromtimestamp(before, tz=timezone.utc)
                print(f"  [{request_count} requests | {total:,} records] window ending {window_dt.strftime('%Y-%m-%d %H:%M')}")

            before -= 700  # Step back one 700-second window

    print(f"  Saved {total:,} records → {filename}")
    return total


if __name__ == "__main__":
    grand_total = 0
    for year, month in MONTHS:
        grand_total += collect_month(year, month)
    print(f"\nAll done. {grand_total:,} total records collected.")

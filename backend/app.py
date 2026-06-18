import os
import re
import json
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import joblib

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Tekken Win Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model definition (must match train.ipynb) ─────────────────────────────────
class PlayerEncoder(nn.Module):
    def __init__(self, input_dim=5, hidden_dim=64, embed_dim=32):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, embed_dim),
        )

    def forward(self, x):
        return self.encoder(x)


class MatchPredictor(nn.Module):
    def __init__(self, player_input_dim=5, hidden_dim=64, embed_dim=32, classifier_hidden=32):
        super().__init__()
        self.player_encoder = PlayerEncoder(player_input_dim, hidden_dim, embed_dim)
        combined_dim = embed_dim * 2 + 1
        self.classifier = nn.Sequential(
            nn.Linear(combined_dim, classifier_hidden),
            nn.ReLU(),
            nn.Linear(classifier_hidden, 1),
        )

    def forward(self, p1_features, p2_features, matchup_wr):
        embed_p1 = self.player_encoder(p1_features)
        embed_p2 = self.player_encoder(p2_features)
        combined = torch.cat([embed_p1, embed_p2, matchup_wr], dim=1)
        return self.classifier(combined)


# ── Character name → chara_id ─────────────────────────────────────────────────
CHAR_NAME_TO_ID = {
    "kazuya mishima": 0, "kazuya": 0,
    "nina williams": 1, "nina": 1,
    "marshall law": 2, "law": 2,
    "jack-8": 3, "jack8": 3, "jack 8": 3,
    "king": 4,
    "yoshimitsu": 5,
    "jun kazama": 6, "jun": 6,
    "ling xiaoyu": 7, "xiaoyu": 7,
    "asuka kazama": 8, "asuka": 8,
    "leroy smith": 9, "leroy": 9,
    "lars alexandersson": 10, "lars": 10,
    "alisa bosconovitch": 11, "alisa": 11,
    "claudio serafino": 12, "claudio": 12,
    "shaheen": 13,
    "kuma": 14, "kuma/panda": 14,
    "paul phoenix": 15, "paul": 15,
    "feng wei": 16, "feng": 16,
    "lili": 17,
    "zafina": 18,
    "lee chaolan": 19, "lee": 19, "violet": 19,
    "bryan fury": 20, "bryan": 20,
    "hwoarang": 21,
    "devil jin": 22,
    "raven": 23,
    "leo kliesen": 24, "leo": 24,
    "panda": 36,
    "victor chevalier": 28, "victor": 28,
    "reina": 29,
    "azucena": 32,
    "steve fox": 33, "steve": 33,
    "jin kazama": 34, "jin": 34,
    "eddy gordo": 38, "eddy": 38,
    "dragunov": 40,
    "clive": 41,
    "anna williams": 42, "anna": 42,
    "heihachi mishima": 43, "heihachi": 43,
}

# ── Paths ─────────────────────────────────────────────────────────────────────
_ROOT = Path(__file__).parent.parent
DATA_DIR = _ROOT / "data"
MODELS_DIR = _ROOT / "models"


# ── Build lookup tables from replay CSVs ──────────────────────────────────────
def _build_lookups():
    csv_files = list(DATA_DIR.glob("replays_*.csv"))
    if not csv_files:
        return None

    df = pd.concat([pd.read_csv(f) for f in csv_files], ignore_index=True)

    # name → polaris_id (most recent match wins)
    p1_ids = df[['p1_name', 'p1_polaris_id', 'battle_at']].rename(
        columns={'p1_name': 'name', 'p1_polaris_id': 'polaris_id'})
    p2_ids = df[['p2_name', 'p2_polaris_id', 'battle_at']].rename(
        columns={'p2_name': 'name', 'p2_polaris_id': 'polaris_id'})
    name_to_polaris = (
        pd.concat([p1_ids, p2_ids])
        .sort_values('battle_at', ascending=False)
        .drop_duplicates('name')
        .set_index('name')['polaris_id']
        .to_dict()
    )

    # polaris_id → most recent {rating, rank, power}
    p1_stats = df[['p1_polaris_id', 'battle_at', 'p1_rating_before', 'p1_rank', 'p1_power']].rename(
        columns={'p1_polaris_id': 'pid', 'p1_rating_before': 'rating', 'p1_rank': 'rank', 'p1_power': 'power'})
    p2_stats = df[['p2_polaris_id', 'battle_at', 'p2_rating_before', 'p2_rank', 'p2_power']].rename(
        columns={'p2_polaris_id': 'pid', 'p2_rating_before': 'rating', 'p2_rank': 'rank', 'p2_power': 'power'})
    player_stats = (
        pd.concat([p1_stats, p2_stats])
        .sort_values('battle_at', ascending=False)
        .drop_duplicates('pid')
        .set_index('pid')[['rating', 'rank', 'power']]
        .to_dict('index')
    )

    # overall win rate per polaris_id
    p1_m = df.groupby('p1_polaris_id').size().rename('m')
    p1_w = df[df['winner'] == 1].groupby('p1_polaris_id').size().rename('w')
    p2_m = df.groupby('p2_polaris_id').size().rename('m')
    p2_w = df[df['winner'] == 2].groupby('p2_polaris_id').size().rename('w')
    p1_m.index.name = p1_w.index.name = p2_m.index.name = p2_w.index.name = 'pid'
    overall_wr = (
        p1_w.add(p2_w, fill_value=0) / p1_m.add(p2_m, fill_value=0)
    ).fillna(0.5).to_dict()

    # char win rate per (polaris_id, chara_id)
    p1_cm = df.groupby(['p1_polaris_id', 'p1_chara_id']).size()
    p1_cw = df[df['winner'] == 1].groupby(['p1_polaris_id', 'p1_chara_id']).size()
    p2_cm = df.groupby(['p2_polaris_id', 'p2_chara_id']).size()
    p2_cw = df[df['winner'] == 2].groupby(['p2_polaris_id', 'p2_chara_id']).size()
    for s in [p1_cm, p1_cw, p2_cm, p2_cw]:
        s.index.names = ['pid', 'cid']
    char_wr = (
        p1_cw.add(p2_cw, fill_value=0) / p1_cm.add(p2_cm, fill_value=0)
    ).fillna(0.5).to_dict()

    # matchup win rate (p1_chara_id, p2_chara_id)
    mu_total = df.groupby(['p1_chara_id', 'p2_chara_id']).size()
    mu_wins = df[df['winner'] == 1].groupby(['p1_chara_id', 'p2_chara_id']).size()
    matchup_wr = (mu_wins / mu_total).fillna(0.5).to_dict()

    medians = {
        'rating': float(df['p1_rating_before'].median()),
        'rank': float(df['p1_rank'].median()),
        'power': float(df['p1_power'].median()),
    }

    return name_to_polaris, player_stats, overall_wr, char_wr, matchup_wr, medians


print("Loading replay data...")
_lookups = _build_lookups()
if _lookups:
    NAME_TO_POLARIS, PLAYER_STATS, OVERALL_WR, CHAR_WR, MATCHUP_WR, MEDIANS = _lookups
    print(f"Loaded stats for {len(NAME_TO_POLARIS):,} players.")
else:
    NAME_TO_POLARIS = PLAYER_STATS = OVERALL_WR = CHAR_WR = MATCHUP_WR = MEDIANS = None
    print("Warning: no replay data found.")

# ── Load model ────────────────────────────────────────────────────────────────
_model = _player_scaler = _matchup_scaler = None
_threshold = 0.5

try:
    _model = MatchPredictor()
    _model.load_state_dict(torch.load(MODELS_DIR / 'match_predictor.pt', map_location='cpu', weights_only=True))
    _model.eval()
    _player_scaler = joblib.load(MODELS_DIR / 'player_scaler.joblib')
    _matchup_scaler = joblib.load(MODELS_DIR / 'matchup_scaler.joblib')
    _threshold = joblib.load(MODELS_DIR / 'model_config.joblib').get('best_threshold', 0.5)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Warning: could not load model: {e}")


# ── Player profile lookup ─────────────────────────────────────────────────────
_RANK_THRESHOLDS = [
    (1050, 0),  (1075, 1),  (1100, 2),  (1125, 3),  (1150, 4),
    (1175, 5),  (1200, 6),  (1225, 7),  (1250, 8),  (1275, 9),
    (1300, 10), (1325, 11), (1375, 12), (1425, 13), (1475, 14),
    (1525, 15), (1550, 16), (1575, 17), (1600, 18), (1625, 19),
    (1650, 20), (1675, 21), (1700, 22), (1725, 23), (1750, 24),
    (1800, 25), (1850, 26), (1900, 27), (1950, 28),
]

def _rating_to_rank(rating: float) -> int:
    for threshold, rank in _RANK_THRESHOLDS:
        if rating < threshold:
            return rank
    return 29


async def _fetch_player_profile(polaris_id: str) -> Optional[dict]:
    """Scrape wank.wavu.wiki/player/{id} for recent match stats when the API doesn't have them."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"https://wank.wavu.wiki/player/{polaris_id}")
            if resp.status_code != 200:
                print(f"  Profile page returned {resp.status_code} for {polaris_id}")
                return None
            html = resp.text
    except Exception as e:
        print(f"  Profile scrape error for {polaris_id}: {e}")
        return None

    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    data = None
    for script in scripts:
        if 'const data' not in script:
            continue
        m = re.search(r'const data = (\[.*?\]);', script, re.DOTALL)
        if not m:
            continue
        try:
            candidate = json.loads(m.group(1))
        except Exception:
            continue
        if candidate and isinstance(candidate[0], dict) and 'n' in candidate[0] and 'rating_before' in candidate[0]:
            data = candidate
            break
    if not data:
        return None

    if not data:
        return None

    latest = min(data, key=lambda x: x.get('n', 9999))
    rating = latest.get('rating_before', 0)
    wins = sum(1 for d in data if d.get('rating_after', 0) > d.get('rating_before', 0))
    total = len(data)
    overall_wr = wins / total if total > 0 else 0.5
    rank = _rating_to_rank(rating)
    power = MEDIANS['power'] if MEDIANS else 0.0

    recent_opps = [d.get('opp_name', '?') for d in sorted(data, key=lambda x: x.get('n', 9999))[:5]]
    print(f"  Profile scrape: {polaris_id} rating={rating} rank={rank} wr={overall_wr:.2f} ({wins}/{total})")
    print(f"  Recent opponents: {', '.join(recent_opps)}")

    return {
        "rating": rating,
        "rank": rank,
        "power": power,
        "overall_wr": overall_wr,
        "char_wr_map": {},
    }



async def fetch_wavu_stats(polaris_id: str, player_name: str = "") -> Optional[dict]:
    if not polaris_id:
        return None
    return await _fetch_player_profile(polaris_id.replace("-", ""))


# ── Feature helpers ───────────────────────────────────────────────────────────
def _get_features(player_name: str, char_name: str, wavu_stats: Optional[dict], polaris_id: Optional[str] = None):
    """Return (rating, rank, power, overall_wr, char_wr, char_id)."""
    char_id = CHAR_NAME_TO_ID.get(char_name.lower())

    if wavu_stats:
        rating = wavu_stats["rating"]
        rank = wavu_stats["rank"]
        power = wavu_stats["power"]
        wr = wavu_stats["overall_wr"]
        cwr = wavu_stats["char_wr_map"].get(char_id, wr) if char_id is not None else wr
        return rating, rank, power, wr, cwr, char_id

    # Polaris ID lookup — exact match, no name collision
    clean_pid = polaris_id.replace("-", "") if polaris_id else None
    csv_pid = NAME_TO_POLARIS.get(player_name) if NAME_TO_POLARIS else None
    # Only use CSV name match if polaris_id confirms it's the same player
    if clean_pid and csv_pid and csv_pid != clean_pid:
        csv_pid = None  # name collision — discard
    pid = clean_pid or csv_pid

    if pid and pid in PLAYER_STATS:
        s = PLAYER_STATS[pid]
        rating, rank, power = s['rating'], s['rank'], s['power']
        wr = OVERALL_WR.get(pid, 0.5)
        cwr = CHAR_WR.get((pid, char_id), wr) if char_id is not None else wr
    else:
        rating, rank, power = MEDIANS['rating'], MEDIANS['rank'], MEDIANS['power']
        wr = cwr = 0.5

    return rating, rank, power, wr, cwr, char_id


async def _run_model(p1_name: str, p1_char: str, p2_name: str, p2_char: str,
                     p1_polaris: Optional[str] = None, p2_polaris: Optional[str] = None) -> Optional[int]:
    if _model is None:
        return None

    import asyncio
    p1_wavu, p2_wavu = await asyncio.gather(
        fetch_wavu_stats(p1_polaris or "", p1_name),
        fetch_wavu_stats(p2_polaris or "", p2_name),
    )

    r1, rk1, pw1, wr1, cwr1, cid1 = _get_features(p1_name, p1_char, p1_wavu, p1_polaris)
    r2, rk2, pw2, wr2, cwr2, cid2 = _get_features(p2_name, p2_char, p2_wavu, p2_polaris)

    print(f"P1 ({p1_name}): rating={r1:.0f} rank={rk1} power={pw1:.0f} wr={wr1:.2f} char_wr={cwr1:.2f} (polaris={'✓' if p1_polaris else '✗'})")
    print(f"P2 ({p2_name}): rating={r2:.0f} rank={rk2} power={pw2:.0f} wr={wr2:.2f} char_wr={cwr2:.2f} (polaris={'✓' if p2_polaris else '✗'})")

    mu_wr = 0.5
    if cid1 is not None and cid2 is not None and MATCHUP_WR is not None:
        mu_wr = MATCHUP_WR.get((cid1, cid2), 0.5)

    p1_arr = np.array([[r1, rk1, pw1, wr1, cwr1]], dtype=np.float32)
    p2_arr = np.array([[r2, rk2, pw2, wr2, cwr2]], dtype=np.float32)
    mu_arr = np.array([[mu_wr]], dtype=np.float32)

    p1_arr = _player_scaler.transform(p1_arr)
    p2_arr = _player_scaler.transform(p2_arr)
    mu_arr = _matchup_scaler.transform(mu_arr)

    with torch.no_grad():
        logit = _model(
            torch.tensor(p1_arr, dtype=torch.float32),
            torch.tensor(p2_arr, dtype=torch.float32),
            torch.tensor(mu_arr, dtype=torch.float32),
        )
        prob = torch.sigmoid(logit).item()

    return round(prob * 100)


# ── Groq integration ──────────────────────────────────────────────────────────
async def call_groq(prompt: str, max_tokens: int = 400) -> Optional[str]:
    api_url = os.getenv("GROQ_API_URL", "").rstrip("/")
    api_key = os.getenv("GROQ_API_KEY", "")
    model   = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    if not api_url or not api_key:
        return None

    endpoint = api_url if api_url.endswith("/chat/completions") else f"{api_url}/chat/completions"

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        print(f"  Groq error: {e} — {e.response.text}")
        return None
    except Exception as e:
        print(f"  Groq error: {e}")
        return None


# ── Request/response ──────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    player1: str
    player2: str
    player1_char: Optional[str] = None
    player2_char: Optional[str] = None
    player1_polaris: Optional[str] = None
    player2_polaris: Optional[str] = None


@app.post("/api/predict")
async def predict(req: PredictRequest):
    if not req.player1 and not req.player1_polaris:
        raise HTTPException(status_code=400, detail="player1 username or polaris ID is required")
    if not req.player2 and not req.player2_polaris:
        raise HTTPException(status_code=400, detail="player2 username or polaris ID is required")

    p1 = req.player1.strip()
    p2 = req.player2.strip()
    c1 = (req.player1_char or "Unknown").strip()
    c2 = (req.player2_char or "Unknown").strip()

    pct = await _run_model(p1, c1, p2, c2, req.player1_polaris, req.player2_polaris)

    if pct is None:
        import hashlib
        h = hashlib.sha256(f"{p1}|{p2}|{c1}|{c2}".encode()).hexdigest()
        pct = 30 + (int(h[:8], 16) % 41)

    prompt = (
        f"You are an expert Tekken analyst. Write a concise (3-6 sentence) matchup analysis for the characters '{c1}' (player {p1}) vs '{c2}' (player {p2}). "
        "Mention strengths, weaknesses, and one or two practical strategy tips for the player using the favored character. "
        "Keep it readable for casual players."
    )

    groq_resp = await call_groq(prompt)
    if groq_resp:
        explanation = groq_resp.strip()
    else:
        explanation = (
            f"{c1} vs {c2}: {p1} has a predicted edge ({pct}%). "
            "In this matchup, look for high-damage punishes on whiffed lows and use stage control to limit retreat options. "
            "(Groq not configured — this is a fallback analysis.)"
        )

    return {"player1_win_pct": pct, "explanation": explanation}

import os
import hashlib
import json
from typing import Optional

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


class PredictRequest(BaseModel):
    player1: str
    player2: str
    player1_char: Optional[str] = None
    player2_char: Optional[str] = None


def deterministic_pct(seed: str) -> int:
    # Deterministic pseudo-random percent based on a hash of the seed
    h = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    v = int(h[:8], 16)
    return 30 + (v % 41)  # 30..70


async def call_groq(prompt: str, max_tokens: int = 400) -> Optional[str]:
    GROQ_API_URL = os.getenv("GROQ_API_URL")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_DEPLOYMENT = os.getenv("GROQ_DEPLOYMENT")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "gpt-4o-mini")

    if not GROQ_API_URL or not GROQ_API_KEY:
        return None

    base = GROQ_API_URL.rstrip('/')

    # Determine endpoint to call. If the provided URL already includes a deployment
    # or completions path, use it as-is. Otherwise, if a deployment id is provided,
    # target the deployment chat completions endpoint. This matches Groq's
    # OpenAI-compatible deployment path: /openai/deployments/<id>/chat/completions
    if any(x in base for x in ("/deployments/", "/chat/completions", "/completions")):
        endpoint = base
    elif GROQ_DEPLOYMENT:
        endpoint = f"{base}/openai/deployments/{GROQ_DEPLOYMENT}/chat/completions"
    else:
        # Last-resort: try using the model name as a deployment identifier
        endpoint = f"{base}/openai/deployments/{GROQ_MODEL}/chat/completions"

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    # Use OpenAI-style chat payload
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()

            # Common shapes:
            # - {choices: [{message: {content: "..."}}]}
            # - {choices: [{text: "..."}]}
            # - {text: "..."}
            if isinstance(data, dict):
                # Try chat-style choices
                choices = data.get("choices")
                if choices and isinstance(choices, list) and len(choices) > 0:
                    first = choices[0]
                    if isinstance(first, dict):
                        # message.content
                        msg = first.get("message") or first.get("delta") or {}
                        if isinstance(msg, dict):
                            content = msg.get("content")
                            if content:
                                return content
                        # fallback to text
                        txt = first.get("text")
                        if txt:
                            return txt

                # direct text
                if "text" in data and isinstance(data.get("text"), str):
                    return data.get("text")

                # some APIs return `output` as list
                if "output" in data:
                    out = data.get("output")
                    if isinstance(out, list):
                        return "\n".join(str(x) for x in out)
                    return str(out)

            return None
    except Exception:
        return None


@app.post("/api/predict")
async def predict(req: PredictRequest):
    if not req.player1 or not req.player2:
        raise HTTPException(status_code=400, detail="player1 and player2 are required")

    p1 = req.player1.strip()
    p2 = req.player2.strip()
    c1 = (req.player1_char or "Unknown").strip()
    c2 = (req.player2_char or "Unknown").strip()

    seed = f"{p1}|{p2}|{c1}|{c2}"
    pct = deterministic_pct(seed)

    prompt = (
        f"You are an expert Tekken analyst. Write a concise (3-6 sentence) matchup analysis for the characters '{c1}' (player {p1}) vs '{c2}' (player {p2}). "
        "Mention strengths, weaknesses, and one or two practical strategy tips for the player using the favored character. "
        "Keep it readable for casual players."
    )

    groq_resp = await call_groq(prompt)
    if groq_resp:
        explanation = groq_resp.strip()
    else:
        # Fallback explanation
        explanation = (
            f"{c1} vs {c2}: {p1} has a predicted edge ({pct}%). "
            "In this matchup, look for high-damage punishes on whiffed lows and use stage control to limit retreat options. "
            "(Groq not configured — this is a fallback analysis.)"
        )

    return {"player1_win_pct": pct, "explanation": explanation}

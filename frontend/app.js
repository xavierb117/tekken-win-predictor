// ── Config ────────────────────────────────────────────────────────────────────
// When the backend is ready, point this at the real endpoint.
// Expected POST body:  { player1: "username", player2: "username" }
// Expected response:   { player1_win_pct: 63, explanation: "..." }
const API_URL = '/api/predict';

// Set to true to use fake data while the backend isn't ready yet.
const USE_STUB = true;

// ── Stub ──────────────────────────────────────────────────────────────────────
async function stubPredict(player1, player2) {
  await new Promise(r => setTimeout(r, 800)); // simulate network delay
  const pct = Math.floor(Math.random() * 41) + 30; // 30–70%
  return {
    player1_win_pct: pct,
    explanation: `Based on recent match history, ${player1} has a slight edge over ${player2} ` +
      `due to stronger character matchup performance and a higher Glicko2 trajectory. ` +
      `(Stub data — real model not connected yet.)`
  };
}

// ── API call ─────────────────────────────────────────────────────────────────
async function predict(player1, player2) {
  if (USE_STUB) return stubPredict(player1, player2);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player1, player2 }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Server error (${res.status})`);
  }

  return res.json();
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const form       = document.getElementById('predict-form');
const submitBtn  = document.getElementById('submit-btn');
const resultSec  = document.getElementById('result');
const errorSec   = document.getElementById('error-msg');
const errorText  = document.getElementById('error-text');
const winBar     = document.getElementById('win-bar');
const labelP1    = document.getElementById('label-p1');
const labelP2    = document.getElementById('label-p2');
const explanation = document.getElementById('explanation');

function showResult(player1, player2, data) {
  const pct = Math.min(100, Math.max(0, data.player1_win_pct));
  winBar.style.width = `${pct}%`;
  labelP1.textContent = `${player1}: ${pct}%`;
  labelP2.textContent = `${player2}: ${100 - pct}%`;
  explanation.textContent = data.explanation;

  errorSec.classList.add('hidden');
  resultSec.classList.remove('hidden');
}

function showError(msg) {
  errorText.textContent = msg;
  resultSec.classList.add('hidden');
  errorSec.classList.remove('hidden');
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.classList.toggle('loading', loading);
  submitBtn.textContent = loading ? 'Predicting' : 'Predict';
}

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const player1 = document.getElementById('player1').value.trim();
  const player2 = document.getElementById('player2').value.trim();

  if (!player1 || !player2) return;

  setLoading(true);
  try {
    const data = await predict(player1, player2);
    showResult(player1, player2, data);
  } catch (err) {
    showError(err.message || 'Something went wrong. Try again.');
  } finally {
    setLoading(false);
  }
});

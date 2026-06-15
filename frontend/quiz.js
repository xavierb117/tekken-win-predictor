let currentQuestion = 0;
let collectedTags = [];

const quizSection    = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const progressBar    = document.getElementById('progress-bar');
const progressLabel  = document.getElementById('progress-label');
const questionText   = document.getElementById('question-text');
const answersEl      = document.getElementById('answers');
const characterCards = document.getElementById('character-cards');
const retryBtn       = document.getElementById('retry-btn');

function renderQuestion(index) {
  const q   = QUESTIONS[index];
  const pct = (index / QUESTIONS.length) * 100;

  progressBar.style.width     = `${pct}%`;
  progressLabel.textContent   = `Question ${index + 1} of ${QUESTIONS.length}`;
  questionText.textContent    = q.question;

  answersEl.innerHTML = '';
  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.textContent = answer.text;
    btn.addEventListener('click', () => selectAnswer(answer.tags));
    answersEl.appendChild(btn);
  });
}

function selectAnswer(tags) {
  collectedTags.push(...tags);
  currentQuestion++;

  if (currentQuestion >= QUESTIONS.length) {
    showResults();
  } else {
    renderQuestion(currentQuestion);
  }
}

function calculateResults() {
  const tagSet = new Set(collectedTags);

  const scored = CHARACTERS.map(char => ({
    ...char,
    score: char.tags.filter(t => tagSet.has(t)).length,
  }));

  scored.sort((a, b) => b.score - a.score);

  // Include characters within 1 point of the top score, up to 3
  const topScore  = scored[0].score;
  const threshold = Math.max(1, topScore - 1);
  return scored.filter(c => c.score >= threshold).slice(0, 3);
}

function showResults() {
  progressBar.style.width   = '100%';
  progressLabel.textContent = 'Complete';

  const top = calculateResults();

  characterCards.innerHTML = '';
  top.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <div class="char-avatar">${char.name[0]}</div>
      <div class="char-info">
        <div class="char-name">${char.name}</div>
        <span class="char-difficulty difficulty-${char.difficulty}">${char.difficulty}</span>
        <p class="char-description">${char.description}</p>
      </div>
    `;
    characterCards.appendChild(card);
  });

  quizSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
}

function reset() {
  currentQuestion = 0;
  collectedTags   = [];
  quizSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  renderQuestion(0);
}

retryBtn.addEventListener('click', reset);

renderQuestion(0);

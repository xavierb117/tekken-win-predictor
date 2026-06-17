const root = document.documentElement;
const btn  = document.getElementById('theme-toggle');

function syncBtn() {
  btn.textContent = root.classList.contains('light') ? '☾ Dark' : '☀ Light';
}

btn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('tekken-theme', root.classList.contains('light') ? 'light' : 'dark');
  syncBtn();
});

syncBtn();

let current = '';
let previous = '';
let operation = null;

const currentEl = document.getElementById('current');
const previousEl = document.getElementById('previous');

function updateDisplay() {
  currentEl.textContent = current || '0';
  previousEl.textContent = previous && operation ? `${previous} ${operation}` : '';
}
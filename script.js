let current = '';
let previous = '';
let operation = null;

const currentEl = document.getElementById('current');
const previousEl = document.getElementById('previous');

function updateDisplay() {
  currentEl.textContent = current || '0';
  previousEl.textContent = previous && operation ? `${previous} ${operation}` : '';
}

function appendNumber(num) {
  if (num === '.' && current.includes('.')) return;
  current = (current === '0' && num !== '.') ? num : current + num;
  updateDisplay();
}

document.querySelectorAll('[data-number]').forEach(btn => {
  btn.addEventListener('click', ()=> appendNumber(btn.textContent));
});

function chooseOperation(op) {
  if (current === '' && previous === '') return;
  if (current === '' && previous !== '') {
    operation = op;
    updateDisplay();
    return;
  }
  if (previous === '') {
    previous = current;
    current = '';
    operation = op;
  } else {
    compute();
    operation = op;
  }
  updateDisplay();
}

document.querySelectorAll('[data-action="operator"]').forEach(btn => {
  btn.addEventListener('click', ()=> chooseOperation(btn.textContent));
});
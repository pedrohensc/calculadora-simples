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
function compute() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;
  let result;
  switch (operation) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '×': result = prev * curr; break;
    case '÷':
      if (curr === 0) { result = 'Erro'; break; }
      result = prev / curr; break;
    default: return;
  }
  current = String(result);
  previous = '';
  operation = null;
  updateDisplay();
}

document.querySelector('[data-action="equals"]').addEventListener('click', compute);

function clearAll() { current = ''; previous = ''; operation = null; updateDisplay(); }
function deleteLast() { current = current.slice(0,-1); updateDisplay(); }

document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);

window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendNumber(e.key);
  if (['+','-','/','*'].includes(e.key)) {
    const map = {'/':'÷','*':'×'};
    chooseOperation(map[e.key] || e.key);
  }
  if (e.key === 'Enter' || e.key === '=') compute();
  if (e.key === 'Backspace') deleteLast();
  if (e.key.toLowerCase() === 'c') clearAll();
});
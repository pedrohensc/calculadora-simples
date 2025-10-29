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

function invertSign() {
  if (current === '' || current === '0') return;
  if (current.startsWith('-')) {
    current = current.slice(1);
  } else {
    current = '-' + current;
  }
  updateDisplay();
}

// Criar botão +/- no HTML, por exemplo, entre 0 e =
// Se já tiver botão, vincule o evento:
const invertBtn = document.createElement('button');
invertBtn.textContent = '+/-';
invertBtn.dataset.action = 'invert';
invertBtn.addEventListener('click', invertSign);
document.querySelector('.buttons').insertBefore(invertBtn, document.querySelector('[data-action="equals"]'));

let memory = 0;

function memoryAdd() { memory += parseFloat(current) || 0; }
function memorySubtract() { memory -= parseFloat(current) || 0; }
function memoryRecall() { current = String(memory); updateDisplay(); }
function memoryClear() { memory = 0; }

const memButtons = [
  {text:'M+', action: memoryAdd},
  {text:'M-', action: memorySubtract},
  {text:'MR', action: memoryRecall},
  {text:'MC', action: memoryClear},
];

memButtons.forEach(btnInfo => {
  const btn = document.createElement('button');
  btn.textContent = btnInfo.text;
  btn.addEventListener('click', btnInfo.action);
  document.querySelector('.buttons').insertBefore(btn, document.querySelector('[data-number]'));
});
function computeAndPrepareNext(op) {
  if (current === '') return;
  if (previous !== '') {
    compute();
  }
  operation = op;
  previous = current;
  current = '';
  updateDisplay();
}

// Alterar os botões de operação para usar essa função
document.querySelectorAll('[data-action="operator"]').forEach(button => {
  button.addEventListener('click', () => {
    computeAndPrepareNext(button.textContent);
  });
});

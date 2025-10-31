let current = '';
let previous = '';
let operation = null;
let resultDisplayed = false;
let lastOperation = null;

const currentEl = document.getElementById('current');
const previousEl = document.getElementById('previous');

// Atualiza o display
function updateDisplay() {
  currentEl.textContent = current || '0';
  previousEl.textContent = previous && operation ? `${previous} ${operation}` : '';
}

// Adiciona número
function appendNumber(num) {
  if (num === '.' && current.includes('.')) return;
  current = (current === '0' && num !== '.') ? num : current + num;
  updateDisplay();
}

// Escolhe operação
function chooseOperation(op) {
  if (current === '' && previous === '') return;
  if (previous !== '' && current !== '') compute();
  operation = op;
  previous = current;
  current = '';
  updateDisplay();
}

// Computa resultado
function compute() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operation) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '×': result = prev * curr; break;
    case '÷': result = curr === 0 ? 'Erro' : prev / curr; break;
    default: return;
  }

  current = String(result);
  previous = '';
  lastOperation = { op: operation, value: curr };
  operation = null;
  resultDisplayed = true;
  updateDisplay();
}

// Repetir última operação
function handleEqual() {
  if (resultDisplayed && lastOperation) {
    const prev = parseFloat(current);
    let result;
    switch (lastOperation.op) {
      case '+': result = prev + lastOperation.value; break;
      case '-': result = prev - lastOperation.value; break;
      case '×': result = prev * lastOperation.value; break;
      case '÷': result = lastOperation.value === 0 ? 'Erro' : prev / lastOperation.value; break;
    }
    current = String(result);
    updateDisplay();
  } else {
    compute();
  }
  resultDisplayed = true;
}

// Limpar e deletar
function clearAll() { current = ''; previous = ''; operation = null; updateDisplay(); }
function deleteLast() { current = current.slice(0, -1); updateDisplay(); }

// Inverter sinal
function invertSign() {
  if (current === '' || current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

// Funções de memória
let memory = 0;
function memoryAdd() { memory += parseFloat(current) || 0; }
function memorySubtract() { memory -= parseFloat(current) || 0; }
function memoryRecall() { current = String(memory); updateDisplay(); }
function memoryClear() { memory = 0; }

// Eventos de clique
document.querySelectorAll('[data-number]').forEach(btn => {
  btn.addEventListener('click', () => appendNumber(btn.textContent));
});

document.querySelectorAll('[data-action="operator"]').forEach(btn => {
  btn.addEventListener('click', () => chooseOperation(btn.textContent));
});

document.querySelector('[data-action="equals"]').addEventListener('click', handleEqual);
document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);

// Teclado
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendNumber(e.key);
  if (['+','-','/','*'].includes(e.key)) {
    const map = {'/':'÷','*':'×'};
    chooseOperation(map[e.key] || e.key);
  }
  if (e.key === 'Enter' || e.key === '=') handleEqual();
  if (e.key === 'Backspace') deleteLast();
  if (e.key.toLowerCase() === 'c') clearAll();
});

// Criação dos botões dinâmicos
const container = document.querySelector('.buttons');

const invertBtn = document.createElement('button');
invertBtn.textContent = '+/-';
invertBtn.addEventListener('click', invertSign);
container.insertBefore(invertBtn, document.querySelector('[data-action="equals"]'));

const memButtons = [
  {text:'M+', action: memoryAdd},
  {text:'M-', action: memorySubtract},
  {text:'MR', action: memoryRecall},
  {text:'MC', action: memoryClear},
];
memButtons.forEach(info => {
  const btn = document.createElement('button');
  btn.textContent = info.text;
  btn.addEventListener('click', info.action);
  container.insertBefore(btn, document.querySelector('[data-number]'));
});


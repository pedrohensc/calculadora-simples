let current = '';
let previous = '';
let operation = null;
let resultDisplayed = false;
let lastOperation = null; // Armazena a última operação e valor para repetição

const currentEl = document.getElementById('current');
const previousEl = document.getElementById('previous');

// Atualiza o display
function updateDisplay() {
  currentEl.textContent = current || '0';
  previousEl.textContent = previous && operation ? `${previous} ${operation}` : '';

}
function mudarFundoVerde() {
  document.body.style.backgroundColor = 'green';
}
// botão porcentagem
function handlePercent() {
  if (current === '') return;
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

document.querySelector('[data-action="percent"]').addEventListener('click', handlePercent);

// Adiciona número
function appendNumber(num) {
  // Se um número for adicionado, saímos do modo 'resultado exibido'
  if (resultDisplayed) {
    current = '';
    resultDisplayed = false;
  }
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
  resultDisplayed = false; // Garante que a repetição só ocorra após um '='
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
  
  // SALVA a operação e o valor para repetição
  lastOperation = { op: operation, value: curr }; 
  
  operation = null;
  resultDisplayed = true;
  updateDisplay();
}

// Repetir última operação (Corrigido para repetição contínua!)
function handleEqual() {
  if (resultDisplayed && lastOperation) {
    // Está no modo de repetição (apertou '=' repetidas vezes)
    const prev = parseFloat(current);
    const repeatValue = lastOperation.value;
    
    let result;
    switch (lastOperation.op) {
      case '+': result = prev + repeatValue; break;
      case '-': result = prev - repeatValue; break;
      case '×': result = prev * repeatValue; break;
      case '÷': result = repeatValue === 0 ? 'Erro' : prev / repeatValue; break;
      default: return;
    }

    current = String(result);
    // previous e lastOperation NÃO SÃO LIMPOS, garantindo a repetição
    updateDisplay();
  } else {
    // Chamada inicial de '='
    compute();
  }
  resultDisplayed = true;
}

// Limpar e deletar
function clearAll() { 
  current = ''; 
  previous = ''; 
  operation = null; 
  lastOperation = null; // Limpa a memória de repetição
  resultDisplayed = false;
  updateDisplay(); 
}
function deleteLast() { current = current.slice(0, -1); updateDisplay(); }

// Inverter sinal
  if (current === '' || current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}


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

// FEAT: Adiciona timestamp de uso (Implementação feita por Ruan em 2025-11-13)
function mostrarTimestamp() {
    const agora = new Date();
    const timestamp = `Último uso: ${agora.toLocaleTimeString()}`;
    console.log(timestamp);
    return timestamp;
}

// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelector('.previous-operand').textContent = mostrarTimestamp();
    }, 1000);
});

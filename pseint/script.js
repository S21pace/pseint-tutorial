script.js: Define todas las interacciones de la página

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  prepareCodeBlocks();
  setupIntroQuiz();
  setupSumExample();
  setupProductExercise();
  setupParExample();
  setupIfQuiz();
  setupSumaNExample();
  setupFactorialExercise();
  setupSolutions();
});

/**
 * Convierte cada línea de los bloques de código en un elemento span para poder
 * aplicar resaltado a líneas individuales. Esto facilita el efecto paso a paso.
 */
function prepareCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre.code-block');
  codeBlocks.forEach((block) => {
    const lines = block.textContent.split('\n');
    const wrapped = lines
      .map((line) => {
        // Escapamos los caracteres HTML para evitar interpretación
        const escaped = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<span class="code-line">${escaped}</span>`;
      })
      .join('\n');
    block.innerHTML = wrapped;
  });
}

/**
 * Configura el cuestionario de la sección de introducción.
 */
function setupIntroQuiz() {
  const btn = document.getElementById('checkIntroQuiz');
  const result = document.getElementById('introQuizResult');
  btn.addEventListener('click', () => {
    const questions = document.querySelectorAll('#inicio .quiz-question');
    let correctCount = 0;
    let total = questions.length;
    questions.forEach((q) => {
      const name = q.querySelector('input').getAttribute('name');
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      const correct = q.dataset.correct;
      if (selected && selected.value === correct) {
        correctCount++;
      }
    });
    if (correctCount === total) {
      result.textContent = '¡Correcto! Has entendido la introducción.';
      result.className = 'quiz-result correct';
    } else {
      result.textContent = `Has respondido ${correctCount} de ${total} correctamente. Vuelve a leer la introducción y vuelve a intentarlo.`;
      result.className = 'quiz-result incorrect';
    }
  });
}

/**
 * Configura el ejemplo interactivo de suma paso a paso.
 */
function setupSumExample() {
  const runBtn = document.getElementById('runSum');
  const stepBtn = document.getElementById('stepSum');
  const resetBtn = document.getElementById('resetSum');
  const output = document.getElementById('sumOutput');
  const codeBlock = document.getElementById('sumCode');
  const lines = codeBlock.querySelectorAll('span.code-line');
  let state = {
    a: null,
    b: null,
    suma: null,
    step: 0,
    running: false,
  };

  // Ejecutar todo de una sola vez
  runBtn.addEventListener('click', () => {
    // Limpia cualquier resaltado anterior
    resetHighlight(lines);
    // Obtiene los valores como números. Utilizar Number() evita interpretar
    // cadenas vacías como cero (parseFloat podría producir NaN con espacios).
    const aInput = document.getElementById('inputA').value;
    const bInput = document.getElementById('inputB').value;
    const aVal = Number(aInput);
    const bVal = Number(bInput);
    // Comprueba que ambos campos tengan contenido y que sean números válidos
    if (aInput.trim() === '' || bInput.trim() === '' || Number.isNaN(aVal) || Number.isNaN(bVal)) {
      output.style.display = 'block';
      output.textContent = 'Por favor, ingresa dos números válidos.';
      return;
    }
    const suma = aVal + bVal;
    const message = `La suma es: ${suma}`;
    output.style.display = 'block';
    output.textContent = message;
    // Mostrar también en una ventana de alerta para asegurar que el usuario vea el resultado
    alert(message);
  });

  // Paso a paso
  stepBtn.addEventListener('click', () => {
    // Si es la primera vez, inicializamos el estado y limpiamos
    if (state.step === 0) {
      resetHighlight(lines);
      state.a = null;
      state.b = null;
      state.suma = null;
      output.style.display = 'block';
      output.textContent = '';
    }
    // Si ya no hay más pasos, finalizar
    if (state.step >= lines.length) {
      output.textContent += '\nFin del algoritmo.';
      return;
    }
    // Resaltar línea actual
    resetHighlight(lines);
    const currentLine = lines[state.step];
    currentLine.classList.add('highlight');
    // Ejecutar acción de la línea según su índice (basado en el código del ejemplo)
    switch (state.step) {
      case 1: // Definir a, b, suma
        output.textContent += 'Se definen las variables a, b y suma.\n';
        break;
      case 2: // Escribir "Ingrese primer número:"
        output.textContent += 'Se solicita el primer número al usuario.\n';
        break;
      case 3: // Leer a
        const aVal = parseFloat(document.getElementById('inputA').value);
        if (isNaN(aVal)) {
          output.textContent += 'Error: debes ingresar el valor de a antes de continuar.\n';
          return;
        }
        state.a = aVal;
        output.textContent += `a <- ${aVal}\n`;
        break;
      case 4: // Escribir "Ingrese segundo número:"
        output.textContent += 'Se solicita el segundo número al usuario.\n';
        break;
      case 5: // Leer b
        const bVal = parseFloat(document.getElementById('inputB').value);
        if (isNaN(bVal)) {
          output.textContent += 'Error: debes ingresar el valor de b antes de continuar.\n';
          return;
        }
        state.b = bVal;
        output.textContent += `b <- ${bVal}\n`;
        break;
      case 6: // suma <- a + b
        if (state.a == null || state.b == null) {
          output.textContent += 'Error: asegúrate de introducir ambos valores antes de sumar.\n';
          return;
        }
        state.suma = state.a + state.b;
        output.textContent += `suma <- ${state.a} + ${state.b} = ${state.suma}\n`;
        break;
      case 7: // Escribir "La suma es: ", suma
        if (state.suma == null) {
          output.textContent += 'Error: no se ha calculado la suma aún.\n';
        } else {
          output.textContent += `Se muestra el resultado: La suma es ${state.suma}\n`;
        }
        break;
      default:
        break;
    }
    state.step++;
  });

  // Reiniciar el ejemplo
  resetBtn.addEventListener('click', () => {
    state = { a: null, b: null, suma: null, step: 0 };
    resetHighlight(lines);
    output.textContent = '';
    output.style.display = 'none';
  });
}

/**
 * Elimina la clase highlight de todas las líneas
 */
function resetHighlight(lines) {
  lines.forEach((line) => line.classList.remove('highlight'));
}

/**
 * Configura el ejercicio de completar código para el producto de dos números.
 */
function setupProductExercise() {
  const btn = document.getElementById('checkProduct');
  const result = document.getElementById('productResult');
  btn.addEventListener('click', () => {
    const blanks = document.querySelectorAll('#basico .exercise .code-fill input.blank');
    let allCorrect = true;
    blanks.forEach((input) => {
      const expected = input.dataset.answer.toLowerCase();
      const value = input.value.trim().toLowerCase();
      if (value === expected) {
        input.style.backgroundColor = '#e6ffed';
        input.style.borderColor = '#8ac593';
      } else {
        input.style.backgroundColor = '#ffecec';
        input.style.borderColor = '#d9534f';
        allCorrect = false;
      }
    });
    if (allCorrect) {
      result.textContent = '¡Correcto! Has completado el algoritmo del producto.';
      result.className = 'exercise-result correct';
    } else {
      result.textContent = 'Algunas respuestas son incorrectas. Revisa las palabras clave como "Definir", "Leer" y "Escribir".';
      result.className = 'exercise-result incorrect';
    }
  });
}

/**
 * Configura el ejemplo condicional par/impar.
 */
function setupParExample() {
  const runBtn = document.getElementById('runPar');
  const output = document.getElementById('parOutput');
  const nInput = document.getElementById('inputN');
  // Función para evaluar si el número es par o impar y mostrar el resultado
  function evaluateParity() {
    const nVal = parseInt(nInput.value);
    if (Number.isNaN(nVal)) {
      output.style.display = 'block';
      output.textContent = 'Por favor, ingresa un número válido.';
      return;
    }
    const esPar = nVal % 2 === 0;
    const message = esPar ? 'El número es par.' : 'El número es impar.';
    output.style.display = 'block';
    output.textContent = message;
    // Mostrar alerta para asegurar la visibilidad del resultado
    alert(message);
  }
  // Ejecutar cuando se haga clic en el botón
  runBtn.addEventListener('click', evaluateParity);
  // También ejecutar automáticamente cuando cambie el valor del campo
  nInput.addEventListener('change', evaluateParity);
}

/**
 * Configura el cuestionario sobre condicionales.
 */
function setupIfQuiz() {
  const btn = document.getElementById('checkIfQuiz');
  const result = document.getElementById('ifQuizResult');
  btn.addEventListener('click', () => {
    const question = document.querySelector('#condiciones .quiz-question');
    const selected = document.querySelector('input[name="q3"]:checked');
    const correct = question.dataset.correct;
    if (selected && selected.value === correct) {
      result.textContent = '¡Correcto! La estructura se cierra con FinSi.';
      result.className = 'quiz-result correct';
    } else {
      result.textContent = 'Incorrecto. La palabra clave correcta es FinSi.';
      result.className = 'quiz-result incorrect';
    }
  });
}

/**
 * Configura el ejemplo de suma 1..N con bucle Para.
 */
function setupSumaNExample() {
  const runBtn = document.getElementById('runSumaN');
  const output = document.getElementById('sumaNOutput');
  const nInput = document.getElementById('inputN2');
  // Calcula la suma desde 1 hasta n y actualiza la salida
  function calculateSum() {
    const nVal = parseInt(nInput.value);
    if (Number.isNaN(nVal) || nVal < 1) {
      output.style.display = 'block';
      output.textContent = 'Introduce un número entero mayor o igual a 1.';
      return;
    }
    let suma = 0;
    for (let i = 1; i <= nVal; i++) {
      suma += i;
    }
    const message = `La suma desde 1 hasta ${nVal} es ${suma}.`;
    output.style.display = 'block';
    output.textContent = message;
    alert(message);
  }
  runBtn.addEventListener('click', calculateSum);
  // Ejecutar cuando el usuario cambie el valor (por ejemplo, con las flechas del campo de número)
  nInput.addEventListener('change', calculateSum);
  // Y también mientras escribe para que la suma se calcule de inmediato
  nInput.addEventListener('input', calculateSum);
}

/**
 * Configura el ejercicio de completar el algoritmo del factorial.
 */
function setupFactorialExercise() {
  const btn = document.getElementById('checkFactorial');
  const result = document.getElementById('factorialResult');
  btn.addEventListener('click', () => {
    const blanks = document.querySelectorAll('#bucles .exercise .code-fill input.blank');
    let allCorrect = true;
    blanks.forEach((input) => {
      const expected = input.dataset.answer.toLowerCase();
      const value = input.value.trim().toLowerCase();
      if (value === expected) {
        input.style.backgroundColor = '#e6ffed';
        input.style.borderColor = '#8ac593';
      } else {
        input.style.backgroundColor = '#ffecec';
        input.style.borderColor = '#d9534f';
        allCorrect = false;
      }
    });
    if (allCorrect) {
      result.textContent = '¡Perfecto! Has completado correctamente el algoritmo del factorial.';
      result.className = 'exercise-result correct';
    } else {
      result.textContent = 'Algunas respuestas son incorrectas. Revisa las palabras clave como "Definir", "Leer", "FinPara" y "Escribir".';
      result.className = 'exercise-result incorrect';
    }
  });
}

/**
 * Configura la muestra de soluciones en la sección de ejercicios adicionales.
 */
function setupSolutions() {
  const rectBtn = document.getElementById('showRectangulo');
  const rectSolution = document.getElementById('rectanguloSolution');
  rectBtn.addEventListener('click', () => {
    rectSolution.style.display = 'block';
  });
  const contBtn = document.getElementById('showContador');
  const contSolution = document.getElementById('contadorSolution');
  contBtn.addEventListener('click', () => {
    contSolution.style.display = 'block';
  });
}

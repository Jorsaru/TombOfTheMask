const pantallaEstadoDelJuego = document.getElementById("game-status"); 

// Almacena el puntaje
const viewScore = document.getElementById("score");

/**
 * Determina si una super-moneda fue tocada
 * @param {void}
 * @return {bool}
 */
function superCoinTouched() {
  superC = true;
  return superC;
};

/**
 * Reduce la cantidad de vidas actuales
 * @param {void}
 * @return {void}
 */
function substractLifes() {
  lifes--;
};

/**
 * Aumenta el puntaje
 * @param {void}
 * @return {void}
 */
function addScore() {
  points++
  updateScore();
};

/**
 * Actualiza la puntuación en el tablero
 * @param {void}
 * @return {void}
 */
function updateScore() {
  viewScore.textContent = points;
};
const menu = document.querySelector("#menu");
const firstButton = document.getElementById("firstButton");
const secondButton = document.getElementById("secondButton");
const instructions = document.getElementById("instructions");

instructions.style.display = "none";

/**
 * Permite esconder el menú
 * @param {void}
 * @return {void}
 */
function hideMenu() {
  play = true;
  canvas.focus();
  menu.classList.add("menu_hidden");
  menuSound.fadeOut(100);
  gameSound.setVolume(15);
  gameSound.play();
  gameSound.loop();
};

/**
 * Permite mostrar las instrucciones
 * @param {void}
 * @return {void}
 */
function showInstructions() {
  play = false;
  firstButton.style.display = "none";
  secondButton.style.display = "none";
  instructions.style.display = "block";
};

/**
 * Permite mostrar el menú
 * @param {void}
 * @return {void}
 */
function showMenu() {
  play = false;
  menu.classList.remove("menu_hidden");
  firstButton.style.display = "block";
  secondButton.style.display = "block";
  instructions.style.display = "none";
};
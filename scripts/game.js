// Importamos la librería 'functional-light'
const { append, cons, first, isEmpty, isList, length, rest, map } = require("fl-extended");

// Tamaño de los objectos en el canvas
const SIZE = 40;

// El mundo se dibuja en 60 veces por segundo
const framesPerSecond = 60;

// Almacena el canvas
const canvas = document.getElementById("canvas");

// Herramienta de dibujo
const ctx = canvas.getContext("2d") 

// Sonidos
const menuSound = new buzz.sound("./audios/CentralCity.ogg");
const gameSound = new buzz.sound("./audios/YellowForest.ogg");
const winSound = new buzz.sound("./audios/NewHope.ogg");
const loseSound = new buzz.sound("./audios/GameOver.ogg");

if (!buzz.isOGGSupported()) {
  alert("Your browser doesn't support OGG Format.");
};

menuSound.play();
menuSound.loop();

// Asignaciones para el mapa
const mapa = {
  width: 1000,
  height: 600,
  path: 0,
  wall: 1,
  coin: 2,
  superCoin: 3,
  mask: "M"
};

// Estado inicial del juego
const initialState = {
  time: 0,
  mask: {
    x: 12,
    y: 12
  },
  water: [{
      x: 0,
      y: 15
  }],
  matrix: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 3, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 3, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [0, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0, 1, 0, 1, 0, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 1, 0, 0, 1, 0, 1, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 1, 1, 2, 0, 0, 1, 1, 0, 1, 1, 0, 0, 2, 1, 1, 1, 2, 0, 0, 0],
    [1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 3, 2, 1, 2, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 2, 1, 2, 3, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 2, 0, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
}

// Variables
let mask = null;
let wall = null;
let coin = null;
let superCoin = null;
let heart = null;
let gameOver = null;
let victory = null;
let points = 0;
let lifes = 3;
let play = false;
let superC = false;

const processingInstance = new Processing(canvas, sketchProc);

/**
 * Genera un mundo
 * @param {object} {}
 * @param {variable} data
 * @param {value} attribute
 * @return {object}
 */
function make(data, attribute) {
  return Object.assign({}, data, attribute);
};

function sketchProc(processing) {
  // Esto se llama antes de iniciar el juego
  processing.setup = function() {
  // Se ejecuta una vez cuando se inicia el juego

    // Se actualiza 60 veces por segundo
    processing.frameRate(framesPerSecond);

    // Tamaño del mapa
    processing.size(mapa.width, mapa.height);

    // Carga de imágenes
    mask = processing.loadImage("./images/tomb.png");
    wall = processing.loadImage("./images/wall.jpg");
    coin = processing.loadImage("./images/coin.png");
    superCoin = processing.loadImage("./images/superCoin.png");
    heart = processing.loadImage("./images/heart.png");
    gameOver = processing.loadImage("./images/game-over.png");
    victory = processing.loadImage("./images/you-win.jpg");

    // Asignación del stado inicial del juego
    processing.state = Object.assign(initialState);

    // Ennfocar el canvas al inicio
    canvas.focus();
    updateScore();
  };

  // Se ejecuta 60 veces por segundo
  processing.draw = function() {
    if (play) {
      processing.drawGame(processing.state);
      processing.state = processing.onTic(processing.state);
    };
    if (lifes == 0) {
      gameSound.fadeOut(100);
      loseSound.play();
      loseSound.loop();
    }
    else if (points == 135) {
      gameSound.fadeOut(100);
      winSound.play();
      winSound.play();
    };
  };

  // Dibujar en el canvas. Aquí se pone todo lo que quieras pintar
  processing.drawGame = function(world) {
    dibujarMapa(world, processing);
    dibujarMaskAnimado(mask, world, processing);
    dibujarVidas(world, processing, lifes);
    dibujarMensaje(world, processing);
  };

  // Actualiza el mundo en cada tic del reloj. Retorna el nuevo estado del mundo
  processing.onTic = function(world) {
    // Actualización para el agua
    let yValue = world.mask.y;
    let water = first(world.water);

    if (Math.trunc(water.y) == yValue && lifes > 0) {
      substractLifes();
      return make(world, initialState);
    }
    else if (Math.trunc(water.y) > 0) {
      if (superC) {
        if (world.time == 150) {
          superC = false;
          world.time = 0;
          return make(world, {water: waterUp(world.water)});
        }
        return make(world, {time: world.time + 1, water: waterDown(world.water)});
      }
      else if (lifes == 0 || points == 135) {
        return make(world, {time: 0});
      }
      else {
        return make(world, {water: waterUp(world.water)});
      }
    }
    else {
      return make(world, {});
    }
  };

  // Actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo estado del mundo
  processing.onKeyEvent = function(world, keyCode) {
    let newX = world.mask.x;
    let newY = world.mask.y;

    if (lifes > 0) {
      switch (keyCode) {

        case processing.UP:
          let upPosition = world.matrix[newY - 1][newX];
          if (upPosition != mapa.wall) {
            if (upPosition == mapa.coin || upPosition == mapa.superCoin) {
              world.matrix[newY - 1][newX] = mapa.path;
              if (upPosition == mapa.coin) {
                addScore();
              }
              else if (upPosition == mapa.superCoin) {
                superCoinTouched();
                return make(world, { mask: { x: newX, y: newY - 1 } });
              }
              return make(world, { mask: { x: newX, y: newY - 1 } });
            }
            return make(world, { mask: { x: newX, y: newY - 1 } });
          }
          return make(world, {});

        case processing.DOWN:
          let downPosition = world.matrix[newY + 1][newX];
          if (downPosition != mapa.wall) {
            if (downPosition == mapa.coin || downPosition == mapa.superCoin) {
              world.matrix[newY + 1][newX] = 0;
              if (downPosition == mapa.coin) {
                addScore();
              }
              else if (downPosition == mapa.superCoin) {
                superCoinTouched();
                return make(world, { mask: { x: newX, y: newY + 1 } });
              }
              return make(world, { mask: { x: newX, y: newY + 1 } });
            }
            return make(world, { mask: { x: newX, y: newY + 1 } });
          }
          return make(world, {});

        case processing.LEFT:
          let leftPosition = world.matrix[newY][newX - 1];
          if (leftPosition != mapa.wall) {
            if (leftPosition == mapa.coin || leftPosition == mapa.superCoin) {
              world.matrix[newY][newX - 1] = 0;
              if (leftPosition == mapa.coin) {
                addScore();
              }
              else if (leftPosition == mapa.superCoin) {
                superCoinTouched();
                return make(world, { mask: { x: newX - 1, y: newY } });
              }
              return make(world, { mask: { x: newX - 1, y: newY } });
            }
            else if (newX == 0) {
              return make(world, { mask: { x: 24, y: newY } });
            }
            return make(world, { mask: { x: newX - 1, y: newY } });
          }
          return make(world, {});

        case processing.RIGHT:
          let rightPosition = world.matrix[newY][newX + 1];
          if (rightPosition != mapa.wall) {
            if (rightPosition == mapa.coin || rightPosition == mapa.superCoin) {
              world.matrix[newY][newX + 1] = 0;
              if (rightPosition == mapa.coin) {
                addScore();
              }
              else if (rightPosition == mapa.superCoin) {
                superCoinTouched();
                return make(world, { mask: { x: newX + 1, y: newY } });
              }
              return make(world, { mask: { x: newX + 1, y: newY } });
            }
            else if (newX == 24) {
              return make(world, { mask: { x: 0, y: newY } });
            }
            return make(world, { mask: { x: newX + 1, y: newY } });
          }
          return make(world, {});

        default:
          return world;
      }
    }
    else {
      return make(world, {});
    }
  };

  // Esta función se ejecuta cada vez que presionamos una tecla
  processing.keyPressed = function() {
    processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
  };
}
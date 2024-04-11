const canvas = $("#canvas")[0];
const context = canvas.getContext("2d");
let score = 0;
let direction = "right";
let isPaused = false;
const boxSize = 32;
let canvasSize = 512;
let nextDirection = null;
let gameLoopInterval;
let intervalDuration = 300;
let isMute = false;
let snake = [
  {
    x: 8 * boxSize,
    y: 8 * boxSize,
  },
];

let numBlocks = (canvasSize / boxSize);

let food = {
  x: Math.floor(Math.random() * numBlocks) * boxSize,
  y: Math.floor(Math.random() * numBlocks) * boxSize,
};

document.addEventListener('click', function() {
  tocarTrilhaSonora('trilha-menu');
});


canvas.width = canvasSize;
canvas.height = canvasSize;

// Função para criar o fundo do canvas
function createBackground() {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, canvasSize, canvasSize);
}

// Função para desenhar a cobra
function drawSnake() {
  $.each(snake, function (index, segment) {
    context.fillStyle = "green";
    context.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// Função para desenhar a comida
function drawFood() {
  context.fillStyle = "brown";
  context.beginPath();
  context.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, 2 * Math.PI);
  context.fill();
}

// Evento de teclado
$(document).on("keydown", function (event) {
  // Armazenar a próxima direção desejada
  if (event.keyCode == 37 && direction !== "right") nextDirection = "left";
  else if (event.keyCode == 38 && direction !== "down") nextDirection = "up";
  else if (event.keyCode == 39 && direction !== "left") nextDirection = "right";
  else if (event.keyCode == 40 && direction !== "up") nextDirection = "down";
  // updateCanvas()
  if (event.keyCode === 80) {
    console.log('aaa');
    togglePause();
  }
});

function updateCanvas() {

  if (nextDirection !== null) {
    direction = nextDirection;
    nextDirection = null;
  }
  createBackground();
  drawSnake();
  drawFood();
  moveSnake();
  checkFoodCollision();

}

function moveSnake() {
  let newHead = {
    x: snake[0].x,
    y: snake[0].y,
  };
  switch (direction) {
    case "right":
      newHead.x += boxSize;
      break;
    case "left":
      newHead.x -= boxSize;
      break;
    case "up":
      newHead.y -= boxSize;
      break;
    case "down":
      newHead.y += boxSize;
      break;
  }
  handleWallCrossing(newHead);
  handleSelfCollision(newHead);
  snake.unshift(newHead);
}

function handleWallCrossing(newHead) {
  if (newHead.x >= numBlocks * boxSize) newHead.x = 0;
  if (newHead.x < 0) newHead.x = (numBlocks - 1) * boxSize;
  if (newHead.y >= numBlocks * boxSize) newHead.y = 0;
  if (newHead.y < 0) newHead.y = (numBlocks - 1) * boxSize;
}

function handleSelfCollision(newHead) {
  for (let i = 1; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      endGame();
      return;
    }
  }
}

function checkFoodCollision() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    generateNewFoodPosition();
    score += 10;
    $(".top-score").html(score);

    // Aumentar a velocidade a cada 30 pontos
    if (score % 30 === 0) {
      clearInterval(gameLoopInterval);
      intervalDuration -= 10;
      gameLoopInterval = setInterval(updateCanvas, intervalDuration);
    }
    tocarTrilha('bloop');
  } else {
    snake.pop();
  }
}

function generateNewFoodPosition() {
  let emptySpaces = [];
  for (let i = 0; i < numBlocks; i++) {
    for (let j = 0; j < numBlocks; j++) {
      let position = { x: i * boxSize, y: j * boxSize };
      if (!snake.some(segment => segment.x === position.x && segment.y === position.y)) {
        emptySpaces.push(position);
      }
    }
  }
  let randomIndex = Math.floor(Math.random() * emptySpaces.length);
  food = emptySpaces[randomIndex];
}

// Função para iniciar o jogo
function startGame() {
  pararTrilha('trilha-menu');
  tocarTrilhaSonora('trilha3');
  resetGame();
  // Para iniciar a sequência de trilhas:
  createBackground();
  gameLoopInterval = setInterval(updateCanvas, intervalDuration);
}

// Função para pausar o jogo
function togglePause() {
  if (gameLoopInterval) {
    tocarTrilha('pause')
    clearInterval(gameLoopInterval);
    // gameLoopInterval = undefined;
    if (isPaused) {
      gameLoopInterval = setInterval(updateCanvas, intervalDuration);
      $(".popup").hide();
      tocarTrilhaSonora('trilha3');
    } else {
      pararTrilha('trilha3');
      clearInterval(gameLoopInterval);
      $(".popup").css("display", "flex");
    }
    isPaused = !isPaused;
    showPopup("Game Paused", "Resume Game", "btn-pause");
  }
}

// Função para encerrar o jogo
function endGame() {
  pararTrilha('trilha3');
  tocarTrilha('game-over');
  $(".popup").css("display", "flex");
  showPopup(
    "Game Over",
    "Play Again",
    "btn-gameover",
    "Your score: " + score
  );
  $(".top-score").html(0);
  resetVars();
}

// Função para resetar o jogo
function resetGame() {
  $(".popup").hide();
  $(".start-screen").hide();
  $(".game").css("display", "flex");
  $(".top-score").html(0);
  resetVars();

}

function resetVars() {
  score = 0;
  intervalDuration = 300;
  snake = [
    {
      x: 8 * boxSize,
      y: 8 * boxSize,
    },
  ];
  food = {
    x: Math.floor(Math.random() * numBlocks) * boxSize,
    y: Math.floor(Math.random() * numBlocks) * boxSize,
  };
  clearInterval(gameLoopInterval);
  gameLoopInterval = undefined;
  isPaused = false;
  nextDirection = null;
  direction = "right";
}

// Função para exibir pop-up
function showPopup(title, action, className = "", description = "") {
  $(".popup-title").html(title);
  $(".popup-description").html(description);
  $(".popup-button").html(action);
  $(".popup-button").addClass(className);
}

// Função para exibir tela inicial
function showStartScreen() {
  navigate(".high-scores");
}

// Função de navegação entre telas
function navigate(oldLocation, newLocation = ".start-screen") {
  $(oldLocation).hide();
  $(newLocation).css("display", "flex");
  $(".popup").hide();
  resetVars();
  pararTrilha('trilha3');
  tocarTrilhaSonora('trilha-menu');
}

// Evento de clique no botão de pop-up
$(".popup-button").on("click", function (e) {
  let classes = e.target.className.split(" ");
  let className = classes[classes.length - 1];
  switch (className) {
    case "btn-gameover":
      startGame();
      break;
    case "btn-pause":
      togglePause();
      break;

    default:
      break;
  }
});





function tocarTrilhaSonora(trilhaId) {
  if (isMute) return
  const trilha = document.getElementById(trilhaId);
  trilha.loop = true;
  trilha.play();

  trilha.onended = function () {
    trilha.currentTime = 0;
    trilha.play();
  };
}

function tocarTrilha(trilhaId) {
  if (isMute) return
  const trilha = document.getElementById(trilhaId);
  trilha.currentTime = 0;
  trilha.play();
}


function pararTrilha(trilhaId) {
  const trilha = document.getElementById(trilhaId);
  trilha.currentTime = 0;
  trilha.pause(); // Pausa a reprodução da trilha
}
$(".fa-volume-mute").hide();
function muteGame() {
  if (!isMute) {
    pararTrilha('trilha3')
    $(".fa-volume-up").hide();
    $(".fa-volume-mute").css("display", "inline-block");
    isMute = !isMute;
  } else {
    isMute = !isMute;
    tocarTrilhaSonora('trilha3')
    $(".fa-volume-mute").hide();
    $(".fa-volume-up").css("display", "inline-block");
  }
}


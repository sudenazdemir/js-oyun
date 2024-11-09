const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const userPaddle = document.getElementById('userPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const ball = document.getElementById('ball');
const userScoreDisplay = document.getElementById('userScore');
const computerScoreDisplay = document.getElementById('computerScore');

const gameArea = document.getElementById('gameArea');
let paused = false;
let gameOver = false;
let userScore = 0;
let computerScore = 0;

// Paddle ve top özellikleri
const user = { y: 150, x: 0, speed: 8 }; // Kullanıcı paddle'ı solda (x: 0)
const computer = { y: 150, x: gameArea.clientWidth - 10, speed: 4 }; // Bilgisayar paddle'ı sağda
const ballProps = {
  x: gameArea.clientWidth / 2 - 10,
  y: gameArea.clientHeight / 2 - 10,
  velocityX: 3,
  velocityY: 4,
  speed: 5
};

const update = () => {
  if (!paused && !gameOver) {
    // Top hareketi
    ballProps.x += ballProps.velocityX;
    ballProps.y += ballProps.velocityY;

    // Topun üst ve alt kenarlarla çarpışması
    if (ballProps.y <= 0 || ballProps.y + 20 >= gameArea.clientHeight) {
      ballProps.velocityY = -ballProps.velocityY;
    }

    // Bilgisayar paddle'ının hareketi
    computer.y += (ballProps.y - (computer.y + 50)) * 0.05;

    // Çarpışma kontrolleri
    checkCollision(userPaddle, user);
    checkCollision(computerPaddle, computer);

    // Skor kontrolleri
    if (ballProps.x <= 0) {
      computerScore++;
      resetBall();
    } else if (ballProps.x + 20 >= gameArea.clientWidth) {
      userScore++;
      resetBall();
    }

    // Skorları güncelle
    userScoreDisplay.textContent = userScore;
    computerScoreDisplay.textContent = computerScore;

    // Oyunun sonlanma durumu
    if (userScore >= 3 || computerScore >= 3) {
      endGame(userScore >= 3 ? "Kullanıcı" : "Bilgisayar");
    }

    render();
  }

  if (!gameOver) requestAnimationFrame(update);
};

const render = () => {
  userPaddle.style.top = `${user.y}px`;
  userPaddle.style.left = `${user.x}px`;
  
  computerPaddle.style.top = `${computer.y}px`;
  computerPaddle.style.left = `${computer.x}px`;
  
  ball.style.left = `${ballProps.x}px`;
  ball.style.top = `${ballProps.y}px`;
};

const checkCollision = (paddle, player) => {
  const ballRect = ball.getBoundingClientRect();
  const paddleRect = paddle.getBoundingClientRect();

  if (ballRect.left < paddleRect.right && ballRect.right > paddleRect.left &&
      ballRect.top < paddleRect.bottom && ballRect.bottom > paddleRect.top) {
    ballProps.velocityX = -ballProps.velocityX;
    ballProps.speed += 0.2;
  }
};

const resetBall = () => {
  ballProps.x = gameArea.clientWidth / 2 - 10;
  ballProps.y = gameArea.clientHeight / 2 - 10;
  ballProps.velocityX = 3 * (Math.random() > 0.5 ? 1 : -1);
  ballProps.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
};

const endGame = (winner) => {
  alert(`${winner} kazandı!`);
  gameOver = true;
  startScreen.classList.add('active');
  gameScreen.classList.remove('active');
  startBtn.textContent = "Yeniden Başla";
};

const startGame = () => {
  startScreen.classList.remove('active');
  gameScreen.classList.add('active');
  
  userScore = 0;
  computerScore = 0;
  gameOver = false;
  paused = false;
  resetBall();
  
  requestAnimationFrame(update);
};

// Başlat ve duraklat/durdur düğmeleri
startBtn.addEventListener('click', startGame);

pauseBtn.addEventListener('click', () => {
  if (!gameOver) {
    paused = !paused;
    pauseBtn.textContent = paused ? "Devam Et" : "Durdur";
  }
});

// Kullanıcı paddle hareketi
gameArea.addEventListener('mousemove', (e) => {
  const rect = gameArea.getBoundingClientRect();
  user.y = e.clientY - rect.top - userPaddle.clientHeight / 2;
});

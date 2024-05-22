const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const gameOverText = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const jumpSound = document.getElementById('jumpSound');
const collisionSound = document.getElementById('collisionSound');
const backgroundMusic = document.getElementById('backgroundMusic');

let playerPos = { x: window.innerWidth / 2, y: 0 };
let isJumping = false;
let gravity = 0.9;
let lives = 5;
let obstacleSpeed = 2; // Base speed for obstacles
let spawnInterval = 2000; // Interval for spawning obstacles
let score = 0;
let scoreInterval;

function startGame() {
    lives = 5;
    playerPos = { x: window.innerWidth / 2, y: 0 };
    isJumping = false;
    gameOverText.style.display = 'none';
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    player.style.left = `${playerPos.x}px`;
    gameLoop();
    backgroundMusic.play();
    setInterval(() => {
        spawnObstacle();
        // Increase difficulty over time
        if (spawnInterval > 500) {
            spawnInterval -= 100;
        }
        if (obstacleSpeed < 4) {
            obstacleSpeed += 0.1;
        }
    }, spawnInterval);
    scoreInterval = setInterval(() => {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    }, 1000);
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpSound.play();
        let jumpHeight = 150;
        let jumpSpeed = 20;
        let jumpInterval = setInterval(() => {
            if (jumpHeight <= 0) {
                clearInterval(jumpInterval);
                let fallInterval = setInterval(() => {
                    if (playerPos.y >= 0) {
                        clearInterval(fallInterval);
                        isJumping = false;
                    }
                    playerPos.y += jumpSpeed;
                    jumpSpeed -= gravity;
                    player.style.bottom = `${10 + playerPos.y}px`;
                }, 20);
            }
            playerPos.y -= jumpSpeed;
            jumpSpeed -= gravity;
            player.style.bottom = `${10 + playerPos.y}px`;
        }, 20);
    }
}

function moveLeft() {
    playerPos.x -= 20;
    if (playerPos.x < 0) playerPos.x = 0;
    player.style.left = `${playerPos.x}px`;
}

function moveRight() {
    playerPos.x += 20;
    if (playerPos.x > window.innerWidth - 50) playerPos.x = window.innerWidth - 50;
    player.style.left = `${playerPos.x}px`;
}

function spawnObstacle() {
    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    let obstacleType = Math.random();
    if (obstacleType < 0.33) {
        obstacle.classList.add('movingVertical');
    } else if (obstacleType < 0.66) {
        obstacle.classList.add('movingHorizontal');
    }
    obstacle.style.right = '-50px';
    obstacle.style.bottom = `${Math.random() * 50 + 10}%`;
    obstacle.style.width = `${Math.random() * 30 + 20}px`;
    obstacle.style.height = `${Math.random() * 30 + 20}px`;
    gameContainer.appendChild(obstacle);

    let obstacleInterval = setInterval(() => {
        let obstacleRect = obstacle.getBoundingClientRect();
        let playerRect = player.getBoundingClientRect();

        if (obstacleRect.right >= playerRect.left && obstacleRect.left <= playerRect.right &&
            obstacleRect.bottom >= playerRect.top && obstacleRect.top <= playerRect.bottom) {
            collisionSound.play();
            lives--;
            if (lives <= 0) {
                gameOver();
            }
            gameContainer.removeChild(obstacle);
            clearInterval(obstacleInterval);
        }

        if (obstacleRect.right >= window.innerWidth) {
            gameContainer.removeChild(obstacle);
            clearInterval(obstacleInterval);
        }

        // Increase obstacle speed
        obstacle.style.animationDuration = `${obstacleSpeed}s`;
    }, 20);
}

function gameOver() {
    gameOverText.style.display = 'block';
    finalScoreDisplay.innerText = `Your Score: ${score}`;
    backgroundMusic.pause();
    clearInterval(scoreInterval);
}

function gameLoop() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp') {
            jump();
        } else if (e.code === 'ArrowLeft') {
            moveLeft();
        } else if (e.code === 'ArrowRight') {
            moveRight();
        }
    });
}

startGame();

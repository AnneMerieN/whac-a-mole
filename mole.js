let currMoleTile;
let currPlantTile1; // First bomb
let currPlantTile2; // Second bomb
let score = 0;
let gameOver = false;
let timeLeft = 30;
let gameTimer;
let moleInterval;
let plantInterval;

// ✅ Sound Effects
let whackSound = new Audio("./whack.wav");
let gameOverSound = new Audio("./explosion.wav");
let bgMusic = new Audio("./background-music.mp3");
bgMusic.loop = true;

// ✅ Ensure high score loads properly
document.addEventListener("DOMContentLoaded", function () {
    let storedHighScore = localStorage.getItem("highScore");

    if (storedHighScore === null) {
        storedHighScore = 0;
        localStorage.setItem("highScore", storedHighScore);
    }

    document.getElementById("highScore").innerText = "High Score: " + storedHighScore;
});

window.onload = function () {
    let button = document.getElementById("startButton");

    if (button) {
        console.log("✅ Start button found! Adding event listener.");
        button.addEventListener("click", startGame);
    } else {
        console.error("❌ Start button NOT found. Check your HTML.");
    }
};

// ✅ Function to start/reset the game properly
function startGame() {
    console.log("🎮 Start Game function triggered!");

    // ✅ Change button text to "Restart Game"
    document.getElementById("startButton").innerText = "Restart Game";

    bgMusic.play();

    score = 0;
    gameOver = false;
    timeLeft = 30;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = "Time: " + timeLeft + "s";

    document.getElementById("timer").style.color = "white";

    // ✅ Clear the board before setting up a new game
    document.getElementById("board").innerHTML = "";
    console.log("🎯 Game board cleared!");

    // ✅ Stop any previous intervals before starting a new game
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    clearInterval(gameTimer);

    setGame();
    console.log("🎯 setGame() called!");

    gameTimer = setInterval(updateTimer, 1000);
}

// ✅ Function to update the timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("timer").innerText = "Time: " + timeLeft + "s";

        // 🔥 Flash red when time is running out
        if (timeLeft <= 5) {
            document.getElementById("timer").style.color = "red";
        } else {
            document.getElementById("timer").style.color = "white";
        }
    } else {
        gameOver = true;
        document.getElementById("score").innerText = "GAME OVER: " + score;
        clearInterval(gameTimer);
    }
}

// ✅ Function to set up the game board
function setGame() {
    console.log("setGame() function running...");

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    console.log("Game board created!");

    moleInterval = setInterval(setMole, 1000);
    plantInterval = setInterval(setBombs, 2000); // ✅ Now spawns TWO bombs instead of one!
}

// ✅ Function to get a random tile ID
function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

// ✅ Function to spawn Bidoof
function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";

    let mole = document.createElement("img");
    mole.src = "./bidoof.png";
    mole.style.width = "100px";
    mole.style.height = "100px";
    mole.style.transition = "transform 0.2s ease-in-out";
    mole.style.transform = "scale(0)";

    let num = getRandomTile();
    if ((currPlantTile1 && currPlantTile1.id === num) || (currPlantTile2 && currPlantTile2.id === num)) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);

    setTimeout(() => {
        mole.style.transform = "scale(1)";
    }, 10);
}

// ✅ Function to spawn TWO bombs
function setBombs() {
    if (gameOver) return;

    // ✅ Clear old bombs safely
    if (currPlantTile1) currPlantTile1.innerHTML = "";
    if (currPlantTile2) currPlantTile2.innerHTML = "";

    let bomb1 = document.createElement("img");
    bomb1.src = "./bomb.png";
    bomb1.style.width = "100px";
    bomb1.style.height = "100px";

    let bomb2 = document.createElement("img");
    bomb2.src = "./bomb.png";
    bomb2.style.width = "100px";
    bomb2.style.height = "100px";

    let num1 = getRandomTile();
    let num2 = getRandomTile();

    // ✅ Ensure both bombs appear in different spots
    let attempts = 0;
    while (num2 === num1 && attempts < 10) {
        num2 = getRandomTile();
        attempts++;
    }

    currPlantTile1 = document.getElementById(num1);
    if (currPlantTile1) currPlantTile1.appendChild(bomb1);

    currPlantTile2 = document.getElementById(num2);
    if (currPlantTile2) currPlantTile2.appendChild(bomb2);
}

// ✅ Function to handle clicking on tiles
function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();

        // ✅ Update high score if beaten
        let storedHighScore = localStorage.getItem("highScore");
        if (score > storedHighScore) {
            localStorage.setItem("highScore", score);
            document.getElementById("highScore").innerText = "High Score: " + score;
        }

        whackSound.play();
    } else if (this === currPlantTile1 || this === currPlantTile2) { // ✅ Now checks for TWO bombs
        document.getElementById("score").innerText = "GAME OVER: " + score;
        gameOver = true;
        gameOverSound.play();
        clearInterval(gameTimer);
    }
}

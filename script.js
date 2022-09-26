// board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context; 

// snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// food
var foodX;
var foodY;

var gameOver = false;

// For Score Saving
var playerName;
var playerScore;

window.onload = function() {
    getPlayerName();
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();

    // ADJUST SPEED HERE
    setInterval(update, 2000/10); //100 milliseconds

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("modalBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        viewScores();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function update() {
    if (gameOver) {
        return;
    }

    // BOARD SETUP
    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        incrementScore();
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    // Adds to snake length
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // GAME OVER CONDITIONS
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;

        // Gets score from DOM and saves it to local storage
        playerScore = document.getElementById('scoreCounter').innerHTML;
        localStorage.setItem(playerName, playerScore);
        
        // Alerts Game overs
        alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            playerScore = document.getElementById('scoreCounter').innerHTML;
            localStorage.setItem(playerName, playerScore);
            alert("Game Over");
        }
    }
}

// Snake to Key Mapping
function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Places food in random block
function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Increment Score
function incrementScore() {
    var score = document.getElementById('scoreCounter');
    var number = score.innerHTML;
    number++;
    score.innerHTML = number;
}

// Retrieve player name via prompt
function getPlayerName() {
    playerName = window.prompt("Enter your name: ");

    var headerText = document.getElementById('header');
    var newText = headerText.innerHTML + " - " + playerName + "\'s Turn";

    headerText.innerHTML = newText;
}

function viewScores() {

    // Find a <table> element with id="myTable":
    var table = document.getElementById("scoreTable");
    
    for (var i = 0; i < localStorage.length; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        // Add some text to the new cells:
        cell1.innerHTML = localStorage.key(i);
        cell2.innerHTML = localStorage.getItem(localStorage.key(i));
    }
}
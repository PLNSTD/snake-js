const container = document.getElementById('main');
const controlPanel = document.getElementById('controls-panel');
const gameField = document.getElementById('game-field');
const playBtn = document.getElementById('play-button');
const restartBtn = document.getElementById('restart-button');
const scoreText = document.getElementById('score');
const root = document.querySelector(':root');
const primaryClr = getComputedStyle(root).getPropertyValue('--clr-primary');
const MAX_ROWS = 40;
const MAX_COLS = 40;
let snakeBodyCells = [];
let lastBodyCell;
let point_x;
let point_y;
let food_x;
let food_y;
let foodPoint;
let foodCell;
let foodAte = false;
let score = 0;
let lastKeyPressed;
let interval;
let cells;
let playing = false;

function gridCreation() {
    for (let i = 0; i < MAX_ROWS * MAX_COLS; i++) {
        let cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gameField.appendChild(cell);
    }
}

function coordinatesToLinear(x, y) {
    return (y * MAX_COLS) + x;
}

function random(number) {
    return Math.floor(Math.random() * number);
}

function gameStart() {
    if (playing)
        return;
    lastKeyPressed = 'Enter';
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval('move(lastKeyPressed)', 200);
    score = 0;
    point_x = 19;
    point_y = 19;
    let startPointIdx = coordinatesToLinear(point_x, point_y);
    cells = gameField.children;
    let startCell = cells.item(startPointIdx);
    startCell.classList.add('snake-body');
    snakeBodyCells = [];
    snakeBodyCells.push(startCell);
    lastBodyCell = startCell;
    window.focus();
    if (foodCell === undefined) foodGenerator(cells);
    play(cells);
}

function play() {
    window.addEventListener('keydown', function(e) {
        playing = true;
        if (e.key == 'ArrowLeft' && lastKeyPressed != 'Right') { //Left
            move('Left');
        } else if (e.key == 'ArrowUp' && lastKeyPressed != 'Down') { //Up
            move('Up');
        } else if (e.key == 'ArrowRight' && lastKeyPressed != 'Left') { //Right
            move('Right');
        } else if (e.key == 'ArrowDown' && lastKeyPressed != 'Up') { //Down
            move('Down');
        }
    })
}

function move(direction) {
    if (!playing) return;
    if (direction == 'Left') {
        if (point_x == 0) {
            point_x = 39;
        } else {
            point_x--;
        }
        allowMove('Left', cells);
    } else if (direction == 'Up') {
        if (point_y == 0) {
            point_y = 39;
        } else {
            point_y--;
        }
        allowMove('Up', cells);
    } else if (direction == 'Right') {
        if (point_x == 39) {
            point_x = 0;
        } else { 
            point_x++;
        }
        allowMove('Right', cells);
    } else if (direction == 'Down') {
        if (point_y == 39) {
            point_y = 0;
        } else {
            point_y++;
        }
        allowMove('Down', cells);
    }
}

function allowMove(direction, cells) {
    currentPoint = coordinatesToLinear(point_x, point_y);
    foodAte = moving(currentPoint, cells);
    if (foodAte === undefined) {
        console.log('hello');
        restartGame();
    }
    if (foodAte) {
        score++;
        scoreText.textContent = 'SCORE: ' + score;
        foodGenerator(cells);
    }
    lastKeyPressed = direction;
}

function foodGenerator(cells) {
    food_x = random(40);
    food_y = random(40);

    if (food_x == point_x && food_y == point_y) {
        foodGenerator(cells);
    } else {
        foodPoint = coordinatesToLinear(food_x, food_y);
        foodCell = cells.item(foodPoint);
        let foodFigure = document.createElement('div');
        foodFigure.classList.add('food-cell');
        foodCell.appendChild(foodFigure);
    }
}

function moving(newPoint, cells) {
    lastBodyCell = snakeBodyCells[0];
    let newCell = cells.item(newPoint);
    foodPoint = coordinatesToLinear(food_x, food_y);
    if (snakeBodyCells.includes(newCell)) {
        clearInterval(interval);
        alert('GAME OVER');
        return;
    }
    newCell.classList.add('snake-body');
    snakeBodyCells.push(newCell);
    if (newPoint == foodPoint) {
        foodCell.innerHTML = '';
        return true;
    }
    lastBodyCell.classList.remove('snake-body');
    snakeBodyCells.splice(0,1);
    return false;
}

function restartGame() {
    clearInterval(interval);
    playing = false;
    score = 0;
    scoreText.textContent = 'SCORE: ' + score;
    snakeBodyCells.forEach(element => {
        element.classList.remove('snake-body');
        element.classList.remove('game-over')
    });
    snakeBodyCells = [];
    lastKeyPressed = 'Enter';
    gameStart();
}

playBtn.addEventListener('click', function() {
    gameStart();
})

restartBtn.addEventListener('click', function(e) {
    restartGame();
})

gridCreation();




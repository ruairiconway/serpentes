'use strict'

// ==== VARIABLES

    // start
const startBtn = document.querySelector('.start')
let speed = 500
let modifier = 0.75
let speedId = 0
    // score
let score = 0
const scoreboard = document.querySelector('.scoreboard')
    // grid
const grid = document.querySelector('.grid')
const width = 20
let squares = []
const gameOver = document.querySelector('.game-over')
    // snake
let currentSnake = [185,184,183]
let direction = 1
    // apple
let appleIndex = 0
    // direction buttons
const btnUp = document.querySelector('.btn-up')
const btnRight = document.querySelector('.btn-right')
const btnDown = document.querySelector('.btn-down')
const btnLeft = document.querySelector('.btn-left')
    // copyright
const copyrightYear = document.querySelector('.copyright-year')


// ==== HANDLE

    // directions
function directionUp() { direction = -width }
function directionRight() { direction = 1 }
function directionDown() { direction = width }
function directionLeft() { direction = -1 }

function handleSnakeKeyControl(e) {
    // change direction on keydown
    if (e.keyCode === 38) { // up
        directionUp()
    } else if (e.keyCode === 39) { // right
        directionRight()
    } else if (e.keyCode === 40) { // down
        directionDown()
    } else if (e.keyCode === 37) { // left
        directionLeft()
    }
}

function handleSnakeBtnControl() {
    // change direction on button
    btnUp.addEventListener('click', directionUp)
    btnRight.addEventListener('click', directionRight)
    btnDown.addEventListener('click', directionDown)
    btnLeft.addEventListener('click', directionLeft)
}

function handleEatApple(tail) {
    // eat and generate apple
    squares[currentSnake[0]].classList.remove('apple')
    generateApple()
    // grow snake
    squares[tail].classList.add('snake')
    currentSnake.push(tail)
    // increase speed
    clearInterval(speedId)
    speed = speed * modifier
    speedId = setInterval(handleSnakeMove, speed)
    // update score
    score++
    scoreboard.textContent = score
}

function handleSnakeMove() {
    // stop movement and show 'game over' if snake hits
    if (
        (currentSnake[0] - width < 0 && direction === -width) || // top
        (currentSnake[0] % width === width-1 && direction === 1) || // right
        (currentSnake[0] + width >= width*width && direction === width) || // bottom
        (currentSnake[0] % width === 0 && direction === -1) || // left
        squares[currentSnake[0] + direction].classList.contains('snake') // self
    ) {
        gameOver.classList.remove('game-over-hidden')
        return clearInterval(speedId)
    }
    // snake motion, remove tail add new head
    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    currentSnake.unshift(currentSnake[0] + direction)
    squares[currentSnake[0]].classList.add('snake')
    // lookout for apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        handleEatApple(tail)
    }
}

function handleStartGame() {
    // clear interval
    clearInterval(speedId)
    // remove snake + apple + gameOver
    gameOver.classList.add('game-over-hidden')
    currentSnake.forEach( i => squares[i].classList.remove('snake') )
    squares[appleIndex].classList.remove('apple')
    // reset values + scoreboard + apple
    currentSnake = [185,184,183]
    direction = 1
    speed = 500
    score = 0
    scoreboard.textContent = score
    generateApple()
    // trigger movement
    currentSnake.forEach( i => squares[i].classList.add('snake'))
    speedId = setInterval(handleSnakeMove, speed)
}


// ==== GENERATE 

function generateYear() {
    // generate year for copyright sign-off
    copyrightYear.textContent = new Date().getFullYear()
}

function generateGrid() {
    // generate grid
    for (let i = 0; i < width*width; i++) {
        // create div and add 'square' class
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)
        squares.push(square)
    }
}

function generateSnake() {
    // add 'snake' class to currentSnake i's within squares
    currentSnake.forEach( i => squares[i].classList.add('snake'))
}

function generateApple() {
    // add 'apple' class to random square in grid when snake overlaps with current apple
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
        // checks to make sure apples don't generate on snake
        let isOnSnake = currentSnake.includes(appleIndex)
        if(isOnSnake) {
            generateApple()
        }
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
}


// ==== WATCH

function watchStart() {
    document.addEventListener('keydown', handleSnakeKeyControl)
    handleSnakeBtnControl()
    startBtn.addEventListener('click', handleStartGame)
}


// ==== ON LOAD

generateYear()
generateGrid()
generateSnake()
watchStart()
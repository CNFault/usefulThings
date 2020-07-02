const CELL_SIZE = 40 // размер клетки фонового поля
const FIELD_SIZE = 40 // размер клетки игрового поля

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1914
canvas.height = 800

const mouse = getMouse(canvas) // следим за положением мыши над canvas
const game = new Game

function clearCanvas() { // очищаем canvas
    canvas.width |= 0
}

function drawGrid() { // строки 28-53: рисуем фоновое поле
    context.strokeStyle = 'black'
    context.lineWidth = 0.5

    for (let i = 0; i < canvas.width / CELL_SIZE; i++) { // вертикальные линии
        context.beginPath()
        context.moveTo(i * CELL_SIZE, 0)
        context.lineTo(i * CELL_SIZE, canvas.height)
        context.stroke()
    }

    for (let i = 0; i < canvas.height / CELL_SIZE; i++) { // горизонтальные линии
        context.beginPath()
        context.moveTo(0, i * CELL_SIZE)
        context.lineTo(canvas.width, i * CELL_SIZE)
        context.stroke()
    }

    context.lineWidth = 2 // красная линия
    context.strokeStyle = 'red'

    context.beginPath()
    context.moveTo(110, 0)
    context.lineTo(110, canvas.height)
    context.stroke()
}

function getRandomFrom(array) { // случайные координаты для хода // возвращаем случ элемент массива
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}
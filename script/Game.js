class Game {
    constructor() {
        this.stage = "play"
        this.playerOrder = true

        this.player = new Topology({
            name: prompt("Как Вас зовут?"),
            offsetX: 400,
            offsetY: 120
        })

        this.computer = new Topology({
            name: prompt("Дайте имя Компьютеру?"),
            offsetX: 1000,
            offsetY: 120,
            secret: true
        })

        this.text = ""
        this.result = ""

        this.computerColldown = 500 // как долго ходит компьютер
        this.computerTimeout = 0 // сколько прошло

        this.pTimestamp = 0 // сколько мс работала программа к пред итерации
        this.dTimestamp = 0 // сколько прошло

        this.computer.randoming()
        this.player.randoming()

        requestAnimationFrame(x => this.tick(x)) //регистрирует вызов функции ~60р/с
    }

    tick(timestamp) { // проверка стадии игры
        requestAnimationFrame(x => this.tick(x)) // рекурсивно вызываем эту функцию

        this.dTimestamp = timestamp - this.pTimestamp
        this.pTimestamp = timestamp

        clearCanvas()
        drawGrid()

        this.player.draw(context) //рисуем поле
        this.computer.draw(context) //рисуем поле

        if (this.stage === "play") { // начало игры

            if (this.computer.isEnd()) {
                this.stage = 'end'
                this.result = `${this.player.name}, поздравляю с победой!`
                this.text = "Игра окончена!.."
            }

            else if (this.player.isEnd()) {
                this.stage = 'end'
                this.result = `Увы, победил ${this.computer.name}, попробуй еще раз!`
                this.computer.secret = false
                this.text = "Игра окончена!.."
            }
            this.tickPlay()
        }

        this.drawText(context)
        this.drawResult(context)

        mouse.pleft = mouse.left
    }

    tickPlay() { //ходы человека и компьютера
        if (this.playerOrder) { // ход игрока
            this.text = "Ходит " + this.player.name

            if (!this.computer.isPointUnder(mouse)) { //проверка над полем
                return
            }

            const point = this.computer.getCoordinats(mouse)

            if (mouse.left && !mouse.pleft) { // клик (была отжата, стала зажата)
                this.computer.addChecks(point)
                this.computer.update()

                if (!this.computer.isShipUnderPoint(point)) { // проверка на доп ход при попадании
                    this.playerOrder = false
                    this.computerTimeout = 0
                }
            }
        }

        else {
            this.text = "Ходит " + this.computer.name

            if (this.computerColldown >= this.computerTimeout) {
                this.computerTimeout += this.dTimestamp
                return
            }

            const point = getRandomFrom(this.player.getUnknownFields()) // получаем рандомную клетку из всех неизвестных

            this.player.addChecks(point)
            this.player.update()

            if (!this.player.isShipUnderPoint(point)) {
                this.playerOrder = true
            }
        }
    }

    drawText(context) {
        context.beginPath()
        context.textAlign = "center"
        context.textBaseline = "top"
        context.fillStyle = 'blue'
        context.font = "bold 52px serif"
        context.fillText(this.text, context.canvas.width / 2, 35)
    }

    drawResult(context) {
        context.beginPath()
        context.textAlign = "center"
        context.textBaseline = "top"
        context.fillStyle = 'red'
        context.font = "bold 52px serif"
        context.fillText(this.result, context.canvas.width / 2, 700)
    }
}


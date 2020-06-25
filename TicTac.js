class TicTak {
	topology = Array(9).fill(null) //2-8 поля экземпляра
	ticMove = true //чей ход
	status = null //отображение информации на экране
	view = null //само игровое поле (все 9 клеток)
	play = false //идет игра или нет
	firstPlayer = 'computer'
	secondPlayer = 'computer'

	static ticSrc = 'img/1.png'
	static tacSrc = 'img/2.jpg'
	static lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]] //победные комбинации

	constructor(props = {}) {
		this.view = document.createElement('div') //строки 15-23 создаем поле
		this.view.classList.add('game_area')

		this.updateView();

		this.view.addEventListener('click', e => this.handlerClick(e)) //на все 9 клеток навешиваем событие

		this.status = document.createElement('span')
		this.status.textContent = "Ход крестиков"

		if (props.firstPlayer) { //устанавливаем роль первого игрока
			this.firstPlayer = props.firstPlayer
		}

		if (props.secondPlayer) {//устанавливаем роль второго игрока
			this.secondPlayer = props.secondPlayer
		}

		if (props.autoStart) {
			this.start()
		}
	}

	get isFull() { //проверяем заполнено ли все поле
		return !this.topology.includes(null)
	}

	get winner() {
		for (const order of ['tic', 'tac']) { //поочередно проверяем победу крестиков и ноликов
			for (const line of TicTak.lines) { //проверяем победные линии
				let winner = true

				for (const index of line) {
					if (this.topology[index] !== order) {
						winner = false
						break
					}
				}

				if (winner) {
					return order
				}
			}
		}

		return null //если никто не победил
	}

	get isEnd() { //проверка конца игры
		return Boolean(this.winner || this.isFull)
	}

	start() { //начинаем игру
		this.play = true

		if (this.firstPlayer === 'computer') {
			this.computerMove()
		}
	}

	handlerClick(event) { //проверяем что кликнули по пустой ячейке и отправляем индекс этой ячейки в move
		if (!event.target.classList.contains('cell')) {
			return
		}

		const cell = parseInt(event.target.dataset.cell)
		this.move(cell)
	}

	move(cell) { //проверки на возможность походить в эту клетку
		if (!this.play) { // если закончена - выходим
			return
		}

		if (this.topology[cell]) { // если ячейка не пустая
			return
		}

		this.topology[cell] = this.ticMove ? 'tic' : 'tac' //если пустая то вкладываем tic || tac
		this.ticMove = !this.ticMove // смена хода

		this.updateView() // разместить крестик или нолик (визуальная часть)

		if (this.winner) {
			this.play = false
			this.status.textContent = "Победили " + (this.winner === 'tic' ? "крестики" : "нолики")
			this.handlerEnd() //вызываем обработчик конца игры
		}

		else if (this.isFull) { //если все поля заполнены то ничья
			this.play = false
			this.status.textContent = "Ничья"
			this.handlerEnd()
		}

		else if (this.ticMove) {
			this.status.textContent = "Ход крестиков"
		}

		else {
			this.status.textContent = "Ход ноликов"
		}

		if (this.ticMove && this.firstPlayer === 'computer') { //позволяем компьютеру ходить
			this.computerMove()
		}

		else if (!this.ticMove && this.secondPlayer === 'computer') {//позволяем компьютеру ходить
			this.computerMove()
		}
	}

	computerMove() {
		const variants = []

		for (let i = 0; i < 9; i++) {
			if (!this.topology[i]) { //если ячейка пустая то она может стать вариантом для хода
				variants.push(i)
			}
		}

		const cell = variants[Math.floor(Math.random() * variants.length)]
		this.move(cell) //выбираем случайную
	}

	updateView() { //обновляем визуальную часть
		this.view.innerHTML = ''

		for (let i = 0; i < 9; i++) {
			const cellElement = document.createElement('div')
			cellElement.classList.add('cell')
			cellElement.dataset.cell = i

			if (this.topology[i]) {
				const img = new Image()
				img.src = this.topology[i] === 'tic' ? TicTak.ticSrc : TicTak.tacSrc // забираем адрес изображения из статических свойств
				cellElement.append(img)
			}

			this.view.append(cellElement)
		}
	}

	clear() { //приводим игровое поле к стартовому положению
		this.topology = Array(9).fill(null)
		this.updateView()
		this.play = false
		this.ticMove = true
		this.status.textContent = "Ход крестиков"
	}

	handlerEnd() { }
}


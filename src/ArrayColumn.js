class ArrayColumn { //описывает поведение колонки. Через него создаем экземляры колонок
	constructor(order, number) {
		this.number = number

		const div = document.createElement('div')
		div.innerHTML = `<div class="column" style="order: ${order}"><p>${this.number}</p></div>`

		this.view = div.firstChild
	}

	get order() {
		return parseInt(this.view.style.order)
	}

	set order(order) {
		this.view.style.order = order
	}
}
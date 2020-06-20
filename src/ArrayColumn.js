class ArrayColumn { //описывает поведение колонки. Через него создаем экземляры колонок
	constructor(order, index) { //функция инициализации экземпляра, вызывается при создании нового экземпляра класса 
		this.index = index

		const div = document.createElement('div')
		div.innerHTML = `<div class="vcolumn" style="order: ${order}"><p>${this.index}</p></div>`

		this.view = div.firstChild // осуществляется доступ к дом жлементу который отображает колонку
	}

	get order() { //используем чтоб поменять две колонки местами
		return parseInt(this.view.style.order)
	}

	set order(order) {
		this.view.style.order = order
	}
}
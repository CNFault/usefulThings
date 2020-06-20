const startButton = document.querySelector('.start');
const aniSpeed = document.querySelector('.aniSpeed');
const MAX_HEIGHT = 500; //макс высота самого большого столбца
const MIN_HEIGHT = 50; //мин высота самого маленького столбца
const generateScaleY = (min, max) => n => MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * ((n - min) / (max - min)); // нужно масштабировать колонки в каком-то пределе. 
//его задаем через min max height
const appElement = document.querySelector('.app');
const array = [];

let arrayLength = +prompt('Введите длину массива от 0 до 80');


while (arrayLength < 0 || arrayLength > 80) {
	alert('Пожалуйста, введите число в указанном диапазоне')
	arrayLength = +prompt('Введите длину массива от 0 до 80');
}

for (let i = 0; i < arrayLength; i++) {
	const number = Math.floor(Math.random() * 100)
	const arrCol = new ArrayColumn(i, number) //arrCol

	array.push(arrCol)
}

document.querySelector('.initialData').innerHTML = array.map(x => x.number).join(', '); //не передает массив!!!!!!!!!!!!!!!!!!!!!!!!!


const scaleY = generateScaleY(
	Math.min(...array.map(x => x.number)), // ищем минимум из всего массива (спред для того чтобы в math.min передать массив)
	Math.max(...array.map(x => x.number)) // ищем максимум из всего массива
)

array.forEach(arrCol => arrCol.view.style.height = `${scaleY(arrCol.number)}px`); //для каждого элемента задаем высоту колонки

appElement.append(...array.map(x => x.view)); //помещаем каждый столбец в дом!!!!!!!!!!!!!!

startButton.addEventListener('click', async () => {
	startButton.disabled = true;
	startButton.innerText = 'Ожидание...';
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length - 1 - i; j++) {
			const columnLeft = array[j];
			const columnRight = array[j + 1];

			columnLeft.view.classList.add('selected'); // двум сравниваемым элементам присваиваем класс selected
			columnRight.view.classList.add('selected'); // двум сравниваемым элементам присваиваем класс selected

			await sleep((2000 - aniSpeed.value) / 2);

			if (columnLeft.number > columnRight.number) { // сравниваем i & i+1
				columnLeft.view.classList.add('changed'); // при true элементам присваиваем класс changed
				columnRight.view.classList.add('changed'); // при true элементам присваиваем класс changed

				const orderA = columnLeft.order; //swap алгоритм
				const orderB = columnRight.order;

				columnLeft.order = orderB;
				columnRight.order = orderA;
			}

			await sleep((2000 - aniSpeed.value) / 2);

			columnLeft.view.classList.remove('selected', 'changed'); // удаляем ранее присвоенные классы
			columnRight.view.classList.remove('selected', 'changed'); // удаляем ранее присвоенные классы

			array.sort((a, b) => a.order - b.order); //одна копия сам массив, другая в дом дереве. Синхронизация видимой и программной части
			document.querySelector('.finaleData').innerHTML = array.map(x => x.number).join(', ');

		}

	}

	startButton.innerText = 'Готово';
})


function sleep(n) { //приостанавливает выполнение кода на n мс
	return new Promise(r => setTimeout(r, n))
}

document.querySelector('.update').onclick = function () {
	location.reload(); // обновить страницу
}

// классы, promise, наследование классов, паттерны, алгоритм сортировки
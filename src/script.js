const startButton = document.querySelector('.start');
const aniSpeed = document.querySelector('.i-13');
document.querySelector('.arrayLengthConfirm').onclick = f4();

function f4() {
	arrayLength = document.querySelector('.i-14').value;
	// location.reload(); // обновить страницу
	return arrayLength
} //не обновляется число столбцов после нажатия кнопки!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


const MAX_HEIGHT = 500; //макс высота самого большого столбца
const MIN_HEIGHT = 50; //мин высота самого маленького столбца


const generateScaleY = (min, max) => n => MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * ((n - min) / (max - min)); // нужно масштабировать колонки в каком-то пределе. 
//его задаем через min max height
const appElement = document.querySelector('.app');

const array = [];

let aq = +prompt('Введите длину массива');

for (let i = 0; i < aq; i++) {
	const index = Math.floor(Math.random() * 100)
	const number = new ArrayColumn(i, index) //arrCol

	array.push(number)
}

document.querySelector('.initialData').innerHTML = array.map(x => x.index).join(', '); //не передает массив!!!!!!!!!!!!!!!!!!!!!!!!!


const scaleY = generateScaleY(
	Math.min(...array.map(x => x.index)), // ищем минимум из всего массива (спред для того чтобы в math.min передать массив)
	Math.max(...array.map(x => x.index)) // ищем максимум из всего массива
)

array.forEach(number => number.view.style.height = `${scaleY(number.index)}px`); //для каждого элемента задаем высоту колонки

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

			if (columnLeft.index > columnRight.index) { // сравниваем i & i+1
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
			document.querySelector('.finaleData').innerHTML = array.map(x => x.index).join(', ');

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
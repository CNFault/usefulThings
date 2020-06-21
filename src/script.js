const startButton = document.querySelector('.start');
const aniSpeed = document.querySelector('.aniSpeedValue');
const MAX_HEIGHT = 500; //максимальная высота самого большого столбца
const MIN_HEIGHT = 50; //минимальная высота самого маленького столбца
const generateScaleY = (min, max) => n => MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * ((n - min) / (max - min)); // масштабируем колонки
const appElement = document.querySelector('.app');

const array = [];

let arrayLength = +prompt('Введите длину массива от 2 до 70');

while (arrayLength < 0 || arrayLength > 70 || isNaN(arrayLength)) { // проверяем, что пользователь ввел нужный тип данных 
   alert('Пожалуйста, введите число в указанном диапазоне')
   arrayLength = +prompt('Введите длину массива от 2 до 70');
}

for (let i = 0; i < arrayLength; i++) { // заполняем массив
   const number = Math.floor(Math.random() * 100);
   const arrCol = new ArrayColumn(i, number);
   array.push(arrCol);
}

document.querySelector('.initialData').innerHTML = array.map(x => x.number).join(', '); // выводим изначальный массив на страницу

const scaleY = generateScaleY( // строки 25-30: ищем минимальное и максимальное числа. Для каждого элемента задаем высоту колонки
   Math.min(...array.map(x => x.number)),
   Math.max(...array.map(x => x.number))
)

array.forEach(arrCol => arrCol.view.style.height = `${scaleY(arrCol.number)}px`);

appElement.append(...array.map(x => x.view)); //помещаем каждый столбец в DOM

startButton.addEventListener('click', async () => { // событие на кнопку startButton
   startButton.disabled = true;
   startButton.innerText = 'Ожидание...';
   for (let i = 0; i < array.length; i++) { // строки 37-66: перебор, навешивание классов, сортировка, удаление классов, задержка в анимации
      for (let j = 0; j < array.length - 1 - i; j++) {
         const columnLeft = array[j];
         const columnRight = array[j + 1];

         columnLeft.view.classList.add('selected');
         columnRight.view.classList.add('selected');

         await sleep((2000 - aniSpeed.value) / 2);

         if (columnLeft.number > columnRight.number) {
            columnLeft.view.classList.add('changed');
            columnRight.view.classList.add('changed');

            const orderA = columnLeft.order;
            const orderB = columnRight.order;

            columnLeft.order = orderB;
            columnRight.order = orderA;
         }

         await sleep((2000 - aniSpeed.value) / 2);

         columnLeft.view.classList.remove('selected', 'changed');
         columnRight.view.classList.remove('selected', 'changed');

         array.sort((a, b) => a.order - b.order); // Синхронизация видимой и программной части
         document.querySelector('.finaleData').innerHTML = array.map(x => x.number).join(', ');
      }
   }
   startButton.innerText = 'Готово';
})

function sleep(n) { //приостанавливает выполнение кода на n мс
   return new Promise(r => setTimeout(r, n))
}

document.querySelector('.update').onclick = function () {
   location.reload();
}
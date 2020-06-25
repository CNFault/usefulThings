const startButton = document.querySelector('button')
const firstPlayerSelector = document.querySelector('select[name="firstPlayer"]')
const secondPlayerSelector = document.querySelector('select[name="secondPlayer"]')

const tt = new TicTak({ //создаем новый экз класса, передаем props
	autoStart: false,
	firstPlayer: 'human',
	secondPlayer: 'human',
})

let winnerTic = 0;
let winnerTac = 0;
let resultAreaTic = document.querySelector('.game_area_wrapper_result_tic');
let resultAreaTac = document.querySelector('.game_area_wrapper_result_tac');


let counter = 0
tt.handlerEnd = () => { // обработчик конца партии
	counter++

	if (tt.winner === 'tic') {
		winnerTic++
		resultAreaTic.innerHTML = `Крестики: ${winnerTic}`;
	} else if (tt.winner === 'tac') {
		winnerTac++
		resultAreaTac.innerHTML = `Нолики: ${winnerTac}`;
	}

	const liElement = document.createElement('li')
	liElement.textContent = tt.status.textContent
	document.querySelector('ol').append(liElement)

	if (counter < 5) {
		startButton.disabled = false
		firstPlayerSelector.disabled = false
		secondPlayerSelector.disabled = false
	}
}

document.querySelector('.game_area_wrapper').append(tt.view);

document.querySelector('.game_result_area').append(tt.status);

startButton.addEventListener('click', () => {
	startButton.disabled = true
	firstPlayerSelector.disabled = true
	secondPlayerSelector.disabled = true

	tt.firstPlayer = firstPlayerSelector.value
	tt.secondPlayer = secondPlayerSelector.value
	tt.clear()
	tt.start()
})
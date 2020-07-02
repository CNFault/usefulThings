function getMouse(element) {
    const mouse = {
        x: 0,
        y: 0,
        left: false,
        pleft: false
    }

    element.addEventListener('mousemove', function (event) { // получем координаты
        const rect = element.getBoundingClientRect() // абсолютное положение элемента относительно угла стр
        mouse.x = event.clientX - rect.left
        mouse.y = event.clientY - rect.top
    })

    element.addEventListener("mousedown", function (event) { // отказываемся от click, так как тут canvas а не DOM
        if (event.buttons === 1) {
            mouse.left = true
        }
    })

    element.addEventListener("mouseup", function (event) {
        if (event.buttons !== 1) {
            mouse.left = false
        }
    })

    return mouse
}
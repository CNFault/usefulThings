class Topology {
    constructor(param) {
        this.offsetX = param.offsetX; // отступ по X
        this.offsetY = param.offsetY; // отступ по Y
        this.secret = param.secret || false;
        this.name = param.name;

        this.ships = [];// массив с кораблями
        this.checks = []; //массив с проверенными ячейками, куда кто-то стрелял
        this.injuries = [];
    }

    addShips(...ships) { // добавляем корабли
        for (const ship of ships) {
            if (!this.ships.includes(ship)) {
                this.ships.push(ship);
            }
        }

        return this;
    }

    addChecks(...checks) { // добавляем проверенные ячейки
        for (const check of checks) {
            if (!this.checks.includes(check)) {
                this.checks.push(check);
            }
        }

        return this;
    }

    draw(context) { //рисуем корабли, пров.ячейки, ранения, имена
        this.drawFields(context);

        if (!this.secret) {
            for (const ship of this.ships) {
                this.drawShip(context, ship);
            }
        }

        for (const check of this.checks) {
            this.drawCheck(context, check);
        }

        for (const injury of this.injuries) {
            this.drawInjury(context, injury);
        }

        this.drawName(context);


        return this;
    }

    drawInjury(context, injury) { // рисуем ранения
        context.strokeStyle = 'red';
        context.lineWidth = 1.5;

        context.beginPath();
        context.moveTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE,
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE
        );
        context.lineTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE * 2,
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE * 2
        );
        context.stroke();

        context.beginPath();
        context.moveTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE * 2,
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE
        );
        context.lineTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE,
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE * 2
        );
        context.stroke();

        return this;
    }

    drawFields(context) { //рисуем поле
        context.strokeStyle = "blue";
        context.lineWidth = 1.7;

        for (let i = 0; i <= 11; i++) { //рисуем вертикальные линии
            context.beginPath();
            context.moveTo(
                this.offsetX + i * FIELD_SIZE,
                this.offsetY
            );
            context.lineTo(
                this.offsetX + i * FIELD_SIZE,
                this.offsetY + 11 * FIELD_SIZE
            );
            context.stroke();
        }

        for (let i = 0; i <= 11; i++) { //рисуем горизонтальные линии
            context.beginPath();
            context.moveTo(
                this.offsetX,
                this.offsetY + i * FIELD_SIZE
            );
            context.lineTo(
                this.offsetX + 11 * FIELD_SIZE,
                this.offsetY + i * FIELD_SIZE
            );
            context.stroke();
        }

        context.textAlign = "center";
        context.font = "25px Times New Roman";

        const alphabet = "АБВГДЕЖЗИК"; // рисуем буквы
        for (let i = 0; i < 10; i++) {
            const letter = alphabet[i];

            context.fillText(
                letter,
                this.offsetX + i * FIELD_SIZE + FIELD_SIZE * 1.5,
                this.offsetY + FIELD_SIZE * 0.8
            );
        }

        for (let i = 1; i <= 10; i++) { // и цифры
            context.fillText(
                i,
                this.offsetX + FIELD_SIZE * 0.5,
                this.offsetY + i * FIELD_SIZE + FIELD_SIZE * 0.8
            );
        }

        return this;
    }

    drawShip(context, ship) { // рисуем корабли
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';

        context.beginPath();
        context.rect(
            this.offsetX + ship.x * FIELD_SIZE + FIELD_SIZE,
            this.offsetY + ship.y * FIELD_SIZE + FIELD_SIZE,
            (ship.direct === 0 ? ship.size : 1) * FIELD_SIZE,
            (ship.direct === 1 ? ship.size : 1) * FIELD_SIZE
        );
        context.fill();

        return this;
    }

    drawCheck(context, check) { // рисуем точки проверенных клеток
        context.fillStyle = 'black';

        context.beginPath();
        context.arc(
            this.offsetX + check.x * FIELD_SIZE + FIELD_SIZE * 1.5,
            this.offsetY + check.y * FIELD_SIZE + FIELD_SIZE * 1.5,
            3,
            0,
            Math.PI * 2
        );
        context.fill();

        return this;
    }

    drawName(context) { //рисуем принадлежность флотов
        context.beginPath();
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillStyle = 'black';
        context.font = "bold 40px serif";
        context.fillText(`Флот игрока: ${this.name}`, this.offsetX + FIELD_SIZE * 5.5, this.offsetY + FIELD_SIZE * 12.5);
    }

    isPointUnder(point) { // находимся ли мы над полем
        if (
            point.x < this.offsetX + FIELD_SIZE ||
            point.x > this.offsetX + 11 * FIELD_SIZE ||
            point.y < this.offsetY + FIELD_SIZE ||
            point.y > this.offsetY + 11 * FIELD_SIZE
        ) {
            return false;
        }

        return true;
    }

    getCoordinats(point) { // получаем координаты игрового поля
        if (!this.isPointUnder(point)) {
            return false;
        }

        const x = parseInt((point.x - this.offsetX - FIELD_SIZE) / FIELD_SIZE);
        const y = parseInt((point.y - this.offsetY - FIELD_SIZE) / FIELD_SIZE);

        return {
            x: Math.max(0, Math.min(9, x)),
            y: Math.max(0, Math.min(9, y))
        }
    }

    canStay(ship) { // может ли корабль быть размещен
        if (ship.direct === 0 && ship.x + ship.size > 10) {
            return false;
        }

        if (ship.direct === 1 && ship.y + ship.size > 10) {
            return false;
        }

        const map = [ // карта поля
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true]
        ];

        for (const ship of this.ships) { // где корабль расположен ставим false и у его соседних клеток корабля тоже false
            if (ship.direct === 0) {
                for (let x = ship.x - 1; x < ship.x + ship.size + 1; x++) {
                    for (let y = ship.y - 1; y < ship.y + 2; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false;
                        }
                    }
                }
            } else {
                for (let x = ship.x - 1; x < ship.x + 2; x++) {
                    for (let y = ship.y - 1; y < ship.y + ship.size + 1; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false;
                        }
                    }
                }
            }
        }

        if (ship.direct === 0) { // проверяем саму возможность расположения корабля
            for (let i = 0; i < ship.size; i++) {
                if (!map[ship.y][ship.x + i]) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < ship.size; i++) {
                if (!map[ship.y + i][ship.x]) {
                    return false;
                }
            }
        }

        return true
    }

    randoming() { //пытаемся случайно расположить корабли пока не удастся
        this.ships = []

        for (let size = 4; size > 0; size--) {
            for (let n = 0; n < 5 - size; n++) {
                let flag = false

                while (!flag) {
                    const ship = {
                        x: Math.floor(Math.random() * 10),
                        y: Math.floor(Math.random() * 10),
                        direct: Math.random() > Math.random() ? 0 : 1,
                        size
                    }

                    if (this.canStay(ship)) {
                        this.addShips(ship)
                        flag = true
                    }
                }
            }
        }

        return true
    }

    update() { // все проверенные поля
        this.checks = this.checks // избавляемся от дубликата
            .map(check => JSON.stringify(check)) // в стоку
            .filter((e, i, l) => l.lastIndexOf(e) === i) // фильтруем повт. эл-ты
            .map(check => JSON.parse(check)) //обратно строки в объекты

        const map = this.getShipsMap();

        for (const check of this.checks) {
            if (map[check.y][check.x]) { // если точка ранения = часть корабля
                this.injuries.push(check);

                const index = this.checks.indexOf(check); //удаляем ее из checks
                this.checks.splice(index, 1);
            }
        }
    }

    getShipsMap() { // возвращает карту свободных и занятых ячеек
        const map = [
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false]
        ]

        for (const ship of this.ships) {
            if (ship.direct === 0) {
                for (let x = ship.x; x < ship.x + ship.size; x++) { // ячейка занята кораблем
                    if (map[ship.y] && !map[ship.y][x]) {
                        map[ship.y][x] = true
                    }
                }
            }

            else {
                for (let y = ship.y; y < ship.y + ship.size; y++) { // ячейка занята кораблем
                    if (map[y] && !map[y][ship.x]) {
                        map[y][ship.x] = true
                    }
                }
            }
        }

        return map
    }

    isShipUnderPoint(point) { // есть ли корабль в точке
        const map = this.getShipsMap()
        return map[point.y][point.x]
    }

    getUnknownFields() { // получим все неизвестные клетки чтоб комп не стрелял по ранее прострелянным ячейкам
        const unknownFields = [];

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                let flag = true;

                for (const check of this.checks) {
                    if (check.x === x && check.y === y) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    for (const injury of this.injuries) {
                        if (injury.x === x && injury.y === y) {
                            flag = false;
                            break;
                        }
                    }
                }

                if (flag) {
                    unknownFields.push({ x, y })
                }
            }
        }

        return unknownFields
    }

    isEnd() { // проверка конца игры
        const map = this.getShipsMap();

        for (const injury of this.injuries) { // для каждого ранения в map => false
            map[injury.y][injury.x] = false;
        }

        for (let status of map.flat()) {
            if (status) { // если есть хоть один true то игра не закончена
                return false
            }
        }

        return true
    }
}
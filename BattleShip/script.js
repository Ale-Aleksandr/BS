var view = { //Представление
    displayMessage2: function(msg){
        var numberOfShots = document.getElementById("numberOfShots");
        numberOfShots.innerHTML = msg;
    },
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss:function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss")
    }
}
var model = {
    bordSize: 10,
    numShips: 10,
    shipLenght: 4,
    shipsSunk: 0,

    ships: [{ neighborLocation : [], location: ["0", "0", "0","0"], hits: ["", "", "", ""] },
            { neighborLocation : [], location: ["0", "0", "0"], hits: ["", "", ""] },
            { neighborLocation : [], location: ["0", "0", "0"], hits: ["", "", ""] },
            { neighborLocation : [], location: ["0", "0"], hits: ["", ""] },
            { neighborLocation : [], location: ["0", "0"], hits: ["", ""] },
            { neighborLocation : [], location: ["0", "0"], hits: ["", ""] },
            { neighborLocation : [], location: ["0"], hits: [""] },
            { neighborLocation : [], location: ["0"], hits: [""] },
            { neighborLocation : [], location: ["0"], hits: [""] },
            { neighborLocation : [], location: ["0"], hits: [""] }],

    fire: function(guess){
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if (index >= 0 ){
                ship.hits[index] ="hit";
                view.displayMessage("OOO You hit me");
                view.displayHit(guess);
                if (this.isSunk(ship)){
                    view.displayMessage("You sank my SHIP!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Ha - Ha - Ha you Missed");
        return false;
    },
    isSunk: function(ship){
        for (var i = 0; i < this.shipLenght; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function(){
        var locations;
        var neighborLocation;
        for (var i = 0; i < this.numShips; i++){
            if (i == 1){
                this.shipLenght = 3 //регулируем длинну кораблей
            } else if (i == 3) {    // взависимости от кооличества созданных
                this.shipLenght = 2
            } else if (i == 6) {
                this.shipLenght = 1
            }
            do{
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].location = locations[0];
            this.ships[i].neighborLocation = locations[1];
        }
    },
    generateShip: function(){

        var direction = Math.floor(Math.random() * 2);
        var row , col;

        if (direction === 1){
                row = Math.floor(Math.random() * this.bordSize);
                col = Math.floor(Math.random() * (this.bordSize - this.shipLenght));
        } else {
                row = Math.floor(Math.random() * (this.bordSize - this.shipLenght));
                col = Math.floor(Math.random() * this.bordSize);

        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLenght; i++){
            if (direction === 1){
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return [newShipLocations,getNeighborLocation(row,col,this.shipLenght,direction)];
    },
    collision: function(locations){       // проверка на пересечения
        for (var i = 0; i < this.numShips; i++){  // получаем массив из 2 массивов с локациями и соседними лок
            var ship = model.ships[i];
            for (var j = 0; j < locations[0].length ; j++){ // проверяем каждую локацию нового корабля на совпадение
                if (ship.location.indexOf(locations[0][j]) >= 0  // с массивами локиций, если нет вернем правду
                    || ship.neighborLocation.indexOf(locations[0][j]) >=0 ){
                 return true;
                }
            }
        }
        return false;
    }
}
var controller = {
    guesses: 0,

    processGuess: function(guess){
        var location = parseGuess(guess)
        if (checkLocation(location)){
            view.displayMessage("Already fired!");
        } else {
            if (location) {
                this.guesses++;
                view.displayMessage2("SHOTS: " + this.guesses);
                var hit = model.fire(location);
                if (hit && model.shipsSunk === model.numShips ){
                    view.displayMessage("You sank all my ship, in " +
                                                this.guesses + "guesses")
                }
            }
        }
    }
}
function getNeighborLocation(row,col,shipLenght,direction){ //набор соседних координат
    var neighborLocation = [];
    if (direction == 1){    // взависимости от положения выбираем стартовую координату
        col--               // на клетку выше или левее от первой клетки корабля
    } else if (direction == 0){
        row--
    }
    for (var i = 0; i < shipLenght + 2; i++){ //взаваисимости от направления записываем в массив соседние координаты
        if (direction == 1){                   //от стартовой точки вправо либо вниз. до следующей клетки после последней.
            if (i == 0){
                neighborLocation.push(row + "" + col );
            }
            if (i == shipLenght + 1){
                neighborLocation.push(row + "" + (col + i));
            }
            neighborLocation.push((row - 1) + "" + (col +i));
            neighborLocation.push(row -(-1) + "" + (col +i));
        } else if (direction == 0){
            if (i == 0){
                neighborLocation.push(row + "" + col );
            }
            if (i == shipLenght + 1){
                neighborLocation.push((row -(-i)) + "" + col);
            }
            neighborLocation.push((row -(-i)) + "" + (col - 1));
            neighborLocation.push((row -(-i)) + "" + (col -(-1)));
        }
    }
    return neighborLocation; // возвращвем массив из соседних координат коробля
}
function checkLocation(location){
    var chekToken = document.getElementById(location);
    var classElem = chekToken.getAttribute("class");
    if (classElem == "miss" || classElem == "hit"){
        return true;
    } else {
        return false;
    }
} // проверяем локацию (стреляли туда или нет)
function parseGuess(guess){
    var alphabet = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"];

    if (guess == null || guess.length > 3 || guess.length == 1){
        alert("Oooops, error enter location");
    } else {
        for (let i = 0; i < alphabet.length; i++){
            if (guess.indexOf(alphabet[i]) >= 0){
                var column = guess.replace(alphabet[i],"") - 1
                var row = i;
            }
        }
         if (isNaN(row) || isNaN(column)){
             alert("Oooops, error enter location");
        } else if (row < 0 || row >= model.bordSize ||
                   column < 0 || column >= model.bordSize){
                        alert ("Oooops, error enter location")
         } else {
             return (String(column) + row);
        }
    }
}
function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var quessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}
function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}
function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess.toUpperCase());
    guessInput.value = "";
}
function fireOnEveryoneLocation(){
    for (var i = 0; i < Math.pow(model.bordSize, 2); i++){
        if (i < 10){
            i = "0" + i;
        } model.fire(String(i));
    }
} // ф-ция для проверки генерации кораблей на поле
window.onload = init;

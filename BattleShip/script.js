var view = { //Представление
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
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,

    ships: [{ location: ["0", "0", "0"], hits: ["", "", ""] },
            { location: ["0", "0", "0"], hits: ["", "", ""] },
            { location: ["0", "0", "0"], hits: ["", "", ""] }],

    fire: function(guess){
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if (index >=0){
                ship.hits[index] ="hit"
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
        for (var i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].location = locations;
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
        return newShipLocations;
    },
    collision: function(locations){
        for (var i = 0; i < this.numShips; i++){
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++){
                if (ship.location.indexOf(locations[j]) >= 0){
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
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips ){
                view.displayMessage("You sank all my ship, in " +
                                            this.guesses + "guesses")
            }
        }
    }
}
function parseGuess (guess){
    var alphabet = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"];

    if (guess == null || guess.length !== 2){
        alert("Oooops, error enter location");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = String(guess.charAt(1) - 1);

        if (isNaN(row) || isNaN(column)){
            alert("Oooops, error enter location");
        } else if (row < 0 || row >= model.bordSize ||
                   column < 0 || column >= model.bordSize){
                       alert ("Oooops, error enter location")
        } else {
            return column + row ;
        }
    }
    return null;
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
    controller.processGuess(guess);
    guessInput.value = "";
}
window.onload = init;

var character = document.getElementById("character");
var game = document.getElementById("game");
var interval;
var both = 0;
var counter = 0;

// oh no complicated things helpelpeleplpelpeleplpeleplepleplepelelp
var currentBlocks = [];

var keys = {
    "left": 37,
    "right": 39
}

window.onload = function() {
    document.getElementById('score').innerHTML = counter;
    document.getElementById('bestScore').innerHTML = getCookie("bestScore");
}

function moveLeft() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0)
        character.style.left = left - 2 + "px";
}

function moveRight() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380)
        character.style.left = left + 2 + "px";
}

function lose(msg) {
    alert(msg);
    location.reload();
}

function addCounter() {
    counter++;
    var score = counter - 4;
    if (score < getCookie("bestScore")) {
        document.getElementById('score').innerHTML = score;
        return;
    }
    setCookie("bestScore", score, 90);
    document.getElementById('score').innerHTML = score;
}

function resetData() {
    var choice = confirm("Are you sure you want to erase all data?");
    if (choice == true) {
        resetCookies();
        location.reload();
        return;
    }
    return;
}

function resetCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var c = 0;
    for(var i = 0; i <ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.onkeydown = function(e){
    e = e || window.event;
    var key = e.keyCode;
    console.log(key);
    if (both == 0) {
        both++;
        if (key == keys["left"])
            interval = setInterval(moveLeft, 1);
        if (key == keys["right"])
            interval = setInterval(moveRight, 1);
    }
};

document.onkeyup = function(e){
    e = e || window.event;
    clearInterval(interval);
    both = 0;
};

var blocks = setInterval(function () {
    var blockLast = document.getElementById("block" + (counter - 1));
    var holeLast = document.getElementById("hole" + (counter - 1));
    if (counter > 0) {
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }
    if (blockLastTop < 360 || counter == 0) {
        var block = document.createElement("div");
        var hole = document.createElement("div");
        block.setAttribute("class", "block");
        hole.setAttribute("class", "hole");
        block.setAttribute("id", "block" + counter);
        hole.setAttribute("id", "hole" + counter);
        block.style.top = blockLastTop + 100 + "px";
        hole.style.top = holeLastTop + 100 + "px";
        var random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";
        game.appendChild(block);
        game.appendChild(hole);
        currentBlocks.push(counter);
        addCounter();
    }
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var drop = 0;
    if (characterTop <= 0)
        lose("You lost.");
    for (var i = 0; i < currentBlocks.length; i++) {
        let current = currentBlocks[i];
        let iblock = document.getElementById("block" + current);
        let ihole = document.getElementById("hole" + current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));
        iblock.style.top = iblockTop - 0.5 + "px";
        ihole.style.top = iblockTop - 0.5 + "px";
        if (iblockTop < -50) {
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
        }
        if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
            drop++;
            if (iholeLeft <= characterLeft && iholeLeft + 20 >= characterLeft) {
                drop = 0;
            }
        }
    }
    if (drop == 0) {
        if (characterTop < 450)
            character.style.top = characterTop + 2 + "px";
    } else
        character.style.top = characterTop - 0.5 + "px";
}, 1)
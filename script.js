var character = document.getElementById('character');
var block = document.getElementById('block');
var canJump = true;
var debugging = false;
var score = 0;

var keys = {
    "jump": 32,
    "retry": 114
};

window.onload = function() {
    document.getElementById('score').innerHTML = score;
    document.getElementById('bestScore').innerHTML = getCookie("bestScore");
    block.height = randInt(0, 40) + "px";
    console.log(block.height);
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
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

function jumpedScore() {
    score += 1;
    if (score < getCookie("bestScore")) {
        document.getElementById('score').innerHTML = score;
        return;
    }
    setCookie("bestScore", score, 90);
    document.getElementById('score').innerHTML = score;
}

function addScore(newScore) {
    score += newScore;
    setCookie("bestScore", score, 90);
    document.getElementById('score').innerHTML = score;
}

function lose(msg) {
    alert(msg);
    location.reload();
}

function debug() {
    if (debugging) {
        debugging = false;
        alert("Debug mode has been disabled.")
        return;
    }
    debugging = true;
    alert("Debug mode has been enabled.")
}

function jump() {
    if (character.isaired || !canJump)
        return;
    character.isaired = true;
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
        character.isaired = false;
    },500);
}

document.onkeypress = function(e){
    e = e || window.event;
    var key = e.keyCode;
    // console.log(key);
    if (key == keys["jump"])
        jump();
    if (key == keys["retry"])
        lose("You lost. (RESET)");
};

var checkDead = setInterval(function(){
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if (blockLeft < 20 && blockLeft > 0 && characterTop >= 130) {
        if (debugging)
            return;
        block.style.animation = "none";
        block.style.display = "none";
        canJump = false;
        lose("You lost.");
    }
    if (blockLeft < 20 && blockLeft > 0 && characterTop < 131) {
        jumpedScore();
    }
},10);

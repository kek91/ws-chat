var socket;

function init() {
    var host = "ws://146.185.182.53:9000/chat";
    try {
        socket = new WebSocket(host);
        log('<b class="text-danger">' + getClock()+': WebSocket - status '+socket.readyState+'</b>');
        socket.onopen    = function(msg) {
               log('<b class="text-danger">' + getClock()+': Welcome - status '+this.readyState+'</b>');
           };
        socket.onmessage = function(msg) {
               if (msg.data.length > 0) {
                   log('<span style="color:green;">' + getClock()+': '+msg.data+'</span>');
               }
           };
        socket.onclose   = function(msg) {
               log('<b class="text-danger">' + getClock()+': Disconnected - status '+this.readyState+'</b>');
           };
    }
    catch(ex){
        log(ex);
    }

    let nickname = localStorage.getItem('nickname');
    if(nickname) {
        $('nick').value = localStorage.getItem('nickname');
    }
    else {
        nickname = getRandomNickname();
    }
    $("msg").focus();
}

function send() {
    var txt,msg;
    txt = $("msg");
    msginput = txt.value;

    var msg = {
		message: msginput,
		name: localStorage.getItem('nickname'),
		color : 'gray'
	};

    if(!msg) {
        return;
    }
    txt.value = "";
    txt.focus();
    try {
        socket.send(JSON.stringify(msg));
    }
    catch(ex) {
        log(ex);
    }
}
function quit(){
    if (socket != null) {
        log("<hr>");
        socket.close();
        socket=null;
    }
}

function reconnect() {
    quit();
    init();
}

function getRandomNickname() {
    let random_titles = [
        'Infantry', 'Warrior', 'Cadet', 'Warlord', 'Marshal',
        'Soldier', 'Knight', 'Marine', 'Elite', 'Peasant',
        'Guard', 'Agent', 'Major', 'Delta', 'Sergeant'
    ];
    let random_animals = [
        'Fish', 'Spider', 'Scorpion', 'Snake', 'Bull',
        'Cow', 'Chicken', 'Camel', 'Horse', 'Dragon',
        'Squirrel', 'Dog', 'Cat', 'Monkey', 'Beetle'
    ];
    const nickname = random_titles[Math.floor((Math.random() * 15))] + random_animals[Math.floor((Math.random() * 15))] + Math.floor((Math.random() * 999));
    $('nick').value = nickname;
    localStorage.setItem('nickname', nickname);
    $('statusbar').innerHTML = 'Your nickname is now <b>'+nickname+'</b>! Nice<br>';
    fadeIn($('statusbar'));
    fadeOut($('statusbar'));
    return nickname;
}
function changeNickname() {
    const newnick = $('nick').value;
    localStorage.setItem('nickname', newnick);
    $('statusbar').innerHTML = 'Your nickname is now <b>'+newnick+'</b>! Nice<br>';
    fadeIn($('statusbar'));
    fadeOut($('statusbar'));
    return newnick;
}

// Utilities
function $(id){ return document.getElementById(id); }
function log(msg){ $("log").innerHTML+="<br>"+msg; }
function onkey(event){ if(event.keyCode==13){ send(); } }

function getClock() {
    var dateObject = new Date();
    var currentHours = dateObject.getHours();
    var currentMinutes = dateObject.getMinutes();
    var currentSeconds = dateObject.getSeconds();
    currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
    var dateTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
    return dateTime;
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}
function fadeOut(element) {
    var op = 1000;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.03;
    }, 10);
}

function toggleAutoScroll() {
    if(localStorage.getItem('autoscroll') === 1) {
        localStorage.setItem('autoscroll', 0);
    }
    else {
        localStorage.setItem('autoscroll', 1);
    }
}

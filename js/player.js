function playTrack(sors, albumID, trackID) {
    if (audio.getAttribute("data-nowalbum") != "") {
        var current = document.querySelector("[data-albumid=\"" + audio.getAttribute("data-nowalbum") + "\"][data-tracknum=\"" + audio.getAttribute("data-nowtrack") + "\"]");
        current.classList.remove("playing");
        setPlayingIndicator(current, "false");
    }

    var next = document.querySelector("[data-albumid=\"" + albumID + "\"][data-tracknum=\"" + trackID + "\"]");
    next.classList.add("playing");

    audio.src = sors;
    audio.setAttribute("data-nowalbum", albumID);
    audio.setAttribute("data-nowtrack", trackID);
    audio.currentTime = 0;
    audio.play();

    var bandsearchid = "#a" + albumID;
    var nextband = document.querySelector("[data-target=\"" + bandsearchid + "\"]");
    var bandsub = nextband.querySelector("h6")
    var nowplay = document.getElementById("nowplaying");
    nowplay.innerHTML = bandsub.innerHTML + " - " + next.innerHTML;
    bufferResize();
}

function setPlayingIndicator(target, value) {
    if (value=="true") {
        target.innerHTML = "[" + target.getAttribute("data-name") + "]";
    } else {
        target.innerHTML = target.getAttribute("data-name");
    }
}

function playNextTrack() {
    var album = audio.getAttribute("data-nowalbum");
    var track = parseInt(audio.getAttribute("data-nowtrack"));
    
    var next = document.querySelector("[data-albumid=\"" + album + "\"][data-tracknum=\"" +(track+1)+ "\"]");

    if (next != null ) {    
        var nextalbum = next.getAttribute("data-albumid");
        var nexttrack = next.getAttribute("data-tracknum");
        var nextsors = next.getAttribute("data-src");
        playTrack(nextsors, nextalbum, nexttrack);
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
}

function playPrevTrack() {
    var album = audio.getAttribute("data-nowalbum");
    var track = parseInt(audio.getAttribute("data-nowtrack"));
    
    var prev = document.querySelector("[data-albumid=\"" + album + "\"][data-tracknum=\"" +(track-1)+ "\"]");

    if (prev != null ) {    
        var nextalbum = prev.getAttribute("data-albumid");
        var nexttrack = prev.getAttribute("data-tracknum");
        var nextsors = prev.getAttribute("data-src");
        playTrack(nextsors, nextalbum, nexttrack);
    } else {
        playTrack(audio.src, audio.getAttribute("data-nowalbum"), (audio.getAttribute("data-nowtrack")));
    }
}

function setSeekbarPosition() {
    seekbar.value = audio.currentTime;
}

function setCurrentTime() {
    audio.currentTime = seekbar.value;
}

function setMaxDuration() {
    seekbar.max = audio.duration;
}

function pad(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

var audio = document.getElementById("player");
var seekbar = document.getElementById("seekbar");
seekbar.value = 0;


//playlist functionality
audio.addEventListener("ended", function() {
    playNextTrack();    
});

//highlight playing
audio.addEventListener("pause", function() {
    if (audio.getAttribute("data-nowalbum") != "") {
        var current = document.querySelector("[data-albumid=\"" + audio.getAttribute("data-nowalbum") + "\"][data-tracknum=\"" + audio.getAttribute("data-nowtrack") + "\"]");
        setPlayingIndicator(current, "false");
    }

    playpause.classList.remove("pause");
    playpause.classList.add("play");
});

audio.addEventListener("playing", function() {
    var current = document.querySelector("[data-albumid=\"" + audio.getAttribute("data-nowalbum") + "\"][data-tracknum=\"" + audio.getAttribute("data-nowtrack") + "\"]");
    setPlayingIndicator(current, "true");
    
    playpause.classList.remove("play");
    playpause.classList.add("pause");
});

//buttons
var playpause = document.getElementById("playpause");

playpause.addEventListener("click", function() {
    if (playpause.classList.contains("play")) {
        if(audio.src != "") {
            audio.play();
        }
    } else {
        audio.pause();
    }
});

var next = document.getElementById("next");
next.addEventListener("click", function() {
    playNextTrack();
});
var prev = document.getElementById("prev");
prev.addEventListener("click", function() {
    if (audio.currentTime <= 5) {
        playPrevTrack();
    } else {
        audio.currentTime = 0;
    }
    
});

var timetrack = document.getElementById("timetrack");


audio.addEventListener("timeupdate", function() {
    setSeekbarPosition();
    timetrack.innerHTML = "["+ Math.floor(audio.currentTime/60) +":" + pad(Math.floor(audio.currentTime % 60), 2) + "/"+ Math.floor(audio.duration/60) +":"+ pad(Math.floor(audio.duration % 60), 2) + "]";

});

audio.addEventListener("loadedmetadata", function() {
    setMaxDuration();
    timetrack.innerHTML = "[0:00/"+ Math.floor(audio.duration/60) +":"+ pad(Math.floor(audio.duration % 60), 2) + "]";
});

seekbar.addEventListener("change", function() {
    setCurrentTime();
});
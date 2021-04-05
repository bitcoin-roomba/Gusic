function createelementModal(albumobject) {
    //x deprecates album id
    let modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "a" + albumobject.id;
    modal.setAttribute("tabindex", "-1");
    modal.role = "dialog";

    let mdialog = document.createElement("div");
    mdialog.className = "modal-dialog modal-dialog-centered";
    mdialog.setAttribute("role", "document");
    
    let mcontent = document.createElement("div");
    mcontent.className = "modal-content";

    let mheader = document.createElement("div");
    mheader.className = "modal-header"

    let title = document.createElement("h5");
    title.className = "modal-title";
    title.innerHTML = albumobject.band + " - " + albumobject.album + " (" + albumobject.year + ")";
    
    let closebtn = document.createElement("button");
    closebtn.setAttribute("type", "button");
    closebtn.className = "close";
    closebtn.setAttribute("data-dismiss", "modal");
    
    let span = document.createElement("span");
    span.innerHTML="&times;";

    

    let mbody = document.createElement("div");
    mbody.className = "modal-body";

    //playlist
    let plist = document.createElement("ol");
    plist.id = "playlist";


    for (let i=0; i < albumobject.tracks.length; i++) {
        let entry = document.createElement("li");
        let ref = document.createElement("a");
        ref.href = "#/";
        ref.setAttribute("onclick", "playTrack(\"" + albumobject.tracks[i].src + "\", \"" + albumobject.id + "\", \"" + (i+1) +"\")");
        ref.setAttribute("data-albumid", albumobject.id);
        ref.setAttribute("data-tracknum", i+1);
        ref.setAttribute("data-src", albumobject.tracks[i].src);
        ref.setAttribute("data-name", albumobject.tracks[i].name);
        ref.className = "";
        ref.innerHTML = albumobject.tracks[i].name;
        entry.appendChild(ref);
        plist.appendChild(entry);

    }

    mbody.appendChild(plist);
    
    let mfooter = document.createElement("div");
    mfooter.className = "modal-footer";



    closebtn.appendChild(span);
    mheader.appendChild(title);
    mheader.appendChild(closebtn);
    mcontent.appendChild(mheader);
    mcontent.appendChild(mbody);
    mcontent.appendChild(mfooter);
    mdialog.appendChild(mcontent);
    modal.appendChild(mdialog);

    modalContainer.appendChild(modal);
}

function createelementCard(element) {

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';
    if(touchmode == true) {
        card.classList.add("touchmode");
    }
    card.setAttribute("data-toggle", "modal");
    card.setAttribute("data-target", "#a" + element.id);

    let cardoverlay = document.createElement("div");
    cardoverlay.className = "card-img-overlay d-flex flex-column justify-content-end";

    let cardimg = document.createElement("img");
    cardimg.src = element.src;
    cardimg.alt = element.album;
    cardimg.className = "cardimg";

    let title = document.createElement('h5');
    title.innerText = element.album;
    title.className = 'card-title';
    title.contentEditable = true;
    

    let subtitle = document.createElement("h6");
    subtitle.innerText = element.band;
    subtitle.className = "card-subtitle";

    let year = document.createElement("p");
    year.innerText = element.year;
    year.className = "card-text";

    let col = document.createElement("div");
    col.className = "col-auto cardcol";
    col.style = "padding-right:1px; padding-left:1px;"

    cardoverlay.appendChild(title);
    cardoverlay.appendChild(subtitle);
    cardoverlay.appendChild(year);

    card.appendChild(cardimg);
    card.appendChild(cardoverlay);
    col.appendChild(card);

    cardContainer.appendChild(col);

}

function initListOfelements() {
    if (cardContainer) {
        document.getElementById('cardcontainer').replaceWith(cardContainer);
        return;
    }

    if (modalContainer) {
        document.getElementById('modalcontainer').replaceWith(modalContainer);
        return;
    }

    cardContainer = document.getElementById('cardcontainer');
    modalContainer = document.getElementById('modalcontainer');
    
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
        createelementModal(albumobject);
    });

    /*for (i = 0; i < albums.length; i++) {
        createelementCard(albums[i%albums.length]);
        createelementModal(albums[i%albums.length]);
    }*/
}

function bufferResize() {
    let h = document.getElementById('nav').clientHeight;
    document.body.style = "margin-top: " + (h+20) + "px;";
}

function touchModeOn() {
    touchmode = true;
    let cards = cardContainer.querySelectorAll(".card");
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.add("touchmode");
    }
    touchmodeswitch.innerHTML = "[On]";
    touchmodeswitch.setAttribute("onclick", "touchModeOff()");
}

function touchModeOff() {
    touchmode = false;
    let cards = cardContainer.querySelectorAll(".card");
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.remove("touchmode");
    }
    touchmodeswitch.innerHTML = "[Off]";
    touchmodeswitch.setAttribute("onclick", "touchModeOn()");
}

function sortAscArtist() {
    albums.sort(function(a,b) {
        return a.album.localeCompare(b.album);
    });
    albums.sort(function(a,b) {
        return a.year - b.year;
    });
    albums.sort(function(a,b) {
        return a.band.localeCompare(b.band);
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortAscTitle()");
    artistsort.setAttribute("onclick", "sortDescArtist()");
    yearsort.setAttribute("onclick", "sortAscYear()");
    titlesort.innerHTML = "Title &#9652;";
    artistsort.innerHTML = "Artist &#9652;";
    yearsort.innerHTML = "Year &#9652;";
    titlesort.classList.remove("underlined");
    artistsort.classList.add("underlined");
    yearsort.classList.remove("underlined");
}

function sortDescArtist() {
    albums.sort(function(a,b) {
        return a.album.localeCompare(b.album);
    });
    albums.sort(function(a,b) {
        return a.year - b.year;
    });
    albums.sort(function(a,b) {
        return b.band.localeCompare(a.band);
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortAscTitle()");
    artistsort.setAttribute("onclick", "sortAscArtist()");
    yearsort.setAttribute("onclick", "sortAscYear()");
    titlesort.innerHTML = "Title &#9652;";
    artistsort.innerHTML = "Artist &#9662;";
    yearsort.innerHTML = "Year &#9652;";
    titlesort.classList.remove("underlined");
    artistsort.classList.add("underlined");
    yearsort.classList.remove("underlined");
}

function sortAscTitle() {
    albums.sort(function(a,b) {
        return a.band.localeCompare(b.band);
    });
    albums.sort(function(a,b) {
        return a.year - b.year;
    });
    albums.sort(function(a,b) {
        return a.album.localeCompare(b.album);
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortDescTitle()");
    artistsort.setAttribute("onclick", "sortAscArtist()");
    yearsort.setAttribute("onclick", "sortAscYear()");
    titlesort.innerHTML = "Title &#9652;";
    artistsort.innerHTML = "Artist &#9652;";
    yearsort.innerHTML = "Year &#9652;";
    titlesort.classList.add("underlined");
    artistsort.classList.remove("underlined");
    yearsort.classList.remove("underlined");
}

function sortDescTitle() {
    albums.sort(function(a,b) {
        return a.band.localeCompare(b.band);
    });
    albums.sort(function(a,b) {
        return a.year - b.year;
    });
    albums.sort(function(a,b) {
        return b.album.localeCompare(a.album);
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortAscTitle()");
    artistsort.setAttribute("onclick", "sortAscArtist()");
    yearsort.setAttribute("onclick", "sortAscYear()");
    titlesort.innerHTML = "Title &#9662;";
    artistsort.innerHTML = "Artist &#9652;";
    yearsort.innerHTML = "Year &#9652;";
    titlesort.classList.add("underlined");
    artistsort.classList.remove("underlined");
    yearsort.classList.remove("underlined");
}

function sortAscYear() {
    albums.sort(function(a,b) {
        return a.band.localeCompare(b.band);
    });
    albums.sort(function(a,b) {
        return a.album.localeCompare(b.album);
    });
    albums.sort(function(a,b) {
        return a.year - b.year;
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortAscTitle()");
    artistsort.setAttribute("onclick", "sortAscArtist()");
    yearsort.setAttribute("onclick", "sortDescYear()");
    titlesort.innerHTML = "Title &#9652;";
    artistsort.innerHTML = "Artist &#9652;";
    yearsort.innerHTML = "Year &#9652;";
    titlesort.classList.remove("underlined");
    artistsort.classList.remove("underlined");
    yearsort.classList.add("underlined");
}

function sortDescYear() {
    albums.sort(function(a,b) {
        return a.band.localeCompare(b.band);
    });
    albums.sort(function(a,b) {
        return a.album.localeCompare(b.album);
    });
    albums.sort(function(a,b) {
        return b.year - a.year;
    });
    cardContainer.innerHTML = "";
    albums.forEach((albumobject) => {
        createelementCard(albumobject);
    });

    titlesort.setAttribute("onclick", "sortAscTitle()");
    artistsort.setAttribute("onclick", "sortAscArtist()");
    yearsort.setAttribute("onclick", "sortAscYear()");
    titlesort.innerHTML = "Title &#9652;";
    artistsort.innerHTML = "Artist &#9652;";
    yearsort.innerHTML = "Year &#9662;";
    titlesort.classList.remove("underlined");
    artistsort.classList.remove("underlined");
    yearsort.classList.add("underlined");
}


window.onload = function() {
    bufferResize();
}

window.onresize = function() {
    bufferResize();
}

let cardContainer;
let modalContainer;
initListOfelements();


var titlesort = document.getElementById("titlesort");
var artistsort = document.getElementById("artistsort");
var yearsort = document.getElementById("yearsort");
var touchmode = false;
var touchmodeswitch = document.getElementById("touchmode");

sortAscTitle();
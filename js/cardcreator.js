function createelementModal(albumobject, x) {
    //x deprecates album id
    let modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "a" + x;
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
        ref.setAttribute("onclick", "playTrack(\"" + albumobject.tracks[i].src + "\", \"" + x + "\", \"" + (i+1) +"\")");
        ref.setAttribute("data-albumid", x);
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

function createelementCard(element, x) {

    //x deprecates album id
    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';
    card.setAttribute("data-toggle", "modal");
    card.setAttribute("data-target", "#a" + x);

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
    
    /*albums.forEach((albumobject) => {
        createelementCard(albumobject);
        createelementModal(albumobject);
    });*/

    for (i = 0; i < albums.length; i++) {
        createelementCard(albums[i%albums.length], i+1);
        createelementModal(albums[i%albums.length], i+1);
    }
}

function bufferResize() {
    let h = document.getElementById('nav').clientHeight;
    document.body.style = "margin-top: " + (h+20) + "px;";
}

function touchModeOn() {
    let cards = cardContainer.querySelectorAll(".card");
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.add("touchmode");
    }
    touchmodeswitch.innerHTML = "[On]";
    touchmodeswitch.setAttribute("onclick", "touchModeOff()");
}

function touchModeOff() {
    let cards = cardContainer.querySelectorAll(".card");
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.remove("touchmode");
    }
    touchmodeswitch.innerHTML = "[Off]";
    touchmodeswitch.setAttribute("onclick", "touchModeOn()");
}


function sortAscTitle() {
    sortAscDesc(".card-subtitle", true);
    sortAscDesc(".card-title", true);
    /*titlesort.onclick=sortDescTitle;
    artistsort.onclick=sortAscArtist;
    yearsort.onclick=sortAscYear;*/
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

function sortAscArtist() {
    sortAscDesc(".card-title", true);
    sortAscDesc(".card-subtitle", true);
    /*titlesort.onclick=sortAscTitle;
    artistsort.onclick=sortDescArtist;
    yearsort.onclick=sortAscYear;*/
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

function sortAscYear() {
    sortAscDesc(".card-title", true);
    sortAscDesc(".card-text", true);
    /*titlesort.onclick=sortAscTitle;
    artistsort.onclick=sortAscArtist;
    yearsort.onclick=sortDescYear;*/
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

function sortDescTitle() {
    sortAscDesc(".card-subtitle", true);
    sortAscDesc(".card-title", false);
    /*titlesort.onclick=sortAscTitle;
    artistsort.onclick=sortAscArtist;
    yearsort.onclick=sortAscYear;*/
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

function sortDescArtist() {
    sortAscDesc(".card-title", true);
    sortAscDesc(".card-subtitle", false);
    /*titlesort.onclick=sortAscTitle;
    artistsort.onclick=sortAscArtist;
    yearsort.onclick=sortAscYear;*/
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

function sortDescYear() {
    sortAscDesc(".card-title", true);
    sortAscDesc(".card-text", false);
    /*titlesort.onclick=sortAscTitle;
    artistsort.onclick=sortAscArtist;
    yearsort.onclick=sortAscYear;*/
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

function sortAscDesc(query, asc) {

    let autocols = document.querySelectorAll(".cardcol");
    let ccon = document.getElementById("cardcontainer");
    let sorted = [];
    let minimum;
    let minindex;

    let diag = document.createElement("p");
    diag.id = "diag";
    
    for(j=0; j<autocols.length; j+=1) {    
        //finds minimum autocol
        minimum = "no";
        minindex = 0;
        for(i=0; i<autocols.length; i+=1) {
            if (minimum == "no") {
                if (!(autocols[i].classList.contains("sorted"))) {
                    minimum = autocols[i];
                    minindex = i;
                } else {
                    continue;
                }
            } else {
                if (!(autocols[i].classList.contains("sorted"))) {
                    minstr = minimum.querySelector(query).innerHTML;
                    compstr = autocols[i].querySelector(query).innerHTML;
                    if (asc) {
                        if (compstr.localeCompare(minstr) < 0) {
                            minimum = autocols[i];
                            minindex = i;
                        }
                    }else {
                        if (compstr.localeCompare(minstr) > 0) {
                            minimum = autocols[i];
                            minindex = i;
                        }
                    }
                    
                }
            }
        }
        sorted.push(minimum);
        autocols[minindex].classList.add("sorted");
    }

    for (k=0; k<sorted.length; k+=1) {
        sorted[k].classList.remove("sorted");
        ccon.appendChild(sorted[k]);
    }


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

var touchmodeswitch = document.getElementById("touchmode");

sortAscTitle();
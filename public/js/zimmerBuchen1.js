window.onload = function(){
    document.getElementById('art').innerHTML = sessionStorage.getItem("zimmerArt");
}

function buchen(action){
    let popup = document.getElementById("popupBuchung");

    if (action === "show") {
        popup.style.display = "block";
        /*Rechnung an admin weiter geben*/
    } else if (action === "hide") {
        popup.style.display = "none";
    }
}
function checkbox(gecheckt){
    if(gecheckt === 'einzel'){
        document.getElementById("einzelzimmer").checked = true;
        document.getElementById("doppelzimmer").checked = false;
    }else if(gecheckt === 'doppel'){
        document.getElementById("einzelzimmer").checked = false;
        document.getElementById("doppelzimmer").checked = true;
    }
}

function home() {
    window.location.href = "../oberflächen/startseite.html";
}
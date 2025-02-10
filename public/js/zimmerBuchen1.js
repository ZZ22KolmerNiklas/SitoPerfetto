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

function test() {
    window.location.href = "../oberflächen/startseite.html";
}
function home() {
    window.location.href = "../oberflächen/startseite.html";
}
function confirmReview() {
    alert("Rezension bestätigt!");
}
function rejectReview() {
    alert("Rezension abgelehnt!");
}

function test(){
    console.log('klappt');
}
function preisVerwalten(action, senden){
    let verwaltung = document.getElementById("preisVerwaltungPopup");
    if(action === 'show'){
        verwaltung.style.display = "block";
    }else if (action === 'hide') {
        verwaltung.style.display = "none";
    }
    if(senden === "senden"){
        /*an DB übergeben*/
    }
}
window.onload = function(){
    document.getElementById('art').innerHTML = sessionStorage.getItem("zimmerArt");
    document.getElementById('name').innerText = sessionStorage.getItem("username");
}

function changePopup(action){
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

document.getElementById("buchenForm").addEventListener("submit", async function (event) {
        let zimmer = document.getElementById("einzelzimmer").checked ? document.getElementById("einzelzimmer").innerText : document.getElementById("doppelzimmer").innerText;
        let data = {
            zimmer: zimmer,
            benutzer: sessionStorage.getItem("user_id"),
            vonDatum: document.getElementById("textarea").value,
            bisDatum: stern}

        fetch("../../php/bewertung.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // JSON-Daten senden
        })
            .then(response => response.text())
            .catch(error => console.error("Fehler:", error));
        console.log(data);
});

function home() {
    window.location.href = "../oberflächen/startseite.html";
}
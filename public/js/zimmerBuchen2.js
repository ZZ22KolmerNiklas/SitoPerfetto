window.onload = function(){
    document.getElementById('art').innerHTML = sessionStorage.getItem("zimmerArt");
    document.getElementById('name').innerText = sessionStorage.getItem("username");
    let zimmerArt = sessionStorage.getItem("zimmerArt");
    document.getElementById('zimmerImg').src = `../img/${zimmerArt}.png`;
    dataChange();
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
    dataChange();
}

function dataChange(){
    let anzBett = document.getElementById("einzelzimmer").checked ? 1 : 2;
    let data = {
        anzBett: anzBett,
        zimmerArt: sessionStorage.getItem("zimmerArt"),
        vonDatum: document.getElementById("vonDatum").value,
        bisDatum: document.getElementById("bisDatum").value
    };

    fetch("../../php/get_freieZimmer.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.getElementById("anzZimmer").innerText = result[0].anzZimmer;
            document.getElementById("gesamtPreis").innerText = gesamtpreisErmitteln(new Date(data.vonDatum), new Date(data.bisDatum), result[0].preispronacht).toString()+"€";
            //result.forEach(zimmer => {
            //    document.getElementById("anzZimmer").innerText = zimmer.anzZimmer;
            //});
        })
        .catch(error => console.error("Fehler:", error));
    console.log(data);
}

function gesamtpreisErmitteln(startDate, endDate, preisProNacht){
    console.log(preisProNacht);
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const gesamtPreis = diffInDays * preisProNacht;
    return gesamtPreis;
}

document.getElementById("buchenForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let anzBett = document.getElementById("einzelzimmer").checked ? 1 : 2;
    let data = {
        anzBett: anzBett,
        benutzer: sessionStorage.getItem("user_id"),
        vonDatum: document.getElementById("vonDatum").value,
        bisDatum: document.getElementById("bisDatum").value
    }
    fetch("../../php/buchen.php", {
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
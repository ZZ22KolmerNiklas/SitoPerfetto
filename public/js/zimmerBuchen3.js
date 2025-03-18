window.onload = function(){
    document.getElementById('art').innerHTML = sessionStorage.getItem("zimmerArt");
    document.getElementById('name').innerText = sessionStorage.getItem("username");
    let zimmerArt = sessionStorage.getItem("zimmerArt");
    document.getElementById('zimmerImg').src = `../img/${zimmerArt}.png`;
    dataChange();
    kommentareAnzeigen();
}

function kommentareAnzeigen(){

    let data = {
        zimmer: sessionStorage.getItem("zimmerArt")
    };

    fetch("../../php/get_komentare.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.json())
        .then(data => {
                data.forEach(row => {
                    switch (row.sterne) {
                        case 1:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 2:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 3:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 4:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 5:
                            document.getElementById("kommentarArea").value += "⭐";
                            break;
                    }

                    document.getElementById("kommentarArea").value += ('\n' + row.bewertung + '\n\n');
                });

        })
        .catch(error => console.error("Fehler:", error));
}

function changePopup(action){
    let popup = document.getElementById("popupBuchung");

    if (action === "show") {
        popup.style.display = "block";
        /*Rechnung an admin weiter geben*/
    } else if (action === "hide") {
        dataChange();
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
        zimmerArt: sessionStorage.getItem("zimmerArt"),
        benutzer: sessionStorage.getItem("user_id"),
        vonDatum: document.getElementById("vonDatum").value,
        bisDatum: document.getElementById("bisDatum").value
    }
    changePopup('show');
    fetch("../../php/buchen.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if(document.getElementById("anzZimmer").innerText !== '0'){
                document.getElementById("buchungText").innerText = 'Buchung erfolgeich. Die Rechnung wird an Ihre E-mail geschickt.';
                console.log('ja');
            }else{
                document.getElementById("buchungText").innerText = 'Kein freies Zimmer gefunden. Bitte anderen Zeitraum wählen.';
                console.log('nein');
            }
        })
        .catch(error => {
            console.error("Fehler:", error);
        });
    console.log(data);
});

document.addEventListener("DOMContentLoaded", () => {
    dataChange();
    const vonDatumInput = document.getElementById("vonDatum");
    const bisDatumInput = document.getElementById("bisDatum");

    const heute = new Date();
    const morgen = new Date(heute);
    morgen.setDate(heute.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    vonDatumInput.value = formatDate(heute);
    vonDatumInput.min = formatDate(heute);
    bisDatumInput.value = formatDate(morgen);
    bisDatumInput.min = formatDate(morgen);
});

function updateMinDate() {
    const vonDatum = new Date(document.getElementById("vonDatum").value);
    const bisDatumInput = document.getElementById("bisDatum");

    const naechsterTag = new Date(vonDatum);
    naechsterTag.setDate(vonDatum.getDate() + 1);

    bisDatumInput.min = naechsterTag.toISOString().split('T')[0];

    // Falls das aktuelle Abreisedatum vor dem neuen Mindestdatum liegt, aktualisieren
    if (new Date(bisDatumInput.value) < naechsterTag) {
        bisDatumInput.value = naechsterTag.toISOString().split('T')[0];
    }
}

function home() {
    window.location.href = "../oberflächen/startseite.html";
}

const ONE_DAY = 1000 * 60 * 60 * 24;

function home() {
    window.location.href = "../oberflächen/startseite.html";
}
function confirmReview() {
    let bewertungid = Number(sessionStorage.getItem("bewertungId"));
    let data = {
        "bewertungId": bewertungid
    };
    console.log(data);
    fetch("../../php/bewertungBestaetigt.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.text())
        .catch(error => console.error("Fehler:", error));


    alert("Rezension bestätigt!");

    getNaechsteBewertung();
}
function rejectReview() {
    let bewertungid = Number(sessionStorage.getItem("bewertungId"));
    let data = {
        "bewertungId": bewertungid
    };
    fetch("../../php/bewertungLoeschen.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.text())
        .catch(error => console.error("Fehler:", error));

    alert("Rezension abgelehnt!");
    getNaechsteBewertung();
}

function sterneAnzeigen(sterne){

    switch (sterne) {
        case 1:
            document.getElementById('stern2').style.display = 'none';
            document.getElementById('stern3').style.display = 'none';
            document.getElementById('stern4').style.display = 'none';
            document.getElementById('stern5').style.display = 'none';
            break;
        case 2:
            document.getElementById('stern2').style.display = 'inline-block';
            document.getElementById('stern3').style.display = 'none';
            document.getElementById('stern4').style.display = 'none';
            document.getElementById('stern5').style.display = 'none';
            break;
        case 3:
            document.getElementById('stern2').style.display = 'inline-block';
            document.getElementById('stern3').style.display = 'inline-block';
            document.getElementById('stern4').style.display = 'none';
            document.getElementById('stern5').style.display = 'none';
            break;
        case 4:
            document.getElementById('stern2').style.display = 'inline-block';
            document.getElementById('stern3').style.display = 'inline-block';
            document.getElementById('stern4').style.display = 'inline-block';
            document.getElementById('stern5').style.display = 'none';
            break;
        case 5:
            document.getElementById('stern2').style.display = 'inline-block';
            document.getElementById('stern3').style.display = 'inline-block';
            document.getElementById('stern4').style.display = 'inline-block';
            document.getElementById('stern5').style.display = 'inline-block';
            break;
    }
}

function getNaechsteBewertung(){
    fetch("../../php/get_bewertung.php")
        .then(response => response.json())
        .then(data => {
            if(data.length === 0){
                sterneAnzeigen(5);
                document.getElementById('reviewBox').innerText = '\nHier erscheinen die neuen Rezension...'
            } else{
                data.forEach(row => {
                    sterneAnzeigen(row.sterne);
                    let bewertungid = row.bewertungid;
                    sessionStorage.setItem("bewertungId", bewertungid)
                    document.getElementById('reviewBox').innerText = '\n' + row.zimmer + '\n' + row.bewertung;
                });
            }
        })
        .catch(error => console.error("Fehler:", error));
}


window.onload = function(){
    getNaechsteBewertung();

    let i = 1
    fetch("../../php/get_verwaltungTable1.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";

            data.forEach(row => {
                const startDate = new Date(row.von);
                const endDate = new Date(row.bis);
                const gesamtPreis = gesamtpreisErmitteln(startDate, endDate, row.preisProNacht);

                const cell = document.createElement("td");

                const btn = document.createElement("button");
                btn.id = row.buchungsnummer;
                btn.innerText = `Bearbeiten`;
                btn.addEventListener("click", function (){
                    document.getElementById('popupBearbeiten').style.display = "block";
                    console.log(btn.id);
                    let data = {
                        buchungsnr: btn.id
                    };
                    console.log(data);
                    fetch("../../php/get_bearbeitung.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data) // JSON-Daten senden
                    })
                        .then(response => response.json())
                        .then(data => console.log(data));
                });

                cell.appendChild(btn);

                const cellR = document.createElement("td");

                const btnR = document.createElement("button");
                btnR.id = row.buchungsnummer;
                btnR.innerText = `Erstellen`;
                btnR.addEventListener("click", function (){
                    generateInvoice(btnR.id);
                    console.log(btnR.id);
                });

                cellR.appendChild(btnR);

                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.zimmernummer}</td><td>${row.vorname}</td><td>${row.nachname}</td><td>${startDate.toLocaleDateString()}</td><td>${endDate.toLocaleDateString()}</td>
                                    <td>${row.email}</td><td>${row.anzahlBetten}</td><td>${gesamtPreis}€</td><td>${row.stammkunde}</td>`;
                tr.appendChild(cellR);
                tr.appendChild(cell);
                tableBody.appendChild(tr);
                i++;
            });
        })
        .catch(error => console.error("Fehler:", error));

    if(sessionStorage.getItem("username") !== null){
        document.getElementById('name').style.display =  "block";
        document.getElementById('name').innerText = sessionStorage.getItem("username");
    }
}
function preisVerwalten(action, senden) {
    let verwaltung = document.getElementById("preisVerwaltungPopup");
    if (action === 'show') {
        verwaltung.style.display = "block";

        fetch("../../php/get_zimmerpreis.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                data.forEach(row => {
                    switch (row.art){
                        case 'Standard':
                            if (row.anzBett === 1){
                                document.getElementById('standardPreisEinzel').value = row.preispronacht;
                            }
                            else if (row.anzBett === 2){
                                document.getElementById('standardPreisDoppel').value = row.preispronacht;
                            }
                    }
                    switch (row.art){
                        case 'Premium':
                            if (row.anzBett === 1){
                                document.getElementById('premiumPreisEinzel').value = row.preispronacht;
                            }
                            else if (row.anzBett === 2){
                                document.getElementById('premiumPreisDoppel').value = row.preispronacht;
                            }
                    }
                    switch (row.art){
                        case 'Luxus':
                            if (row.anzBett === 1){
                                document.getElementById('luxusPreisEinzel').value = row.preispronacht;
                            }
                            else if (row.anzBett === 2){
                                document.getElementById('luxusPreisDoppel').value = row.preispronacht;
                            }
                    }
                })
            })
            .catch(error => console.error("Fehler:", error));

    } else if (action === 'hide') {
        verwaltung.style.display = "none";
    }
    if (senden === "senden") {
            /*an DB übergeben*/
    }
}

document.getElementById("preisSpeichern").addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das Standard-Formular-Absenden

    // Daten aus dem Formular holen
    switch (row.art){
        case 'Standard':
            if (row.anzBett === 1){
                document.getElementById('standardPreisEinzel').value = row.preispronacht;
            }
            else if (row.anzBett === 2){
                document.getElementById('standardPreisDoppel').value = row.preispronacht;
            }
    }
    switch (row.art){
        case 'Premium':
            if (row.anzBett === 1){
                document.getElementById('premiumPreisEinzel').value = row.preispronacht;
            }
            else if (row.anzBett === 2){
                document.getElementById('premiumPreisDoppel').value = row.preispronacht;
            }
    }
    switch (row.art){
        case 'Luxus':
            if (row.anzBett === 1){
                document.getElementById('luxusPreisEinzel').value = row.preispronacht;
            }
            else if (row.anzBett === 2){
                document.getElementById('luxusPreisDoppel').value = row.preispronacht;
            }
    }

    let art = document.getElementById("art").value;
    let anzBett = document.getElementById("anzBett").value;
    let preisProNacht = document.getElementById("preisProNacht").value;

        // Daten als JSON-Objekt vorbereiten
        let data = {
            art: art,
            anzBett: anzBett,
            preisProNacht: preisProNacht
        };

        // Fetch-POST an PHP senden
        fetch("../../php/update_preis.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // JSON-Daten senden
        })
            .then(response => response.text())
            .catch(error => console.error("Fehler:", error));
        register('hide');

});

async function generateInvoice(buchungsNr) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    let data = {
        "buchungsnr": buchungsNr
    }

    try {
        const response = await fetch("../../php/get_rechnungsdinger.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // JSON-Daten senden
        })
            .then(response => response.json())
            .then(data => {
                const startDate = new Date(data.von);
                const endDate = new Date(data.bis);
                const diffInMs = endDate - startDate;
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                const rechnungsNr = Number(data.rechnungsnr)+1;
                doc.text("FUNREST Hotel", 10, 10);
                doc.text("Funstraße 1, 12345 Berlin", 10, 20);
                doc.text("RechnungNr: "+rechnungsNr, 10, 40);
                doc.text("BuchungsNr: "+buchungsNr, 10, 50)
                doc.text("Von: "+startDate.toLocaleDateString(), 10, 60);
                doc.text("Bis: "+endDate.toLocaleDateString(), 10, 70);
                doc.text("Zeitraum: "+diffInDays+" Nächte", 10, 80);
                doc.text("Zimmerart: "+data.zimmerart, 10, 90);
                doc.text("Preis: "+gesamtpreisErmitteln(startDate, endDate, data.preisProNacht)+"€", 10, 100);
            });
        if (response.ok) {
            alert("Rechnung wurde erfolgreich gespeichert!");
        } else {
            alert("Fehler beim Speichern der Rechnung.");
        }
    } catch (error) {
        alert("Netzwerkfehler beim Speichern der Rechnung.");
    }

    //doc.save("download/rechnung.pdf");

    const pdfData = doc.output("blob");

    const formData = new FormData();
    formData.append("file", pdfData, "rechnung.pdf");
    formData.append("buchungsNr", '1');

    try {
        const response = await fetch("../../php/insert_rechnung.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            });
        if (response.ok) {
            alert("Rechnung wurde erfolgreich gespeichert!");
        } else {
            alert("Fehler beim Speichern der Rechnung.");
        }
    } catch (error) {
        alert("Netzwerkfehler beim Speichern der Rechnung.");
    }
}

function gesamtpreisErmitteln(startDate, endDate, preisProNacht){
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const gesamtPreis = diffInDays * preisProNacht;
    return gesamtPreis;
}

function abbrechen(){
    document.getElementById('popupBearbeiten').style.display = "none";
}

function istStammkunde(action) {
    let ja = document.getElementById('ja');
    let nein = document.getElementById('nein');

    if(action === 'ja'){
        ja.checked = true;
        nein.checked = false;
    }else if(action === 'nein'){
        ja.checked = false;
        nein.checked = true;
    }
}

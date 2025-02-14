
const ONE_DAY = 1000 * 60 * 60 * 24;

function home() {
    window.location.href = "../oberflächen/startseite.html";
}
function confirmReview() {
    alert("Rezension bestätigt!");
}
function rejectReview() {
    alert("Rezension abgelehnt!");
}

function Bewertungen_anzeigen (){
    fetch("../../php/get_bewertung.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {

            });
        })
        .catch(error => console.error("Fehler:", error));
}

window.onload = function(){
    Bewertungen_anzeigen();

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
    } else if (action === 'hide') {
        verwaltung.style.display = "none";
    }
    if (senden === "senden") {
            /*an DB übergeben*/
    }
}

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
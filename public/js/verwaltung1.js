
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

function test(){
    console.log('klappt');
}

window.onload = function(){
    let i = 1
    fetch("../../php/get_verwaltungTable1.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";

            data.forEach(row => {
                const startDate = new Date(row.von);
                const endDate = new Date(row.bis);
                const diffInMs = endDate - startDate;
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                const gesamtPreis = diffInDays * row.preisProNacht;


                const cell = document.createElement("td");

                const btn = document.createElement("button");
                btn.id = i;
                btn.innerText = `Bearbeiten`;
                btn.addEventListener("click", function (){
                    console.log(btn.id);
                });

                cell.appendChild(btn);

                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.zimmernummer}</td><td>${row.vorname}</td><td>${row.nachname}</td><td>${row.von}</td><td>${row.bis}</td>
                                    <td>${row.email}</td><td>${row.anzahlBetten}</td><td>${gesamtPreis}€</td><td>${row.stammkunde}</td>
                                    <td><button onclick="generateInvoice()">Erstellen</button></td><td><button onclick="test()">Bearbeiten</button></td>`;
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

async function generateInvoice() {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    doc.text("FUNREST Hotel", 10, 10);
    doc.text("Funstraße 1, 12345 Berlin", 10, 20);
    doc.text("RechnungNr: ", 10, 40);
    doc.text("BuchungsNr: ___", 10, 50)
    doc.text("Von: __/__/____", 10, 60);
    doc.text("Bis: __/__/____", 10, 70);
    doc.text("Zeitraum: ___ Nächte", 10, 80);
    doc.text("Zimmerart: 'Luxus'", 10, 90);
    doc.text("Zimmernummer: '301'", 10, 100);
    doc.text("Preis: ___€", 10, 110);

    doc.save("download/rechnung.pdf");

    const pdfData = doc.output("blob");

    const formData = new FormData();
    formData.append("file", pdfData, "rechnung.pdf");

    try {
        const response = await fetch("../../php/rechnung", {
            method: "POST",
            body: formData
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
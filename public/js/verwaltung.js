/**
 * Leitet den Benutzer auf die Startseite um, indem die aktuelle Fenster-URL geändert wird.
 *
 * @return {void} Gibt keinen Wert zurück.
 */
function home() {
    window.location.href = "../oberflächen/startseite.html";
}

/**
 * Bestätigt eine Bewertung, indem die ID per POST-Anfrage an einen Server-Endpunkt gesendet wird.
 * Die Bewertungs-ID wird aus dem Session-Storage abgerufen, in ein JSON-Objekt eingebettet
 * und an ein PHP-Skript zur Verarbeitung gesendet. Nach erfolgreicher Verarbeitung wird eine
 * Bestätigungsnachricht angezeigt und die nächste Bewertung wird abgerufen.
 *
 * @return {void} Gibt keinen Wert zurück.
 */
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

/**
 * Lehnt eine Bewertung ab, indem die Bewertungs-ID per POST-Anfrage an den Server gesendet wird.
 * Die Bewertungs-ID wird aus dem Session-Storage abgerufen. Nach erfolgreicher Verarbeitung
 * wird eine Nachricht angezeigt und die nächste Bewertung abgerufen.
 *
 * @return {void} Gibt keinen Wert zurück.
 */
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

/**
 * Passt die Anzeige der Sternelemente basierend auf der übergebenen Bewertung an.
 *
 * @param {number} sterne - Die Anzahl der anzuzeigenden Sterne (1 bis 5).
 * @return {void} Gibt keinen Wert zurück. Die Funktion ändert die Sichtbarkeit der Sterne im DOM.
 */
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

/**
 * Ruft die nächste Bewertung vom Server ab und zeigt diese an, indem die DOM-Elemente aktualisiert werden.
 *
 * Die Methode führt eine asynchrone Anfrage aus, um Bewertungsdaten abzurufen. Wenn keine Bewertungen
 * vorhanden sind, wird ein Standardinhalt angezeigt. Ansonsten wird die Bewertung einschließlich
 * Sternebewertung und Bewertungstext im UI aktualisiert.
 *
 * @return {void} Gibt keinen Wert zurück.
 */
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

/**
 * Dieser Code wird aufgerufen, sobald die Webseite vollständig geladen ist (Event `window.onload`).
 *
 * **getNaechsteBewertung()**:
 *   Diese Funktion wird initial aufgerufen (vermutlich, um Bewertungen abzurufen oder anzuzeigen).
 *
 * **Abrufen und Anzeige von Verwaltungsdaten**:
 *   Ein `fetch`-Request ruft Daten aus der Datei `get_verwaltungTable.php` ab und wandelt sie in JSON um.
 *   Die Daten werden im Tabellen-Body (`<tbody>`) der Tabelle mit der ID `dataTable` eingefügt.
 *   Für jede Zeile in den Daten:
 *     Start- und Enddatum der Buchung werden in `Date`-Objekte umgewandelt.
 *     Der Gesamtpreis wird mithilfe der Funktion `gesamtpreisErmitteln` berechnet.
 *     Zwei Buttons werden erstellt:
 *       1. **Bearbeiten-Button**:
 *          Öffnet beim Klicken ein Bearbeitungs-Popup.
 *          Speichert die Buchungsnummer in der `sessionStorage`.
 *          Sendet die Buchungsnummer per `fetch` an `get_bearbeitung.php`.
 *          Die Antwortdaten (z. B. Vorname, Nachname, Ankunftsdatum) werden in die Eingabefelder des Popups eingetragen.
 *       2. **Rechnung-Erstellen-Button**:
 *          Ruft die Funktion `generateInvoice()` auf, um eine Rechnung anhand der Buchungsnummer zu erstellen.
 *     Eine neue Tabellenzeile (`<tr>`) wird erstellt, die die Buchungsdetails und die Buttons enthält.
 *
 * **Benutzerinformationen anzeigen**:
 *   Wenn der Benutzer in `sessionStorage` gespeichert ist:
 *     Wird der Benutzername sichtbar gemacht und angezeigt.
 *
 * **Fehlerbehandlung**:
 *   Fehler, die im Zuge der `fetch`-Operation auftreten, werden in der Konsole ausgegeben.
 */
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
                    sessionStorage.setItem("buchungsNr", btn.id);
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
                        .then(result => {
                            result.forEach(row => {
                                sessionStorage.setItem("zimmerNr", row.zimmernummer);
                                sessionStorage.setItem("benutzer_id_bearbeitung", row.benutzerid);
                                document.getElementById("zimmerNr").value = row.zimmernummer;
                                document.getElementById("vorname").value = row.vorname;
                                document.getElementById("nachname").value = row.nachname;
                                document.getElementById("ankunft").value = row.von;
                                document.getElementById("abreise").value = row.bis;
                                document.getElementById("email").value = row.email;
                                document.getElementById("bettanzahl").value = row.anzahlBetten;
                                if(row.stammkunde === 1){
                                    document.getElementById("ja").checked = "true";
                                }else{
                                    document.getElementById("nein").checked = "false";
                                }
                                console.log(result);
                            })

                        });
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

/**
 * Verwalten der Anzeige und Datenbefüllung des Preisverwaltungs-Popups.
 * Diese Funktion zeigt das Popup an oder blendet es aus und ruft bei Anzeige
 * die Zimmerpreisdaten vom Server ab.
 *
 * @param {string} action Gibt an, welche Aktion ausgeführt werden soll.
 *                        Kann 'show' sein, um das Popup anzuzeigen und Daten zu laden,
 *                        oder 'hide', um das Popup zu schließen.
 * @return {void} Gibt keinen Wert zurück.
 */
function preisVerwalten(action) {
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
}

/**
 * Dieser Event-Listener wird beim Absenden des Formulars "preisVerwaltenForm" ausgelöst.
 * Es wird verhindert, dass das Standard-Submit-Verhalten des Formulars ausgeführt wird.
 * Anschließend werden die Eingabedaten der Felder für Zimmerpreise in ein JSON-Format übernommen.
 * Die Daten enthalten Angaben zu Zimmerart, Anzahl der Betten und Preis pro Nacht.
 *
 * Ein `fetch`-POST-Request sendet die Daten an die Server-Seite ("update_preis.php"),
 * die für die Aktualisierung der Preise in der Datenbank zuständig ist.
 *
 * Nach erfolgreichem Abschluss wird eine Erfolgsmeldung angezeigt und das Popup
 * zum Bearbeiten der Preise wird geschlossen.
 */
document.getElementById("preisVerwaltenForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das Standard-Formular-Absenden

    // Daten als JSON-Objekt vorbereiten
    let data = [
        {
            art: 'Standard',
            anzBett: 1,
            preisProNacht: document.getElementById('standardPreisEinzel').value
        },
        {
            art: 'Standard',
            anzBett: 2,
            preisProNacht: document.getElementById('standardPreisDoppel').value
        },
        {
            art: 'Premium',
            anzBett: 1,
            preisProNacht: document.getElementById('premiumPreisEinzel').value
        },
        {
            art: 'Premium',
            anzBett: 2,
            preisProNacht: document.getElementById('premiumPreisDoppel').value
        },
        {
            art: 'Luxus',
            anzBett: 1,
            preisProNacht: document.getElementById('luxusPreisEinzel').value
        },
        {
            art: 'Luxus',
            anzBett: 2,
            preisProNacht: document.getElementById('luxusPreisDoppel').value
        }];

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
    alert("Preise wurden erfolgreich aktualisiert!");
    preisVerwalten('hide');
});

/**
 * Erstellt ein Rechnungs-PDF für eine gegebene Buchungsnummer und sendet es
 * zur Speicherung an den Server.
 *
 * @param {string} buchungsNr - Die Buchungsnummer, für die die Rechnung erstellt wird.
 * @return {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Rechnung erfolgreich
 * verarbeitet und gespeichert wurde, oder abgelehnt wird, falls ein Fehler auftritt.
 */
async function generateInvoice(buchungsNr) {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    let data = {
        "buchungsnr": buchungsNr
    }
    console.log(data);

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
                    console.log(data);
                    const startDate = new Date(data.von);
                    const endDate = new Date(data.bis);
                    const diffInMs = endDate - startDate;
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    const rechnungsNr = Number(data.rechnungsnr) + 1;
                    doc.text("FUNREST Hotel", 10, 10);
                    doc.text("Funstraße 1, 12345 Berlin", 10, 20);
                    doc.text("RechnungNr: " + rechnungsNr, 10, 40);
                    doc.text("BuchungsNr: " + buchungsNr, 10, 50)
                    doc.text("Von: " + startDate.toLocaleDateString(), 10, 60);
                    doc.text("Bis: " + endDate.toLocaleDateString(), 10, 70);
                    doc.text("Zeitraum: " + diffInDays + " Nächte", 10, 80);
                    doc.text("Zimmerart: " + data.zimmerart, 10, 90);
                    doc.text("Preis: " + gesamtpreisErmitteln(startDate, endDate, data.preisProNacht) + "€", 10, 100);

            });
    } catch (error) {
        alert("Netzwerkfehler beim Speichern der Rechnung.\n" + error);
    }

    const pdfData = doc.output("blob");


    const formData = new FormData();
    formData.append("file", pdfData, "rechnung.pdf");
    formData.append("buchungsNr", buchungsNr);

    try {
        const response = await fetch("../../php/insert_rechnung.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            });
        if (response) {
            alert("Rechnung wurde erfolgreich gespeichert!");
        } else {
            alert("Fehler beim Speichern der Rechnung.");
        }
    } catch (error) {
        alert("Netzwerkfehler beim Speichern der Rechnung.\n" + error);
    }
}

/**
 * Berechnet den Gesamtpreis basierend auf dem Aufenthaltszeitraum und dem Preis pro Nacht.
 *
 * @param {Date} startDate - Das Startdatum des Aufenthalts.
 * @param {Date} endDate - Das Enddatum des Aufenthalts.
 * @param {number} preisProNacht - Der Preis pro Nacht in der gewünschten Währung.
 * @return {number} Der Gesamtpreis für den Aufenthalt.
 */
function gesamtpreisErmitteln(startDate, endDate, preisProNacht){
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const gesamtPreis = diffInDays * preisProNacht;
    return gesamtPreis;
}

/**
 * Blendet das HTML-Element mit der ID 'popupBearbeiten' aus, indem der
 * Anzeige-Stil auf 'none' gesetzt wird.
 *
 * @return {void} Diese Methode gibt keinen Wert zurück.
 */
function abbrechen(){
    document.getElementById('popupBearbeiten').style.display = "none";
}

/**
 * Aktualisiert den Status der Radio-Buttons basierend auf der Aktion des Kunden.
 *
 * @param {string} action - Gibt an, ob der Kunde ein Stammkunde ist ("ja") oder nicht ("nein").
 * @return {void} Diese Funktion gibt keinen Wert zurück.
 */
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

/**
 * Dieser Event-Listener wird ausgelöst, wenn das Formular "bearbeitungForm" abgesendet wird.
 *
 * Das Standardverhalten des Formulars (Neuladen der Seite) wird via `event.preventDefault()` verhindert.
 * Die Eingabedaten (Zimmernummer, Buchungszeitraum, Benutzerinformationen, Stammkundenstatus usw.)
 *   werden gesammelt und in ein JSON-Objekt übertragen.
 * Der Stammkundenstatus wird geprüft, indem festgestellt wird, ob das Radio-Button-Feld mit der ID "ja" ausgewählt wurde.
 * Die gesammelten Daten werden in einer POST-Anfrage mithilfe von `fetch` an "update_buchung.php" gesendet,
 *   um die Buchungsdaten auf der Serverseite zu aktualisieren.
 * Nach erfolgreichem Abschluss wird die Seite aktualisiert (`window.onload()`), und die Abbruchfunktion wird aufgerufen.
 * Im Falle eines Fehlers wird dieser in der Konsole protokolliert.
 */
document.getElementById("bearbeitungForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let stammkunde = document.getElementById("ja").checked ? 1 : 0;

    let data = {
        zimmerNr: sessionStorage.getItem("zimmerNr"),
        vonDatum: document.getElementById("ankunft").value,
        bisDatum: document.getElementById("abreise").value,
        buchungsNr: sessionStorage.getItem("buchungsNr"),
        benutzerId: sessionStorage.getItem("benutzer_id_bearbeitung"),
        email: document.getElementById("email").value,
        stammkunde: stammkunde
    }
    console.log(data);
    fetch("../../php/update_buchung.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            abbrechen();
            window.onload();
        })
        .catch(error => {
            console.error("Fehler:", error);
        });
});

/**
 * Dieser Code wird beim Laden der Webseite ausgeführt (Event `window.onload`).
 *
 * **Zimmerart anzeigen**:
 *   Die Zimmerart wird aus `sessionStorage` abgerufen und in das HTML-Element mit der ID `art` eingefügt.
 *   Das zugehörige Zimmerbild wird basierend auf der Zimmerart dynamisch aktualisiert, indem das `src`-Attribut des Bildes mit der ID `zimmerImg` gesetzt wird (Pfad: `../img/${zimmerArt}.png`).
 *
 * **Benutzernamen anzeigen**:
 *   Der Benutzername aus `sessionStorage` wird in das HTML-Element mit der ID `name` eingefügt.
 *
 * **Funktionale Aufrufe**:
 *   **dataChange()**: Wird aufgerufen, um Datenänderungen zu verarbeiten oder Daten nach Änderungen zu aktualisieren.
 *   **kommentareAnzeigen()**: Wird aufgerufen, um Kommentare anzuzeigen.
 */
window.onload = function(){
    let zimmerArt = sessionStorage.getItem("zimmerArt");
    document.getElementById('art').innerHTML = zimmerArt;
    document.getElementById('name').innerText = sessionStorage.getItem("username");
    document.getElementById('zimmerImg').src = `../img/${zimmerArt}.png`;
    dataChange();
    kommentareAnzeigen();
}

/**
 * Ruft Kommentare ab, die mit einem bestimmten Zimmertyp verknüpft sind,
 * und zeigt diese in einem bestimmten Textbereich an. Die Anzeige umfasst
 * Sternbewertungen in Form von ⭐-Symbolen sowie den Kommentartext.
 *
 * Die Methode sendet eine POST-Anfrage an das angegebene serverseitige Skript
 * mit den Zimmertyp-Daten (aus dem Session Storage abgerufen). Nach Erhalt
 * einer Antwort verarbeitet und formatiert sie die Daten in ein lesbares Format.
 *
 * @return {void} Gibt keinen Wert zurück. Zeigt die abgerufenen Kommentare
 *                direkt im Textbereich des DOM-Elements mit der ID "kommentarArea" an.
 */
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
                        case 5:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 4:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 3:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 2:
                            document.getElementById("kommentarArea").value += "⭐";
                        case 1:
                            document.getElementById("kommentarArea").value += "⭐";
                            break;
                    }

                    document.getElementById("kommentarArea").value += ('\n' + row.bewertung + '\n\n');
                });

        })
        .catch(error => console.error("Fehler:", error));
}

/**
 * Wechselt den Anzeigestatus eines Popup-Elements basierend auf der angegebenen Aktion.
 *
 * @param {string} action - Die auszuführende Aktion für das Popup. Akzeptiert "show",
 *                          um das Popup anzuzeigen, oder "hide", um es auszublenden.
 * @return {void} Diese Funktion gibt keinen Wert zurück.
 */
function changePopup(action){
    let popup = document.getElementById("popupBuchung");

    if (action === "show") {
        popup.style.display = "block";
    } else if (action === "hide") {
        dataChange();
        popup.style.display = "none";
    }
}

/**
 * Passt den Status der Checkboxen basierend auf dem angegebenen Parameter an.
 *
 * @param {string} gecheckt Gibt an, welche Checkbox ausgewählt werden soll.
 *                          Akzeptiert 'einzel', um die Checkbox "einzelzimmer" auszuwählen,
 *                          und 'doppel', um die Checkbox "doppelzimmer" auszuwählen.
 * @return {void} Gibt keinen Wert zurück.
 */
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

/**
 * Aktualisiert die Verfügbarkeits- und Preisinformationen basierend auf Benutzereingaben
 * und Daten, die vom Server abgerufen werden.
 * Die Methode sammelt Informationen über die Zimmerart, die Anzahl der Betten und den
 * ausgewählten Datumsbereich, sendet diese Daten an den Server und aktualisiert die
 * Benutzeroberfläche mit den abgerufenen Verfügbarkeits- und Preisinformationen.
 *
 * @return {void} Gibt keinen Wert zurück. Diese Funktion führt UI-Updates durch und
 * loggt Serverantworten in die Konsole.
 */
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
        })
        .catch(error => console.error("Fehler:", error));
    console.log(data);
}

/**
 * Ermittelt den Gesamtpreis basierend auf der Anzahl der Nächte zwischen zwei Daten
 * und dem Preis pro Nacht.
 *
 * @param {Date} startDate - Der Startzeitpunkt der Buchung.
 * @param {Date} endDate - Der Endzeitpunkt der Buchung.
 * @param {number} preisProNacht - Der Preis pro Nacht in der gewünschten Währung.
 * @return {number} Der berechnete Gesamtpreis der Buchung.
 */
function gesamtpreisErmitteln(startDate, endDate, preisProNacht){
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const gesamtPreis = diffInDays * preisProNacht;
    return gesamtPreis;
}

/**
 * Event-Listener für das Absenden des Buchungsformulars.
 *  Verhindert das Standardverhalten des Formulars (Seitenneuaufladung).
 *  Überprüft die Auswahl der Checkbox (einzelzimmer oder doppelzimmer),
 *    um die Anzahl der Betten zu bestimmen.
 *  Erstellt ein Datenobjekt mit den Buchungsdetails (Zimmerart,
 *    Benutzer-ID, An- und Abreisedatum) und sendet dieses als JSON
 *    im POST-Request an den Server (buchen.php).
 *  Zeigt ein Popup an, während die Buchung verarbeitet wird.
 *  Prüft die Antwort des Servers:
 *    - Wenn Zimmer vorhanden sind, wird eine Erfolgsmeldung angezeigt
 *      und die Buchung als erfolgreich markiert.
 *    - Wenn keine Zimmer verfügbar sind, wird eine Fehlermeldung angezeigt,
 *      um den Zeitraum zu ändern.
 *  Fehler während der Anfrage werden im Konsolenprotokoll ausgegeben.
 */
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
                alert("Buchung erfolgeich. Die Rechnung wird an Ihre E-mail geschickt.")
                // Konfetti starten
                confetti({
                    particleCount: 2000, // Anzahl der Konfetti-Teilchen
                    spread: 500,         // Breite der Streuung
                    origin: {
                        x: 0.5, // Horizontale Startposition (zentriert)
                        y: 0.5  // Vertikale Startposition (Mitte des Formulars)
                    }
                });
            }else{
                alert("Kein freies Zimmer gefunden. Bitte anderen Zeitraum wählen.")
            }
        })
        .catch(error => {
            console.error("Fehler:", error);
        });
    console.log(data);
});

/**
 * Event-Listener für das Laden der DOM-Inhalte.
 * Sucht die Eingabefelder für "vonDatum" und "bisDatum" aus dem DOM.
 * Initialisiert "heute" als das aktuelle Datum und "morgen" als das Datum
 *   von morgen (einen Tag nach dem aktuellen Datum).
 * Definiert eine Funktion `formatDate`, um ein Datumsobjekt in das Format
 *   "YYYY-MM-DD" umzuwandeln (ISO 8601), wie es in HTML-Datumseingabefeldern verwendet wird.
 * Setzt das Standarddatum für "vonDatum" auf das heutige Datum
 *   und für "bisDatum" auf das morgige Datum.
 * Schränkt die Eingabefelder so ein, dass kein Datum vor den angegebenen
 *   Minimumwerten ("heute" bzw. "morgen") ausgewählt werden kann.
 */
 
document.addEventListener("DOMContentLoaded", () => {
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

/**
 * Aktualisiert das früheste auswählbare Datum für das Eingabefeld "bisDatum" basierend
 * auf dem Wert, der im Feld "vonDatum" eingegeben wurde. Passt den bestehenden Wert von
 * "bisDatum" automatisch an, falls dieser vor dem neuen Mindestdatum liegt.
 * Ruft die Funktion `dataChange` nach dem Aktualisierungsprozess auf.
 *
 * @return {void} Diese Funktion gibt keinen Wert zurück.
 */
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
    dataChange();
}

/**
 * Leitet den Benutzer auf die Startseite um, indem die aktuelle Fenster-URL geändert wird.
 *
 * @return {void} Diese Funktion gibt keinen Wert zurück.
 */
function home() {
    window.location.href = "../oberflächen/startseite.html";
}
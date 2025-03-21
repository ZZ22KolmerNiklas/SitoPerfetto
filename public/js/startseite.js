/**
 * Dieser Code wird ausgeführt, sobald die Webseite vollständig geladen ist (Event `window.onload`).
 *
 * Überprüft, ob ein Benutzername in `sessionStorage` gespeichert ist:
 *   Wenn ein Benutzername vorhanden ist, wird der Name angezeigt, indem das entsprechende Element sichtbar gemacht und
 *     sein Textinhalt aktualisiert wird (`sessionStorage.getItem("username")`).
 *   Das Login-Element wird ausgeblendet und die Abmelden-Schaltfläche sichtbar gemacht.
 * Überprüft, ob der Benutzer Admin-Rechte hat (`sessionStorage.getItem("admin") === '1'`):
 *   Ist der Benutzer ein Admin, wird die Verwaltungsfunktion sichtbar gemacht.
 */
window.onload = function(){
    if(sessionStorage.getItem("username") !== null){
        document.getElementById('name').style.display =  "block";
        document.getElementById('name').innerText = sessionStorage.getItem("username");
        document.getElementById('login').style.display = "none";
        document.getElementById('abmelden').style.display = "block";
        if(sessionStorage.getItem("admin") === '1'){
            document.getElementById("verwalten").style.display = "block";
        }
    }
}

/**
 * Verwalte die Sichtbarkeit des Login-Popups und setze Eingabefelder zurück, wenn es ausgeblendet wird.
 *
 * @param {string} action - Bestimmt die auszuführende Aktion. Mit "show" wird das Login-Popup angezeigt,
 *                          mit "hide" wird es verborgen und die Eingabefelder geleert.
 * @return {void} Gibt keinen Wert zurück.
 */
function login(action){
    let popup = document.getElementById("popuplogin");

    if (action === "show") {
        popup.style.display = "block";
    } else if (action === "hide") {
        popup.style.display = "none";
        document.getElementById('loginemail').value = '';
        document.getElementById('loginpw').value = '';
    }
}

/**
 * Meldet den Benutzer ab, indem es die Sichtbarkeit der UI-Elemente ändert und den Session-Storage löscht.
 *
 * @return {void} Gibt keinen Wert zurück.
 */
function abmelden() {
    // Hand anzeigen
    const hand = document.getElementById("hand");
    hand.style.display = "inline-block";
    // Optional: Nach einer Verzögerung Hand ausblenden (z. B. nach 3 Sekunden)
    setTimeout(() => {
        hand.style.display = "none";
    }, 3000); // Zeigt die Hand 3 Sekunden lang
    document.getElementById('login').style.display = "block";
    document.getElementById('name').style.display = "none";
    document.getElementById('verwalten').style.display = "none";
    document.getElementById('abmelden').style.display = "none";
    sessionStorage.clear();

}

/**
 * Navigiert den Browser zur Seite "verwaltung.html" im Verzeichnis "oberflächen".
 *
 * @return {void} Gibt keinen Wert zurück.
 */
function verwalten(){
    window.location.href = "../oberflächen/verwaltung.html";
}

/**
 * Führt die Auswahl eines Zimmers durch und leitet zur Buchungsseite weiter, wenn der Benutzer eingeloggt ist.
 * Zeigt andernfalls eine Fehlermeldung an.
 *
 * @param {string} zimmer - Der vom Benutzer ausgewählte Zimmertyp.
 * @return {void} Gibt keinen Wert zurück.
 */
function zimmerWahl(zimmer){
    if(document.getElementById("login").style.display === "none"){
        sessionStorage.setItem("zimmerArt", zimmer);

        window.location.href = "../oberflächen/zimmerBuchen.html";
    }else{
        alert("Anmeldung erforderlich.");
    }

}

/**
 * Steuert die Sichtbarkeit des Registrierungs-Popups.
 *
 * @param {string} action - Die auszuführende Aktion. Akzeptiert "show", um das Popup anzuzeigen, oder "hide", um es zu verbergen.
 * @return {void} Gibt keinen Wert zurück.
 */
function register(action){
    let popupReg = document.getElementById("popupregister");
    let popupLog = document.getElementById("popuplogin");

    if (action === "show") {
        popupReg.style.display = "block";
        popupLog.style.display = "none"
    } else if (action === "hide") {
        popupReg.style.display = "none";
        document.getElementById('registeremail').value = '';
        document.getElementById('registerpw').value = '';
        document.getElementById('registerpwwdh').value = '';
        document.getElementById('vorname').value = '';
        document.getElementById('nachname').value = '';
        document.getElementById('maennlich').checked = false;
        document.getElementById('weiblich').checked = false;
        document.getElementById('divers').checked = false;
        document.getElementById('straße').value = '';
        document.getElementById('hausnr').value = '';
        document.getElementById('plz').value = '';
        document.getElementById('ort').value = '';
        document.getElementById('land').value = '';
        document.getElementById('gebdate').value = '';
    }
}

/**
 * Aktualisiert die Auswahl des Geschlechts basierend auf dem angegebenen Parameter.
 *
 * @param {string} action - Die Kennung des Geschlechts ('m' für männlich, 'w' für weiblich, 'd' für divers).
 * @return {void} Gibt keinen Wert zurück.
 */
function changeGeschlecht(action) {
    let maennlich = document.getElementById('maennlich');
    let weiblich = document.getElementById('weiblich');
    let divers = document.getElementById('divers');

    if(action === 'm'){
        maennlich.checked = true;
        weiblich.checked = false;
        divers.checked = false;
    }else if(action === 'w'){
        maennlich.checked = false;
        weiblich.checked = true;
        divers.checked = false;
    }else if(action === 'd'){
        maennlich.checked = false;
        weiblich.checked = false;
        divers.checked = true;
    }
}

/**
 * Dieser Event-Listener wird beim Absenden des Login-Formulars "loginForm" ausgeführt.
 *
 * Verhindert das Standardverhalten des Formulars (Seitenneuladen) mittels `event.preventDefault()`.
 * Liest die Werte der Eingabefelder für E-Mail und Passwort aus.
 * Erstellt ein JSON-Objekt mit den Anmeldedaten (E-Mail und Passwort).
 * Sendet die Anmeldedaten über einen `fetch`-POST-Request an den Server ("login.php").
 * Verarbeitet die Serverantwort:
 *   Bei erfolgreicher Anmeldung:
 *     Speichert den Benutzernamen, die Benutzer-ID und den Admin-Status in `sessionStorage`.
 *     Passt die Sichtbarkeit mehrerer UI-Elemente an (z. B. zeigt den Benutzernamen an
 *       und blendet das Login-Formular aus).
 *     Zeigt zusätzliche Verwaltungsoptionen an, wenn der Benutzer ein Admin ist.
 *   Bei fehlgeschlagener Anmeldung:
 *     Zeigt eine Fehlermeldung im Popup an.
 * Eingabefelder (E-Mail und Passwort) werden nach erfolgreicher Anmeldung geleert.
 */
document.getElementById("loginForm").addEventListener("submit", async function (event){
    event.preventDefault(); // Verhindert das Standard-Formular-Absenden

    let email = document.getElementById("loginemail").value;
    let passwort = document.getElementById("loginpw").value;

    let data = {
        email: email,
        passwort: passwort
    };

    // Fetch-POST an PHP senden
    fetch("../../php/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // JSON-Daten senden
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if(result.success){
                sessionStorage.setItem("username", result.name);
                sessionStorage.setItem("user_id", result.user_id);
                sessionStorage.setItem("admin", result.admin);
                document.getElementById('name').style.display = 'block';
                document.getElementById('name').innerText = result.name;
                document.getElementById('popuplogin').style.display = 'none';
                document.getElementById('login').style.display = 'none';
                document.getElementById('abmelden').style.display = 'block';
                document.getElementById('loginemail').value = '';
                document.getElementById('loginpw').value = '';
                if(result.admin === 1){
                    document.getElementById('verwalten').style.display = "block";
                }
            }else{
                alert(result.message);
            }
        });
});

/**
 * Dieser Event-Listener wird beim Absenden des Registrierungsformulars "registerForm" ausgelöst.
 *
 * Verhindert das Standardverhalten des Formulars (Seitenneuladen) mit `event.preventDefault()`.
 * Liest die eingegebenen Daten aus den Formularfeldern aus, einschließlich Vorname, Nachname,
 *   Geschlecht, Adresse, Geburtsdatum, E-Mail und Passwort.
 * Überprüft, ob das Passwort mit der Passwortwiederholung übereinstimmt und zeigt eine
 *   Fehlermeldung an, falls dies nicht der Fall ist.
 * Wenn die Passwörter übereinstimmen, wird ein Datenobjekt erstellt, das alle gesammelten
 *   Informationen in ein JSON-Format umwandelt.
 * Dieses JSON-Objekt wird über einen POST-Request mit `fetch` an den Server ("insert_kunde.php")
 *   gesendet, um die Registrierungsdaten zu speichern.
 * Nach erfolgreichem Senden wird das Registrierungs-Popup ausgeblendet.
 */
document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das Standard-Formular-Absenden

    // Daten aus dem Formular holen
    let vorname = document.getElementById("vorname").value;
    let nachname = document.getElementById("nachname").value;
    let geschlecht;
    let strasse = document.getElementById("straße").value;
    let hausnr = document.getElementById("hausnr").value;
    let plz = document.getElementById("plz").value;
    let ort = document.getElementById("ort").value;
    let land = document.getElementById("land").value;
    let gebdate = document.getElementById("gebdate").value;
    let email = document.getElementById("registeremail").value;
    let passwort = document.getElementById("registerpw").value;
    let passwortWdh = document.getElementById('registerpwwdh').value;

    if (document.getElementById('maennlich').checked) {
        geschlecht = 'm';
    } else if (document.getElementById('weiblich')) {
        geschlecht = 'w';
    } else if (document.getElementById('divers')) {
        geschlecht = 'd';
    }

    if(passwort !== passwortWdh){
        alert("Passwörter stimmen nicht überein!")
    }else{
        // Daten als JSON-Objekt vorbereiten
        let data = {
            vorname: vorname,
            nachname: nachname,
            geschlecht: geschlecht,
            strasse: strasse,
            hausnr: hausnr,
            plz: plz,
            ort: ort,
            land: land,
            gebdate: gebdate,
            email: email,
            passwort: passwort
        };

        // Fetch-POST an PHP senden
        fetch("../../php/insert_kunde.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // JSON-Daten senden
        })
            .then(response => response.text())
            .catch(error => console.error("Fehler:", error));
        register('hide');
    }
});

/**
 * Verarbeitet die Anzeige, das Verbergen oder die Übermittlung von Bewertungsdaten.
 *
 * @param {string} action - Bestimmt, ob das Bewertungs-Popup angezeigt ("show") oder ausgeblendet ("hide") wird.
 * @param {string} senden - Bestimmt den Kontext, z. B. "senden" für Datenübermittlung.
 * @return {void} Gibt keinen Wert zurück.
 */
function bewertung(action, senden){
    if(senden === "senden"){
        if(stern === 0){
            alert("Wähle zwischen einem und fünf Sternen.");
            return;
        }else{
            let data = {
                zimmer: bewertungart,
                benutzer: sessionStorage.getItem("user_id"),
                bewertung: document.getElementById("textarea").value,
                sterne: stern}

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
        }
    } else {
        bewertungart = senden;
    }

    if(document.getElementById("login").style.display === "none") {
        let bewertung = document.getElementById("bewertungPopup");
        if (action === 'show') {
            bewertung.style.display = "block";
        } else if (action === 'hide') {
            bewertung.style.display = "none";
            document.getElementsByName("rating").forEach(element => element.checked = false)
            document.getElementById("textarea").value = '';
        }
    } else {
        alert("Anmeldung erforderlich.");
    }
}

let stern = 0;
let bewertungart = "";

/**
 * Setzt den Wert von `stern` auf die angegebene Nummer.
 *
 * @param {number} anzahl - Die Nummer, die `stern` zugewiesen werden soll.
 * @return {void} - Diese Funktion gibt keinen Wert zurück.
 */
function sterne(anzahl){
    stern = anzahl;
}

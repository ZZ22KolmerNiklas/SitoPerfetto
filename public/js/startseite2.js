function login(action){
    let popup = document.getElementById("popuplogin");

    if (action === "show") {
        popup.style.display = "block";
    } else if (action === "hide") {
        popup.style.display = "none";
    }
}

function zimmerWahl(zimmer){
    if(zimmer === 's'){
        sessionStorage.setItem("zimmerArt", "Standart");
    }else if (zimmer === 'p'){
        sessionStorage.setItem("zimmerArt", "Premium");
    }else if (zimmer === 'l'){
        sessionStorage.setItem("zimmerArt", "Luxus");
    } else{
        sessionStorage.setItem("zimmerArt", "Error");
    }
    window.location.href = "../oberflächen/zimmerBuchen.html";
}

function register(action){
    let popupReg = document.getElementById("popupregister");
    let popupLog = document.getElementById("popuplogin");

    if (action === "show") {
        popupReg.style.display = "block";
        popupLog.style.display = "none"
    } else if (action === "hide") {
        popupReg.style.display = "none";
    }
}

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
    let passwort = await generateHash(document.getElementById("registerpw").value);
    console.log(passwort);

    if (document.getElementById('maennlich').checked) {
        geschlecht = 'm';
    } else if (document.getElementById('weiblich')) {
        geschlecht = 'w';
    } else if (document.getElementById('divers')) {
        geschlecht = 'd';
    }

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
    console.log(data);

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
});

async function generateHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
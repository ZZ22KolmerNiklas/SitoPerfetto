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

function abmelden() {
    document.getElementById('login').style.display = "block";
    document.getElementById('name').style.display = "none";
    document.getElementById('verwalten').style.display = "none";
    document.getElementById('abmelden').style.display = "none";
    sessionStorage.clear();
}

function verwalten(){
    window.location.href = "../oberflächen/verwaltung.html";
}

function zimmerWahl(zimmer){
    if(zimmer === 's'){
        sessionStorage.setItem("zimmerArt", "Standard");
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
                document.getElementById('errornachricht').innerText = result.message;
                document.getElementById('popuperror').style.display = "block";
            }
        });
});

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
        document.getElementById('errornachricht').innerText = 'Passwörter stimmen nicht überein!';
        document.getElementById('popuperror').style.display = "block";
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

function schliessen() {
    document.getElementById('popuperror').style.display = "none";
}

function bewertung(action, senden){
    let bewertung = document.getElementById("bewertungPopup");
    if(action === 'show'){
        bewertung.style.display = "block";
    }else if (action === 'hide') {
        bewertung.style.display = "none";
    }
    if(senden === "senden"){
        /*an DB übergeben*/
    }
}

function sterne(anzahl){
    console.log(anzahl);
}

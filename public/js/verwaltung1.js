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
    fetch("../../php/get_verwaltungTable1.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";

            data.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.zimmernummer}</td><td>${row.vorname}</td><td>${row.nachname}</td><td>${row.von}</td><td>${row.bis}</td>
                                    <td>${row.email}</td><td>${row.anzahlBetten}</td><td>${row.gesammtpreis}</td><td>${row.stammkunde}</td>
                                    <td><button onclick="test()">Erstellen</button></td><td><button onclick="test()">Bearbeiten</button></td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error("Fehler:", error));
}
function preisVerwalten(action, senden){
    let verwaltung = document.getElementById("preisVerwaltungPopup");
    if(action === 'show'){
        verwaltung.style.display = "block";
    }else if (action === 'hide') {
        verwaltung.style.display = "none";
    }
    if(senden === "senden"){
        /*an DB übergeben*/
    }
}
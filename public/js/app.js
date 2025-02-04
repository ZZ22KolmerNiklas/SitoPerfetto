document.getElementById("meinFormular").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;

    fetch("../php/process.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "name=" + encodeURIComponent(name)
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById("antwort").innerText = data;
        })
        .catch(error => console.error("Fehler:", error));
});
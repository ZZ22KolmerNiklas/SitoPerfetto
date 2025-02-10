<?php
global $conn;
include 'database.php'; // Verbindung importieren

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];

    // SQL-Befehl vorbereiten (Sicher vor SQL-Injections)
    $stmt = $conn->prepare("INSERT INTO kunde (vorname, email) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $email);

    if ($stmt->execute()) {
        echo "Benutzer erfolgreich gespeichert!";
    } else {
        echo "Fehler: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
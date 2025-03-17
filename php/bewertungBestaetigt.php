<?php
global $conn;
include 'database.php'; // Verbindung importieren

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $BewertungID = $data["bewertungId"];

    // SQL-Befehl vorbereiten (Sicher vor SQL-Injections)
    $stmt = $conn->prepare("UPDATE bewertung SET ueberprueft = 1 WHERE BewertungID = ?");
    $stmt->bind_param("i",  $BewertungID);

    if ($stmt->execute()) {
        echo "Benutzer erfolgreich gespeichert!";
    } else {
        echo "Fehler: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
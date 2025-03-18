<?php
global $conn;
include 'database.php'; // Verbindung importieren

// Prüfen, ob JSON-Daten empfangen wurden
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $art = $data["art"];
    $anzBett = $data["anzBett"];
    $preisProNacht = $data["preisProNacht"];

    // Preis ändern
    $stmt = $conn->prepare("UPDATE zimmer SET preisProNacht = ? WHERE art = ? and anzBett = ?");
    $stmt->bind_param("dsi", $preisProNacht, $art, $anzBett);
    $stmt->execute();

    $stmt->close();
    $conn->close();
}
?>
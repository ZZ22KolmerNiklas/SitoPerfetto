<?php
global $conn;
include 'database.php'; // Verbindung importieren

// Prüfen, ob JSON-Daten empfangen wurden
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    foreach ($data as $zimmer){
        $art = $zimmer["art"];
        $anzBett = $zimmer["anzBett"];
        $preisProNacht = $zimmer["preisProNacht"];

        // Preis ändern
        $stmt = $conn->prepare("UPDATE zimmer SET preisProNacht = ? WHERE art = ? and anzBett = ?");
        $stmt->bind_param("dsi", $preisProNacht, $art, $anzBett);
        $stmt->execute();
        $stmt->close();
    }

    $stmt->close();
    $conn->close();
}
?>
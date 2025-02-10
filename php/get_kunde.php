<?php
global $conn;
include 'database.php'; // Verbindung importieren

$sql = "SELECT vorname, email FROM kunde";
$result = $conn->query($sql);

$benutzer = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $benutzer[] = $row;
    }
}

echo json_encode($benutzer); // Gibt die Daten als JSON aus

$conn->close();
?>
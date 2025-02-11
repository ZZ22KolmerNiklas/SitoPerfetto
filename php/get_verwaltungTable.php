<?php
global $conn;
include 'database.php'; // Verbindung importieren

$sql = "SELECT vorname, email FROM kunde";
$result = $conn->query($sql);

$daten = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $daten[] = $row;
    }
}

echo json_encode($daten); // Gibt die Daten als JSON aus

$conn->close();
?>
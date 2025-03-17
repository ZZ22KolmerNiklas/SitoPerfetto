<?php

global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);


$zimmer = isset($data['zimmer']) ? trim($data['zimmer']) : '';
$benutzer = isset($data['benutzer']) ? intval($data['benutzer']) : 0;
$vonDatum = isset($data['bewertung']) ? trim($data['bewertung']) : '';
$bisDatum = isset($data['sterne']) ? intval($data['sterne']) : 0;
$ueberprueft = 0;


if ($sterne < 1 || empty($bewertung)) {
    echo json_encode(["error" => "Ungültige Eingabe"]);
    exit();
}

// SQL-Statement vorbereiten
$stmt = $conn->prepare("INSERT INTO buchung (zimmer, benutzer, vondatum, bisdatum) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssii", $zimmer, $benutzer, $vonDatum, $bisDatum);
$stmt->execute();
echo json_encode($data);

// Verbindung schließen
$stmt->close();
$conn->close();
?>
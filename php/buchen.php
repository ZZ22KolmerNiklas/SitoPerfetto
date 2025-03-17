<?php

global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);


$anzBett = isset($data['anzBett']) ? intval($data['anzBett']) : 0;
$zimmerArt = isset($data['zimmerArt']) ? trim($data['zimmerArt']) : '';
$benutzer = isset($data['benutzer']) ? intval($data['benutzer']) : 0;
$vonDatum = isset($data['vonDatum']) ? trim($data['vonDatum']) : '';
$bisDatum = isset($data['bisDatum']) ? trim($data['bisDatum']) : '';

if (empty($anzBett) || empty($benutzer) || empty($vonDatum) || empty($bisDatum)) {
    echo json_encode(['error' => 'Fehlende Parameter']);
    exit;
}

// 1. Freie Zimmer abfragen
$stmt = $conn->prepare("
    SELECT z.zimmernr
    FROM zimmer z
    LEFT JOIN Buchung b ON z.zimmernr = b.zimmer
    AND (
      (b.vondatum <= ? AND b.bisdatum >= ?)
      OR (b.vondatum <= ? AND b.bisdatum IS NULL)
    )
    WHERE b.zimmer IS NULL
    AND z.anzbett = ?
    AND z.art = ?
");

if (!$stmt) {
    echo json_encode(['error' => 'Fehler bei der SQL-Prepare: ' . $conn->error]);
    exit;
}

$stmt->bind_param("sssis", $bisDatum, $vonDatum, $bisDatum, $anzBett, $zimmerArt);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'Kein freies Zimmer gefunden']);
    exit;
}

$row = $result->fetch_assoc();
$zimmer = $row['zimmernr'];

$stmt->close();

// 2. Buchung erstellen
$stmt = $conn->prepare("INSERT INTO buchung (zimmer, benutzer, vondatum, bisdatum) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['error' => 'Fehler bei der SQL-Prepare (INSERT): ' . $conn->error]);
    exit;
}

$stmt->bind_param("iiss", $zimmer, $benutzer, $vonDatum, $bisDatum);
if ($stmt->execute()) {
    echo json_encode(['success' => 'Buchung erfolgreich', 'zimmer' => $zimmer]);
} else {
    echo json_encode(['error' => 'Fehler beim Einfügen: ' . $stmt->error]);
}

// Verbindung schließen
$stmt->close();
$conn->close();
?>
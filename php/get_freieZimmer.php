<?php

global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);


$anzBett = isset($data['anzBett']) ? intval($data['anzBett']) : 0;
$zimmerArt = isset($data['zimmerArt']) ? trim($data['zimmerArt']) : '';
$vonDatum = isset($data['vonDatum']) ? trim($data['vonDatum']) : '';
$bisDatum = isset($data['bisDatum']) ? trim($data['bisDatum']) : '';

$stmt = $conn->prepare("
    SELECT COUNT(z.zimmernr) AS anzZimmer, z.preispronacht, z.zimmernr
    FROM zimmer z
    LEFT JOIN buchung b ON z.zimmernr = b.zimmer
    AND (
      (b.vondatum <= ? AND b.bisdatum >= ?) -- Zeitraum überschneidet sich
      OR (b.vondatum <= ? AND b.bisdatum IS NULL) -- Offene Buchung
    )
    WHERE b.zimmer IS NULL
    AND z.anzbett = ?
    AND z.art = ?
");

$stmt->bind_param("sssis", $bisDatum, $vonDatum, $bisDatum, $anzBett, $zimmerArt);

$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

// Verbindung schließen
$stmt->close();
$conn->close();
?>
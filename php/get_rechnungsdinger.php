<?php
global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

$buchungsNr = isset($data['buchungsnr']) ? intval($data['buchungsnr']) : 0;

$stmt = $conn->prepare("
    SELECT 
        b.zimmer, b.benutzer, b.vondatum, b.bisdatum,
        u.vorname, u.nachname, u.adresse,
        a.straße, a.hausnummer, a.plz, a.ort, a.land,
        z.anzBett, z.preispronacht, z.art,
        max(r.rechnungsnr)
    FROM buchung b
    JOIN benutzer u ON b.benutzer = u.BenutzerID
    JOIN adresse a ON a.adresseid = u.adresse
    JOIN zimmer z ON b.zimmer = z.zimmernr
    JOIN rechnung r ON r.buchung = b.buchungsnr
    WHERE b.buchungsNr = ?
");
$stmt->bind_param("i", $buchungsNr);
$stmt->execute();
$stmt->store_result();

$stmt->bind_result(
    $zimmer_nr, $benutzer_id, $vondatum, $bisdatum,
    $vorname, $nachname, $adresse_id,
    $strasse, $hausnr, $plz, $ort, $land,
    $anzBett, $preisProNacht, $zimmerart,
    $rechnungs_nr
);
$stmt->fetch();

$data = [
    "zimmernummer" => $zimmer_nr,
    "vorname" => $vorname,
    "nachname" => $nachname,
    "strasse" => $strasse,
    "hausnr" => $hausnr,
    "plz" => $plz,
    "ort" => $ort,
    "land" => $land,
    "anzahlBetten" => $anzBett,
    "preisProNacht" => $preisProNacht,
    "zimmerart" => $zimmerart,
    "von" => $vondatum,
    "bis" => $bisdatum,
    "rechnungsnr" => $rechnungs_nr
];

echo json_encode($data);

$stmt->close();
$conn->close();
?>
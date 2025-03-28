<?php
global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);
$buchungsnr = isset($data['buchungsnr']) ? intval($data['buchungsnr']) : 0;




$stmt = $conn->prepare("
    SELECT 
        b.buchungsnr, b.zimmer, b.benutzer, b.vondatum, b.bisdatum,
        u.vorname, u.nachname, u.stammkunde, u.email,
        z.anzBett, z.preispronacht
    FROM buchung b
    JOIN benutzer u ON b.benutzer = u.BenutzerID
    JOIN zimmer z ON b.zimmer = z.zimmernr
    WHERE b.buchungsnr = ?
");
$stmt->bind_param("s", $buchungsnr);
$stmt->execute();
$stmt->store_result();

$stmt->bind_result(
    $buchungs_nr,$zimmer_nr, $benutzer_id, $vondatum, $bisdatum,
    $vorname, $nachname, $stammkunde, $email,
    $anzBett, $preisProNacht
);

$data = [];
while ($stmt->fetch()) {
    $data[] = [
        "zimmernummer" => $zimmer_nr,
        "benutzerid" => $benutzer_id,
        "vorname" => $vorname,
        "nachname" => $nachname,
        "stammkunde" => $stammkunde,
        "email" => $email,
        "anzahlBetten" => $anzBett,
        "preisProNacht" => $preisProNacht,
        "von" => $vondatum,
        "bis" => $bisdatum
    ];
}



echo json_encode($data);

$stmt->close();
$conn->close();
?>
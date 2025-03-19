<?php
global $conn;
include 'database.php'; // Verbindung importieren

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $zimmerNr = $data["zimmerNr"];
    $vonDatum = $data["vonDatum"];
    $bisDatum = $data["bisDatum"];
    $buchungsNr = $data["buchungsNr"];
    $benutzerId = $data["benutzerId"];
    $email = $data["email"];
    $stammkunde = $data["stammkunde"];

    // SQL-Befehl vorbereiten (Sicher vor SQL-Injections)
    $stmt = $conn->prepare("UPDATE buchung SET zimmer = ?, vondatum = ?, bisdatum = ? WHERE buchungsnr = ?");
    $stmt->bind_param("issi",  $zimmerNr, $vonDatum, $bisDatum, $buchungsNr);

    if ($stmt->execute()) {
        echo "Buchung erfolgreich bearbeitet!";
    } else {
        echo "Fehler: " . $stmt->error;
    }
    $stmt->close();

    $stmt = $conn->prepare("UPDATE benutzer SET email = ?, stammkunde = ? WHERE benutzerid = ?");
    $stmt->bind_param("sii",  $email, $stammkunde, $benutzerId);

    if ($stmt->execute()) {
        echo "Benutzer erfolgreich bearbeitet!";
    } else {
        echo "Fehler: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
<?php
global $conn;
include 'database.php'; // Verbindung importieren

// Prüfen, ob JSON-Daten empfangen wurden
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $vorname = $data["vorname"];
    $nachname = $data["nachname"];
    $geschlecht = $data["geschlecht"];
    $strasse = $data["strasse"];
    $hausnr = $data["hausnr"];
    $plz = $data["plz"];
    $ort = $data["ort"];
    $land = $data["land"];
    $gebdate = $data["gebdate"];
    $email = $data["email"];
    $passwort = $data["passwort"];
    $stammkunde = 0;
    $mitarbeiter = 0;

    // 1. Adresse einfügen
    $stmt = $conn->prepare("INSERT INTO adresse (straße, hausnummer, plz, ort, land) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $strasse, $hausnr, $plz, $ort, $land);
    $stmt->execute();

    // 2. ID der eingefügten Adresse abrufen
    $adresse_id = $conn->insert_id;

    $stmt = $conn->prepare("INSERT INTO passwort (passwort) VALUES (?)");
    $stmt->bind_param("s", $passwort);
    $stmt->execute();

    $passwort_id = $conn->insert_id;

    // 3. Benutzer mit der Adresse einfügen
    $stmt = $conn->prepare("INSERT INTO benutzer (adresse, passwort, vorname, nachname, geschlecht, geburtsdatum, email, stammkunde, mitarbeiter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssssii", $adresse_id, $passwort_id, $vorname, $nachname, $geschlecht, $gebdate, $email, $stammkunde, $mitarbeiter);
    $stmt->execute();

    $stmt->close();
    $conn->close();
} else {
    die;
}
?>
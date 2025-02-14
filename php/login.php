<?php
global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["passwort"])) {
    echo json_encode(["success" => false, "message" => "Fehlende Eingaben!"]);
    exit;
}

$email = $data["email"];
$passwort = $data["passwort"];

// Benutzer in der DB suchen
$stmt = $conn->prepare("SELECT BenutzerID, passwort, Vorname, Nachname, Mitarbeiter FROM benutzer WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result( $benutzer_id, $passwort_id, $vorname, $nachname, $admin);
    $stmt->fetch();

    $stmt = $conn->prepare("SELECT passwort FROM passwort WHERE PasswortID = ?");
    $stmt->bind_param("i", $passwort_id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($hashedPasswort);
    $stmt->fetch();

    if (password_verify($passwort, $hashedPasswort)) {
        session_start();
        $_SESSION["user_id"] = $benutzer_id;
        echo json_encode(["success" => true, "message" => "Login erfolgreich!", "name" => "$vorname $nachname", "user_id" => $benutzer_id, "admin" => $admin]);
    } else {
        echo json_encode(["success" => false, "message" => "Falsches Passwort!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Benutzer nicht gefunden!"]);
}

$stmt->close();
$conn->close();
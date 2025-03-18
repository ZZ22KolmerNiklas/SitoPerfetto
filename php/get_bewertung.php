<?php
global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);
$buchungsnr = isset($data['buchungsnr']) ? intval($data['buchungsnr']) : 0;


$stmt = $conn->prepare("SELECT bewertungID, Zimmer, bewertung, sterne FROM bewertung WHERE ueberprueft = 0 LIMIT 1");
$stmt->execute();
$stmt->store_result();

$stmt->bind_result(
    $bewertungid, $zimmer, $bewertung, $sterne
);

$data = [];
while ($stmt->fetch()) {
    $data[] = [
        "bewertungid" => $bewertungid,
        "zimmer" => $zimmer,
        "bewertung" => $bewertung,
        "sterne" => $sterne
    ];
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>
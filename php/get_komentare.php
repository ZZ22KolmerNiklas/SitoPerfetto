<?php
global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);
$zimmer = isset($data['zimmer']) ? trim($data['zimmer']) : '';


$stmt = $conn->prepare("SELECT bewertung, sterne FROM bewertung WHERE Zimmer = ? AND ueberprueft = 1");
$stmt->bind_param("s", $zimmer);
$stmt->execute();
$stmt->store_result();

$stmt->bind_result(
    $bewertung, $sterne
);

$data = [];
while ($stmt->fetch()) {
    $data[] = [
        "bewertung" => $bewertung,
        "sterne" => $sterne
    ];
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>
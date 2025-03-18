<?php

global $conn;
header("Content-Type: application/json");
include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);


$stmt = $conn->prepare("
    SELECT DISTINCT(art) as art, anzBett, preispronacht 
    FROM zimmer 
");

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
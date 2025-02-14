<?php
global $conn;
include 'database.php'; // Verbindung importieren

// Prüfen, ob JSON-Daten empfangen wurden
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"]) && isset($_POST["buchungsNr"])) {
    $uploadDir = "uploads/"; // Ordner für PDFs
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true); // Falls nicht vorhanden, erstelle ihn

    $buchungsNr = intval($_POST["buchungsNr"]); // ID aus dem Formular
    $fileName = "rechnung_" . $buchungsNr . "_" . time() . ".pdf"; // Dateiname generieren
    $filePath = $uploadDir . $fileName;

    // 🔹 Datei speichern
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $filePath)) {
        // 🔹 In die Datenbank schreiben
        $stmt = $conn->prepare("INSERT INTO rechnung (buchung, dateiname, dateipfad) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $buchungsNr, $fileName, $filePath);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "PDF gespeichert!", "path" => $filePath]);
    } else {
        echo json_encode(["success" => false, "message" => "Fehler beim Speichern der PDF"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Fehlende Datei oder ID"]);
}
?>
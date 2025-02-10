<?php
$host = "localhost";  // Server (bei XAMPP: localhost)
$user = "root";       // Standard-User in XAMPP
$pass = "";           // Standard ist leer, falls nicht geändert
$dbname = "sitoperfetto"; // Name der Datenbank

// Verbindung herstellen
$conn = new mysqli($host, $user, $pass, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Zeichenkodierung setzen (UTF-8)
$conn->set_charset("utf8");
?>
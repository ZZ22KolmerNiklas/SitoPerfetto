<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    echo "Hallo, " . $name . "! Deine Anfrage wurde erfolgreich verarbeitet.";
}
?>
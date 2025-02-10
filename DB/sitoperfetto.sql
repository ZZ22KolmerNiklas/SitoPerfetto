-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 10. Feb 2025 um 22:54
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `sitoperfetto`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `adresse`
--

CREATE TABLE `adresse` (
                           `AdresseID` int(11) NOT NULL,
                           `Straße` varchar(255) DEFAULT NULL,
                           `Hausnummer` varchar(5) DEFAULT NULL,
                           `Plz` varchar(5) DEFAULT NULL,
                           `Ort` varchar(255) DEFAULT NULL,
                           `Land` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `adresse`
--

INSERT INTO `adresse` (`AdresseID`, `Straße`, `Hausnummer`, `Plz`, `Ort`, `Land`) VALUES
                                                                                      (1, 'Adminstraße', '1', '54321', 'Adminstadt', 'Adminland'),
                                                                                      (2, 'Musterstraße', '1', '12345', 'Musterstadt', 'Musterland');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--

CREATE TABLE `benutzer` (
                            `BenutzerID` int(11) NOT NULL,
                            `Passwort` int(11) DEFAULT NULL,
                            `Adresse` int(11) DEFAULT NULL,
                            `Vorname` varchar(255) DEFAULT NULL,
                            `Nachname` varchar(255) DEFAULT NULL,
                            `Geschlecht` char(1) DEFAULT NULL,
                            `Geburtsdatum` date DEFAULT NULL,
                            `EMail` varchar(255) DEFAULT NULL,
                            `Stammkunde` tinyint(1) DEFAULT NULL,
                            `Mitarbeiter` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `benutzer`
--

INSERT INTO `benutzer` (`BenutzerID`, `Passwort`, `Adresse`, `Vorname`, `Nachname`, `Geschlecht`, `Geburtsdatum`, `EMail`, `Stammkunde`, `Mitarbeiter`) VALUES
                                                                                                                                                            (1, 1, 1, 'John', 'Doe', 'm', '1999-01-01', 'admin@mail.com', 0, 1),
                                                                                                                                                            (2, 2, 2, 'Max', 'Mustermann', 'm', '2000-01-01', 'muster@mail.com', 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bewertung`
--

CREATE TABLE `bewertung` (
                             `BewertungID` int(11) NOT NULL,
                             `Zimmer` varchar(3) DEFAULT NULL,
                             `Benutzer` int(11) DEFAULT NULL,
                             `Bewertung` varchar(255) DEFAULT NULL,
                             `ueberprueft` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `buchung`
--

CREATE TABLE `buchung` (
                           `BuchungsNr` varchar(5) NOT NULL,
                           `Zimmer` varchar(3) DEFAULT NULL,
                           `Benutzer` int(11) DEFAULT NULL,
                           `vonDatum` date DEFAULT NULL,
                           `bisDatum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `passwort`
--

CREATE TABLE `passwort` (
                            `PasswortID` int(11) NOT NULL,
                            `Passwort` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `passwort`
--

INSERT INTO `passwort` (`PasswortID`, `Passwort`) VALUES
                                                      (1, '$2y$10$s6JyCieTlv5cFF.VP98MDuAlUs5t1o/M71ierToKoX82eOyxT8nwa'),
                                                      (2, '$2y$10$wWqT4.EQ3jrCVYRpsKwTmeUSaRJriaFJZu1KFZyL5yM53cE7uIbiO');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rechnung`
--

CREATE TABLE `rechnung` (
                            `RechnungsNr` varchar(255) NOT NULL,
                            `Buchung` varchar(5) DEFAULT NULL,
                            `Adresse` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zimmer`
--

CREATE TABLE `zimmer` (
                          `ZimmerNr` varchar(3) NOT NULL,
                          `Art` varchar(255) DEFAULT NULL,
                          `anzBett` varchar(1) DEFAULT NULL,
                          `PreisProNacht` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `adresse`
--
ALTER TABLE `adresse`
    ADD PRIMARY KEY (`AdresseID`);

--
-- Indizes für die Tabelle `benutzer`
--
ALTER TABLE `benutzer`
    ADD PRIMARY KEY (`BenutzerID`),
    ADD KEY `Passwort` (`Passwort`),
    ADD KEY `Adresse` (`Adresse`);

--
-- Indizes für die Tabelle `bewertung`
--
ALTER TABLE `bewertung`
    ADD PRIMARY KEY (`BewertungID`),
    ADD KEY `Zimmer` (`Zimmer`),
    ADD KEY `Benutzer` (`Benutzer`);

--
-- Indizes für die Tabelle `buchung`
--
ALTER TABLE `buchung`
    ADD PRIMARY KEY (`BuchungsNr`),
    ADD KEY `Zimmer` (`Zimmer`),
    ADD KEY `Benutzer` (`Benutzer`);

--
-- Indizes für die Tabelle `passwort`
--
ALTER TABLE `passwort`
    ADD PRIMARY KEY (`PasswortID`);

--
-- Indizes für die Tabelle `rechnung`
--
ALTER TABLE `rechnung`
    ADD PRIMARY KEY (`RechnungsNr`),
    ADD KEY `Buchung` (`Buchung`),
    ADD KEY `Adresse` (`Adresse`);

--
-- Indizes für die Tabelle `zimmer`
--
ALTER TABLE `zimmer`
    ADD PRIMARY KEY (`ZimmerNr`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `adresse`
--
ALTER TABLE `adresse`
    MODIFY `AdresseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `benutzer`
--
ALTER TABLE `benutzer`
    MODIFY `BenutzerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `bewertung`
--
ALTER TABLE `bewertung`
    MODIFY `BewertungID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `passwort`
--
ALTER TABLE `passwort`
    MODIFY `PasswortID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `benutzer`
--
ALTER TABLE `benutzer`
    ADD CONSTRAINT `benutzer_ibfk_1` FOREIGN KEY (`Passwort`) REFERENCES `passwort` (`PasswortID`),
    ADD CONSTRAINT `benutzer_ibfk_2` FOREIGN KEY (`Adresse`) REFERENCES `adresse` (`AdresseID`);

--
-- Constraints der Tabelle `bewertung`
--
ALTER TABLE `bewertung`
    ADD CONSTRAINT `bewertung_ibfk_1` FOREIGN KEY (`Zimmer`) REFERENCES `zimmer` (`ZimmerNr`),
    ADD CONSTRAINT `bewertung_ibfk_2` FOREIGN KEY (`Benutzer`) REFERENCES `benutzer` (`BenutzerID`);

--
-- Constraints der Tabelle `buchung`
--
ALTER TABLE `buchung`
    ADD CONSTRAINT `buchung_ibfk_1` FOREIGN KEY (`Zimmer`) REFERENCES `zimmer` (`ZimmerNr`),
    ADD CONSTRAINT `buchung_ibfk_2` FOREIGN KEY (`Benutzer`) REFERENCES `benutzer` (`BenutzerID`);

--
-- Constraints der Tabelle `rechnung`
--
ALTER TABLE `rechnung`
    ADD CONSTRAINT `rechnung_ibfk_1` FOREIGN KEY (`Buchung`) REFERENCES `buchung` (`BuchungsNr`),
    ADD CONSTRAINT `rechnung_ibfk_2` FOREIGN KEY (`Adresse`) REFERENCES `adresse` (`AdresseID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

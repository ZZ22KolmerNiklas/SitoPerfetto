DROP DATABASE IF EXISTS SitoPerfetto;
CREATE DATABASE SitoPerfetto;

USE SitoPerfetto;

CREATE TABLE Zimmer(
	ZimmerNr int PRIMARY KEY,
	Art varchar(255),
	anzBett int,
	PreisProNacht varchar(255)
);

CREATE TABLE Rechnung(
	RechnungsNr int AUTO_INCREMENT PRIMARY KEY,
	Buchung int,
	Dateiname varchar(255),
	Dateipfad varchar(255)
);

CREATE TABLE Buchung(
	BuchungsNr int AUTO_INCREMENT PRIMARY KEY,
	Zimmer int,
	Benutzer int,
	vonDatum date,
	bisDatum date
);

CREATE TABLE Bewertung(
	BewertungID int AUTO_INCREMENT PRIMARY KEY,
	Benutzer int,
	Zimmer varchar(20),
	Bewertung varchar(255),
	Sterne int,
	ueberprueft boolean
);

CREATE TABLE Benutzer(
	BenutzerID int AUTO_INCREMENT PRIMARY KEY,
	Passwort int,
	Adresse int,
	Vorname varchar(255),
	Nachname varchar(255),
	Geschlecht char,
	Geburtsdatum date,
	EMail varchar(255),
	Stammkunde boolean,
	Mitarbeiter boolean
);

CREATE TABLE Adresse(
	AdresseID int AUTO_INCREMENT PRIMARY KEY,
	Straße varchar(255),
	Hausnummer varchar(5),
	Plz varchar(5),
	Ort varchar(255),
	Land varchar(255)
);

CREATE TABLE Passwort(
	PasswortID int AUTO_INCREMENT PRIMARY KEY,
	Passwort varchar(255)
);

ALTER TABLE Rechnung ADD FOREIGN KEY (Buchung) REFERENCES Buchung(BuchungsNr);
ALTER TABLE Buchung ADD FOREIGN KEY (Zimmer) REFERENCES Zimmer(ZimmerNr);
ALTER TABLE Buchung ADD FOREIGN KEY (Benutzer) REFERENCES Benutzer(BenutzerID);
ALTER TABLE Bewertung ADD FOREIGN KEY (Benutzer) REFERENCES Benutzer(BenutzerID);
ALTER TABLE Benutzer ADD FOREIGN KEY (Passwort) REFERENCES Passwort(PasswortID);
ALTER TABLE Benutzer ADD FOREIGN KEY (Adresse) REFERENCES Adresse(AdresseID);

INSERT INTO Adresse (straße, hausnummer, plz, ort, land)
VALUES ('Adminstraße', '1', '54321', 'Adminstadt', 'Adminland');
INSERT INTO Adresse (straße, hausnummer, plz, ort, land)
VALUES ('Musterstraße', '1', '12345', 'Musterstadt', 'Musterland');

INSERT INTO Passwort (passwort)
VALUES ('$2y$10$s6JyCieTlv5cFF.VP98MDuAlUs5t1o/M71ierToKoX82eOyxT8nwa');
INSERT INTO Passwort (passwort)
VALUES ('$2y$10$wWqT4.EQ3jrCVYRpsKwTmeUSaRJriaFJZu1KFZyL5yM53cE7uIbiO');

INSERT INTO Benutzer (passwort, adresse, vorname, nachname, geschlecht, geburtsdatum, email, stammkunde, mitarbeiter)
VALUES (1, 1, 'John', 'Doe', 'm', '1999-01-01', 'admin@mail.com', 0, 1);
INSERT INTO Benutzer (passwort, adresse, vorname, nachname, geschlecht, geburtsdatum, email, stammkunde, mitarbeiter)
VALUES (2, 2, 'Max', 'Mustermann', 'm', '2000-01-01', 'muster@mail.com', 0, 0);


INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (101, 'standard', 2, '70');
INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (201, 'standard', 2, '100');
INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (301, 'standard', 2, '130');
INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (102, 'standard', 1, '50');
INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (202, 'standard', 1, '70');
INSERT INTO Zimmer (ZimmerNr, art, anzbett, PreisProNacht)
VALUES (302, 'standard', 1, '90');

INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (101, 2, '2024-12-24', '2024-12-26');
INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (201, 2, '2025-01-24', '2025-01-27');
INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (301, 2, '2025-02-01', '2025-02-05');
INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (102, 2, '2025-02-13', '2025-02-20');
INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (202, 2, '2025-03-02', '2025-03-23');
INSERT INTO Buchung (zimmer, benutzer, vondatum, bisdatum)
VALUES (302, 2, '2025-04-15', '2025-04-24');
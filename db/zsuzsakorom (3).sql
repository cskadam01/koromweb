-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 11. 13:17
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `zsuzsakorom`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin`
--

CREATE TABLE `admin` (
  `admin_Id` int(11) NOT NULL,
  `adminName` varchar(255) NOT NULL,
  `adminPass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `admin`
--

INSERT INTO `admin` (`admin_Id`, `adminName`, `adminPass`) VALUES
(1, 'Zsuzsa', '$2b$12$w0aNIJR3HRE.ucjhmqgV6uIgjDSnTIZYRHv2CvLFP26uzRuI9jUKG');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `appointment`
--

CREATE TABLE `appointment` (
  `foglalId` int(11) NOT NULL,
  `datum` date NOT NULL,
  `kezdIdo` varchar(255) NOT NULL,
  `vegIdo` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `megerosit` tinyint(1) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `appointment`
--

INSERT INTO `appointment` (`foglalId`, `datum`, `kezdIdo`, `vegIdo`, `userId`, `megerosit`, `duration`) VALUES
(2, '2024-12-19', '16:00:00', '16:00:00', 2, 1, 0),
(3, '2024-12-08', '12:30:00', '13:30:00', 1, 1, 0),
(4, '2024-12-08', '15:30:00', '16:30:00', 6, 1, 0),
(5, '2024-12-05', '14:30:00', '15:30:00', 10, 1, 0),
(7, '2024-12-28', '16:30:00', '16:30:00', 2, 1, 0),
(8, '2024-12-13', '13:00:00', '14:00:00', 10, 1, 0),
(9, '2024-12-19', '14:00:00', '15:00:00', 8, 1, 0),
(10, '2024-12-12', '10:00:00', '11:00:00', 1, 1, 0),
(11, '2024-12-06', '16:30:00', '16:30:00', 2, 1, 0),
(12, '2025-01-08', '10:00:00', '11:30:00', 6, 0, 90),
(13, '2025-01-08', '12:00:00', '13:30:00', 4, 0, 90),
(14, '2025-01-09', '14:00:00', '15:30:00', 1, 0, 90),
(15, '2025-01-09', '16:00:00', '17:30:00', 5, 0, 90),
(16, '2025-01-10', '09:30:00', '11:00:00', 10, 0, 90),
(17, '2025-01-10', '12:30:00', '14:00:00', 4, 0, 90),
(18, '2025-01-11', '08:30:00', '10:00:00', 9, 0, 90),
(19, '2025-01-11', '11:00:00', '12:30:00', 1, 0, 90),
(20, '2025-01-12', '13:00:00', '14:30:00', 10, 0, 90),
(21, '2025-01-12', '15:30:00', '17:00:00', 5, 0, 90),
(22, '2025-02-03', '08:00', '09:00', 0, 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `id` int(11) NOT NULL,
  `idopont_id` int(11) NOT NULL,
  `user_nev` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_telefon` varchar(20) NOT NULL,
  `statusz` enum('pending','confirmed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`id`, `idopont_id`, `user_nev`, `user_email`, `user_telefon`, `statusz`) VALUES
(3, 3, 'a', 'a', 'a', 'confirmed'),
(4, 3, 'asd', 'asdasd', 'asdasd', 'pending'),
(5, 2, 'Ádám', 'adam.csokonyi@gmail.com', '363085774070', 'confirmed'),
(9, 2, 'Buzi Vagy Fiam', 'daniel.farkas465@gmail.com', '123456789', 'confirmed'),
(10, 3, 'Zsuzsa', 'homolyazsuzsa@gmail.com', '123456789', 'confirmed'),
(11, 2, 'Anna', 'leposa.anna@gmail.com', '31235343456', 'confirmed');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `kezdes_ido` time DEFAULT NULL,
  `vege_ido` time DEFAULT NULL,
  `max_ferohely` int(11) NOT NULL,
  `idopont_tipus` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `idopontok`
--

INSERT INTO `idopontok` (`id`, `datum`, `kezdes_ido`, `vege_ido`, `max_ferohely`, `idopont_tipus`) VALUES
(2, '2025-02-13', '10:32:00', '11:33:00', 5, 'susu'),
(3, '2025-02-20', '10:44:00', '15:44:00', 30, 'ASDASD'),
(4, '2025-02-14', NULL, NULL, 5, 'asd'),
(5, '2025-02-15', '20:25:00', NULL, 3, 'Francia Köröm');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kepzesek`
--

CREATE TABLE `kepzesek` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `leiras` text NOT NULL,
  `kep` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kepzesek`
--

INSERT INTO `kepzesek` (`id`, `cim`, `leiras`, `kep`) VALUES
(2, 'Képzés', 'HEHEHAHAHA', 'brush.png'),
(3, 'Francia Köröm', 'Ezen a képzésen megtanulhatsz Francia körmöt építeni stb stb stb', 'korom.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `service`
--

CREATE TABLE `service` (
  `szolgalId` int(11) NOT NULL,
  `szolgalPrice` int(11) NOT NULL,
  `szolgalName` varchar(255) NOT NULL,
  `foglalID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL COMMENT 'Felhasználónév',
  `userEmail` varchar(255) NOT NULL COMMENT 'Felhasználó email címe',
  `userPhone` varchar(255) NOT NULL COMMENT 'Felhasználó telefonszáma'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`userId`, `userName`, `userEmail`, `userPhone`) VALUES
(0, 'ASD', 'sadasd@gmail.com', '234432'),
(1, 'User1', 'user1@example.com', '9134381215'),
(2, 'User2', 'user2@example.com', '8347808995'),
(3, 'User3', 'user3@example.com', '5430127410'),
(4, 'User4', 'user4@example.com', '3848764123'),
(5, 'User5', 'user5@example.com', '4470281129'),
(6, 'User6', 'user6@example.com', '8989171135'),
(7, 'User7', 'user7@example.com', '1985462071'),
(8, 'User8', 'user8@example.com', '8937858083'),
(9, 'User9', 'user9@example.com', '2891652404'),
(10, 'User10', 'user10@example.com', '1396851188');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_Id`);

--
-- A tábla indexei `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`foglalId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idopont_id` (`idopont_id`);

--
-- A tábla indexei `idopontok`
--
ALTER TABLE `idopontok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kepzesek`
--
ALTER TABLE `kepzesek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`szolgalId`),
  ADD KEY `foglalID` (`foglalID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userEmail` (`userEmail`),
  ADD UNIQUE KEY `userPhone` (`userPhone`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `appointment`
--
ALTER TABLE `appointment`
  MODIFY `foglalId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `kepzesek`
--
ALTER TABLE `kepzesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `service`
--
ALTER TABLE `service`
  MODIFY `szolgalId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`idopont_id`) REFERENCES `idopontok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`foglalID`) REFERENCES `appointment` (`foglalId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

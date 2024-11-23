-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 12. 11:51
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
(1, '[Zsuzsa]', '[123456]');

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
  `megerosit` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  MODIFY `foglalId` int(11) NOT NULL AUTO_INCREMENT;

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
-- Megkötések a táblához `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`foglalID`) REFERENCES `appointment` (`foglalId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

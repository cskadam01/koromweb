-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 10. 10:20
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
(12, 6, 'Szandi', 'ritteralexandra92@gmail.com', '+36206666666', 'confirmed');

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
(6, '2025-03-30', NULL, NULL, 20, 'Glitter Ombre'),
(7, '2025-03-08', NULL, NULL, 123, 'asdasd'),
(8, '2025-03-13', NULL, NULL, 23432, 'asddassdsda');

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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_Id`);

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
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `kepzesek`
--
ALTER TABLE `kepzesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`idopont_id`) REFERENCES `idopontok` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

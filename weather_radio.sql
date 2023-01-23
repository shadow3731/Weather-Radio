-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 20, 2023 at 07:30 PM
-- Server version: 8.0.19
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weather_radio`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `message_id` int UNSIGNED NOT NULL,
  `sender_login` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `send_time` datetime NOT NULL,
  `text` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `char_amount` int NOT NULL,
  `login_privilege` tinyint NOT NULL,
  `deleted` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`message_id`, `sender_login`, `send_time`, `text`, `char_amount`, `login_privilege`, `deleted`) VALUES
(1, 'admin', '2022-09-22 17:13:33', 'Первое сообщение', 16, 4, 0),
(2, 'Продуктовый', '2022-09-22 18:44:01', 'test', 4, 1, 0),
(3, 'Продуктовый', '2022-09-22 19:17:05', 'test2', 5, 1, 1),
(4, 'admin', '2022-09-22 22:21:05', 'qwerty', 6, 4, 0),
(5, 'Продуктовый', '2022-09-22 22:26:40', 'wasd', 4, 1, 1),
(6, 'admin', '2022-09-28 15:11:01', 'test3', 5, 4, 1),
(7, 'newUser', '2022-09-28 15:11:52', 'test4', 5, 2, 1),
(8, 'moba', '2022-09-28 16:55:19', 'Одмен', 5, 3, 1),
(9, 'Продуктовый', '2022-10-01 20:00:02', 'Banword', 7, 1, 0),
(10, 'Система', '2022-10-01 20:01:35', 'Пользователь Продуктовый был забанен по причине Banword на 90 минут.', 68, 10, 0),
(11, 'moba', '2022-10-01 21:25:45', 'Продуктовый, заслуженно забанен', 31, 3, 0),
(12, 'Система', '2022-10-01 21:45:17', 'Пользователь newUser был забанен по причине Test3 на 10 минут.', 62, 10, 1),
(13, 'wwe', '2022-10-10 18:15:06', 'test5', 5, 1, 1),
(18, 'Продуктовый', '2022-10-16 21:46:42', 'Сообщение из телефона', 21, 1, 1),
(47, 'admin', '2023-01-20 16:56:10', 'Deleted', 7, 4, 1),
(48, 'Система', '2023-01-20 17:20:57', 'Пользователь Продуктовый был забанен по причине Test на 1 минут.', 64, 10, 1),
(49, 'Система', '2023-01-20 17:25:32', 'Пользователь Продуктовый был забанен по причине Test на 1 минут.', 64, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `song_id` int NOT NULL,
  `artist` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `song` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `source` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `in_playlist1` tinyint(1) NOT NULL,
  `in_playlist2` tinyint(1) NOT NULL,
  `in_playlist3` tinyint(1) NOT NULL,
  `in_playlist4` tinyint(1) NOT NULL,
  `in_playlist5` tinyint(1) NOT NULL,
  `in_playlist6` tinyint(1) NOT NULL,
  `has_18+` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`song_id`, `artist`, `song`, `source`, `in_playlist1`, `in_playlist2`, `in_playlist3`, `in_playlist4`, `in_playlist5`, `in_playlist6`, `has_18+`) VALUES
(1, 'O-Zone', 'Dragostea Din Tei', 'client/Player/Music/O-Zone - Dragostea Din Tei.mp3', 1, 0, 0, 0, 0, 0, 0),
(2, 'Flo Rida', 'Whistle', 'client/Player/Music/Flo Rida - Whistle.mp3', 1, 0, 0, 0, 0, 0, 0),
(3, 'Thousand Foot Krutch', 'Take It Out On Me', 'client/Player/Music/Thousand Foot Krutch - Take It Out On Me.mp3', 1, 0, 0, 0, 0, 0, 0),
(4, 'Bring Me the Horizon', 'Throne', 'client/Player/Music/Bring Me The Horizon - Throne.mp3', 1, 0, 0, 0, 0, 0, 0),
(5, 'Cartoon feat. Daniel Levi', 'On & On', 'client/Player/Music/Cartoon feat. Daniel Levi - On _ On.mp3', 1, 0, 0, 0, 0, 0, 0),
(6, 'Deepside Deejays', 'Never Be Alone', 'client/Player/Music/Deepside Deejays - Never Be Alone.mp3', 1, 0, 0, 0, 0, 0, 0),
(7, 'Deuce', 'The One (2012)', 'client/Player/Music/Deuce - The One (2012).mp3', 1, 0, 0, 0, 0, 0, 0),
(8, 'Hollywood Undead', 'Been To Hell', 'client/Player/Music/Hollywood Undead - Been To Hell.mp3', 1, 0, 0, 0, 0, 0, 0),
(9, 'Hollywood Undead', 'Coming Home', 'client/Player/Music/Hollywood Undead - Coming Home.mp3', 1, 0, 0, 0, 0, 0, 0),
(10, 'Nickelback', 'Gotta Be Somebody', 'client/Player/Music/Nickelback - Gotta Be Somebody.mp3', 1, 0, 0, 0, 0, 0, 0),
(11, 'Nickelback', 'Gotta Be Somebody', 'client/Player/Music/Nickelback - Gotta Be Somebody.mp3', 1, 0, 1, 0, 0, 0, 0),
(12, 'ЛСП', 'Хиппи', 'client/Player/Music/ЛСП - Хиппи.mp3', 1, 0, 0, 0, 0, 0, 0),
(13, 'Макс Корж', 'Жить в кайф', 'client/Player/Music/Макс Корж - Жить в кайф.mp3', 1, 0, 0, 0, 0, 0, 0),
(14, 'Imagine Dragons', 'It\'s Time', 'client/Player/Music/Imagine Dragons - It_s Time.mp3', 1, 0, 0, 0, 0, 0, 0),
(15, 'Black Veil Brides', 'In The End', 'client/Player/Music/Black Veil Brides - In The End.mp3', 1, 0, 0, 0, 0, 0, 0),
(16, 'K\'NAAN', 'Wavin\' Flag', 'client/Player/Music/K_NAAN - Wavin_ Flag.mp3', 1, 0, 0, 0, 0, 0, 0),
(17, 'Three Days Grace', 'Running Away', 'client/Player/Music/Three Days Grays - Running Away.mp3', 0, 1, 0, 0, 0, 0, 0),
(18, 'Linkin Park', 'Leave Out All The Rest', 'client/Player/Music/Linkin Park - Leave Out All The Rest.mp3', 0, 1, 0, 1, 0, 0, 0),
(19, 'Three Days Grace', 'Tell Me Why', 'client/Player/Music/Three Days Grace - Tell Me Why.mp3', 0, 1, 0, 0, 1, 0, 0),
(20, 'Breaking Benjamin', 'Tourniquet', 'client/Player/Music/Breaking Benjamin - Tourniquet.mp3', 0, 1, 0, 0, 0, 1, 0),
(21, 'Breaking Benjamin, Red', 'Failure', 'client/Player/Music/Breaking Benjamin, Red - Failure.mp3', 0, 1, 0, 0, 1, 0, 0),
(22, 'Hollywood Undead', 'Day Of The Dead', 'client/Player/Music/Hollywood Undead - Day Of The Dead.mp3', 0, 1, 0, 0, 0, 0, 0),
(23, 'Hollywood Undead', 'Second Chances', 'client/Player/Music/Hollywood Undead - Second Chances.mp3', 0, 1, 0, 0, 0, 1, 0),
(24, 'Linkin Park', 'Lost In The Echo', 'client/Player/Music/LINKIN PARK - LOST IN THE ECHO.mp3', 0, 1, 0, 0, 0, 0, 0),
(25, 'Linkin Park', 'Lying from You', 'client/Player/Music/Linkin Park - Lying from You.mp3', 0, 1, 0, 0, 0, 0, 0),
(26, 'Three Days Grace', 'Landmine', 'client/Player/Music/Three Days Grace - Landmine.mp3', 0, 1, 0, 0, 0, 1, 0),
(27, 'Bad Wolves', 'Zombie', 'client/Player/Music/Bad Wolves - Zombie.mp3', 0, 1, 0, 0, 0, 0, 0),
(28, 'I Prevail', 'Breaking Down', 'client/Player/Music/I Prevail - Breaking Down.mp3', 0, 1, 0, 1, 0, 0, 0),
(29, 'Three Days Grace', 'Lifetime', 'client/Player/Music/Three Days Grace - Lifetime.mp3', 0, 1, 0, 0, 1, 0, 0),
(30, 'Saint Asonia', 'Ghost', 'client/Player/Music/Saint Asonia - Ghost.mp3', 0, 1, 0, 1, 0, 0, 0),
(31, 'Linkin Park', 'Sharp Edges', 'client/Player/Music/Linkin Park - Sharp Edges.mp3', 0, 0, 1, 0, 0, 0, 0),
(32, 'Breaking Benjamin', 'Rain (2005)', 'client/Player/Music/Breaking Benjamin - Rain (2005).mp3', 0, 0, 1, 0, 1, 0, 0),
(33, 'Kavinsky', 'Nightcall', 'client/Player/Music/Kavinsky - Nightcall.mp3', 0, 0, 1, 0, 0, 0, 0),
(34, 'Mujuice', 'Каждый день', 'client/Player/Music/Mujuice - Каждый день.mp3', 0, 0, 1, 0, 0, 0, 0),
(35, 'Breaking Benjamin', 'Ashes of Eden', 'client/Player/Music/Breaking Benjamin - Ashes of Eden.mp3', 0, 0, 1, 0, 0, 0, 0),
(36, 'Bring Me The Horizon', 'Oh No', 'client/Player/Music/Bring Me The Horizon - Oh No.mp3', 0, 0, 1, 0, 0, 0, 0),
(37, 'Hollywood Undead', 'Coming Back Down', 'client/Player/Music/Hollywood Undead - Coming Back Down.mp3', 0, 0, 1, 0, 0, 0, 0),
(38, 'Hollywood Undead', 'Dead Bite', 'client/Player/Music/Hollywood Undead - Dead Bite.mp3', 0, 0, 1, 0, 0, 0, 0),
(39, 'Макс Корж', 'Вспоминай меня', 'client/Player/Music/Макс Корж - Вспоминай меня.mp3', 0, 0, 1, 0, 0, 0, 0),
(40, 'ЛСП', 'Ползать', 'client/Player/Music/ЛСП - Ползать.mp3', 0, 0, 1, 0, 0, 0, 0),
(41, 'Three Days Grace', 'Human Race', 'client/Player/Music/Three Days Grace - Human Race.mp3', 0, 0, 1, 0, 0, 0, 0),
(42, 'Smokey Bennett & The Hoops', 'The Flames of Love', 'client/Player/Music/Smokey Bennett _ The Hoops - The Flames of Love.mp3', 0, 0, 1, 0, 0, 0, 0),
(43, 'Deuce', 'Gravestone', 'client/Player/Music/Deuce - Gravestone.mp3', 0, 0, 0, 1, 1, 0, 0),
(44, 'Slipknot', 'Danger - Keep Away', 'client/Player/Music/Slipknot - Danger - Keep Away.mp3', 0, 0, 0, 1, 1, 0, 0),
(45, 'Nickelback', 'Lullaby', 'client/Player/Music/Nickelback - Lullaby.mp3', 0, 0, 0, 1, 1, 0, 0),
(46, 'Hollywood Undead', 'Nightmare', 'client/Player/Music/Hollywood Undead - Nightmare.mp3', 0, 0, 0, 1, 0, 0, 0),
(47, 'Hollywood Undead', 'Outside', 'client/Player/Music/Hollywood Undead - Outside.mp3', 0, 0, 0, 1, 1, 0, 0),
(48, 'Linkin Park', 'My December', 'client/Player/Music/Linkin Park - My December.mp3', 0, 0, 0, 1, 1, 0, 0),
(49, 'Макс Корж', '2 типа людей', 'client/Player/Music/Макс Корж - 2 типа людей.mp3', 0, 0, 0, 1, 0, 0, 0),
(50, 'Макс Корж', 'Времена', 'client/Player/Music/Макс Корж - Времена.mp3', 0, 0, 0, 1, 0, 0, 0),
(51, 'Cole Russo', 'After Dark x Sweater Weather', 'client/Player/Music/Cole Russo - After Dark x Sweater Weather.mp3', 0, 0, 0, 1, 0, 0, 0),
(52, 'Eminem feat. Obie Trice, Stat Quo, 50 Cent', 'Spend Some Time', 'client/Player/Music/Eminem feat. Obie Trice, Stat Quo, 50 Cent - Spend Some Time.mp3', 0, 0, 0, 1, 1, 0, 0),
(53, 'Lana Del Ray', 'Summertime Sadness', 'client/Player/Music/Lana Del Rey - Summertime Sadness.mp3', 0, 0, 0, 1, 1, 0, 0),
(54, 'Linkin Park', 'In the End', 'client/Player/Music/Linkin Park - In the End.mp3', 0, 0, 0, 0, 1, 0, 0),
(55, 'Oxxxymiron', 'Полигон', 'client/Player/Music/Oxxxymiron - Полигон.mp3', 0, 0, 0, 0, 1, 0, 0),
(56, 'From Ashes To New', 'Scars That I\'m Hiding', 'client/Player/Music/From Ashes To New - Scars That I_m Hiding.mp3', 0, 0, 0, 0, 0, 1, 0),
(57, 'Slipknot', 'The Virus of Life', 'client/Player/Music/Slipknot - The Virus of Life.mp3', 0, 0, 0, 0, 0, 1, 0),
(58, 'Breaking Benjamin', 'Blood', 'client/Player/Music/Breaking Benjamin - Blood.mp3', 0, 0, 0, 0, 0, 1, 0),
(59, 'Bring Me The Horizon', 'Hospital for Souls', 'client/Player/Music/Bring Me The Horizon - Hospital for Souls.mp3', 0, 0, 0, 0, 0, 1, 0),
(60, 'Hollywood Undead', 'Already Dead', 'client/Player/Music/Hollywood Undead - Already Dead.mp3', 0, 0, 0, 0, 0, 1, 0),
(61, 'I Prevail', 'Come And Get It', 'client/Player/Music/I Prevail - Come And Get It.mp3', 0, 0, 0, 0, 0, 1, 0),
(62, 'STARSET', 'Ricochet', 'client/Player/Music/STARSET - Ricochet.mp3', 0, 0, 0, 0, 0, 1, 0),
(63, 'Breaking Benjamin', 'Believe', 'client/Player/Music/Breaking Benjamin - Believe.mp3', 0, 0, 0, 0, 0, 1, 0),
(64, 'Deuce', 'Nightmare', 'client/Player/Music/Deuce - Nightmare.mp3', 0, 0, 0, 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `songs_history`
--

CREATE TABLE `songs_history` (
  `history_id` int NOT NULL,
  `timestamp` datetime NOT NULL,
  `playlist_id` tinyint NOT NULL,
  `artist` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `song` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `songs_history`
--

INSERT INTO `songs_history` (`history_id`, `timestamp`, `playlist_id`, `artist`, `song`) VALUES
(1, '2022-09-29 16:04:00', 3, 'Linkin Park', 'Sharp Edges'),
(2, '2022-09-29 16:04:00', 6, 'Breaking Benjamin', 'Blood'),
(3, '2022-09-29 16:04:00', 1, 'Bring Me the Horizon', 'Throne'),
(4, '2022-09-29 16:04:00', 2, 'Linkin Park', 'Leave Out All The Rest'),
(5, '2022-09-29 16:06:00', 5, 'Hollywood Undead', 'Outside'),
(6, '2022-09-29 16:06:00', 4, 'Макс Корж', 'Времена'),
(7, '2022-09-29 16:23:00', 1, 'Bring Me the Horizon', 'Throne'),
(8, '2022-09-29 16:23:00', 3, 'Hollywood Undead', 'Coming Back Down'),
(9, '2022-09-29 16:23:00', 2, 'Three Days Grace', 'Tell Me Why'),
(10, '2022-09-29 16:23:00', 5, 'Linkin Park', 'In the End'),
(11, '2022-09-29 16:25:00', 4, 'Макс Корж', 'Времена'),
(12, '2022-09-29 16:25:00', 6, 'Slipknot', 'The Virus of Life'),
(13, '2022-09-29 16:26:00', 1, 'Cartoon feat. Daniel Levi', 'On & On'),
(14, '2022-09-29 16:26:00', 3, 'Breaking Benjamin', 'Rain (2005)'),
(15, '2022-09-29 16:26:00', 2, 'Breaking Benjamin, Red', 'Failure'),
(16, '2022-09-29 16:27:00', 5, 'Lana Del Ray', 'Summertime Sadness'),
(17, '2022-09-29 16:28:00', 6, 'Three Days Grace', 'Landmine'),
(18, '2022-09-29 16:28:00', 4, 'Nickelback', 'Lullaby'),
(19, '2022-09-29 16:30:00', 1, 'Deepside Deejays', 'Never Be Alone'),
(20, '2022-09-29 16:30:00', 3, 'Mujuice', 'Каждый день'),
(21, '2022-09-29 16:31:00', 2, 'Saint Asonia', 'Ghost'),
(22, '2022-09-29 16:32:00', 5, 'Hollywood Undead', 'Outside'),
(23, '2022-09-29 16:37:00', 5, 'Three Days Grace', 'Lifetime'),
(24, '2022-09-29 16:37:00', 4, 'Slipknot', 'Danger - Keep Away'),
(25, '2022-09-29 16:37:00', 1, 'Flo Rida', 'Whistle'),
(26, '2022-09-29 16:38:00', 6, 'Hollywood Undead', 'Already Dead'),
(27, '2022-09-29 16:38:00', 2, 'Breaking Benjamin', 'Tourniquet'),
(28, '2022-09-29 16:40:00', 5, 'Breaking Benjamin, Red', 'Failure'),
(29, '2022-09-29 16:40:00', 3, 'Макс Корж', 'Вспоминай меня'),
(30, '2022-09-29 16:41:00', 4, 'Hollywood Undead', 'Nightmare'),
(31, '2022-09-29 16:41:00', 1, 'Hollywood Undead', 'Coming Home'),
(32, '2022-09-29 16:41:00', 6, 'Breaking Benjamin', 'Blood'),
(33, '2022-09-29 16:42:00', 2, 'Hollywood Undead', 'Day Of The Dead'),
(34, '2022-09-29 16:44:00', 5, 'Nickelback', 'Lullaby'),
(35, '2022-09-29 16:44:00', 1, 'Hollywood Undead', 'Been To Hell'),
(36, '2022-09-29 16:44:00', 3, 'Nickelback', 'Gotta Be Somebody'),
(37, '2022-09-29 16:45:00', 4, 'Deuce', 'Gravestone'),
(38, '2022-09-29 16:46:00', 2, 'Three Days Grace', 'Running Away'),
(39, '2022-09-29 16:50:00', 4, 'I Prevail', 'Breaking Down'),
(40, '2022-09-29 16:50:00', 1, 'Deuce', 'The One (2012)'),
(41, '2022-09-29 16:50:00', 3, 'Hollywood Undead', 'Dead Bite'),
(42, '2022-09-29 16:51:00', 6, 'Hollywood Undead', 'Second Chances'),
(43, '2022-09-29 16:51:00', 5, 'Lana Del Ray', 'Summertime Sadness'),
(44, '2022-09-29 16:51:00', 2, 'Saint Asonia', 'Ghost'),
(45, '2022-09-29 16:53:00', 3, 'ЛСП', 'Ползать'),
(46, '2022-09-29 16:53:00', 1, 'Макс Корж', 'Жить в кайф'),
(47, '2022-09-29 16:53:00', 4, 'Slipknot', 'Danger - Keep Away'),
(48, '2022-09-29 16:55:00', 6, 'Breaking Benjamin', 'Tourniquet'),
(49, '2022-09-29 16:55:00', 5, 'Linkin Park', 'My December'),
(50, '2022-09-29 16:55:00', 2, 'Bad Wolves', 'Zombie'),
(51, '2022-09-29 16:56:00', 1, 'ЛСП', 'Хиппи'),
(52, '2022-09-29 16:56:00', 3, 'Mujuice', 'Каждый день'),
(53, '2022-09-29 16:58:00', 4, 'Hollywood Undead', 'Outside'),
(54, '2022-09-29 16:58:00', 5, 'Three Days Grace', 'Lifetime'),
(55, '2022-09-29 16:59:00', 2, 'I Prevail', 'Breaking Down'),
(56, '2022-09-29 17:00:00', 1, 'O-Zone', 'Dragostea Din Tei'),
(57, '2022-09-29 17:00:00', 6, 'Slipknot', 'The Virus of Life'),
(58, '2022-09-29 17:01:00', 3, 'Three Days Grace', 'Human Race'),
(59, '2022-09-29 17:02:00', 5, 'Oxxxymiron', 'Полигон'),
(60, '2022-09-29 17:03:00', 2, 'Hollywood Undead', 'Day Of The Dead'),
(61, '2022-09-29 17:03:00', 3, 'Smokey Bennett & The Hoops', 'The Flames of Love'),
(62, '2022-09-29 17:03:00', 4, 'Eminem feat. Obie Trice, Stat Quo, 50 Cent', 'Spend Some Time'),
(63, '2022-09-29 17:04:00', 1, 'Nickelback', 'Gotta Be Somebody'),
(64, '2022-09-29 17:05:00', 5, 'Slipknot', 'Danger - Keep Away'),
(65, '2022-09-29 17:06:00', 2, 'Three Days Grace', 'Tell Me Why'),
(66, '2022-09-29 21:05:00', 5, 'Slipknot', 'Danger - Keep Away'),
(67, '2022-09-29 21:05:00', 4, 'Hollywood Undead', 'Nightmare'),
(68, '2022-09-29 21:06:00', 2, 'Hollywood Undead', 'Second Chances'),
(69, '2022-09-29 21:06:00', 6, 'Hollywood Undead', 'Second Chances'),
(70, '2022-09-29 21:07:00', 3, 'Breaking Benjamin', 'Ashes of Eden'),
(71, '2022-09-29 21:25:00', 5, 'Three Days Grace', 'Lifetime'),
(72, '2022-09-29 21:25:00', 1, 'Bring Me the Horizon', 'Throne'),
(73, '2022-09-29 21:25:00', 6, 'Breaking Benjamin', 'Believe'),
(74, '2022-09-29 21:25:00', 3, 'Mujuice', 'Каждый день'),
(75, '2022-09-29 21:26:00', 2, 'Three Days Grace', 'Running Away'),
(76, '2022-09-29 21:26:00', 4, 'Hollywood Undead', 'Outside'),
(77, '2022-09-29 21:35:00', 3, 'Linkin Park', 'Sharp Edges');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `login` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `privilege` tinyint UNSIGNED NOT NULL,
  `registration` date DEFAULT NULL,
  `last_online` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `email`, `privilege`, `registration`, `last_online`) VALUES
(1, 'admin', '$2b$05$FStfA/rM8WUVrR5br7tiw.4L7rEko9WqOijAk3BNMpVPN67niHs3S', 'someEmail', 4, '2022-11-14', '2023-01-20 17:29:36'),
(2, 'Продуктовый', '$2b$05$FKVY7YawXBXOadwW2zgd1OuOJius.kltwK18sIg4kdtC4YBOLQafC', '123', 1, '2023-01-20', '2023-01-20 17:03:39'),
(3, 'moba', '$2b$05$rJro6r1LuClrHeqYFDCayequuNtV6D43B2ilQh39pihV9VNmaFHNy', 'test@test', 3, '2023-01-20', '2023-01-20 19:29:28'),
(4, 'newUser', '$2b$05$WYMOq/M89gkDJ.9FUbwM7uWN8vRudMF9omsxjRmicpgCjbwvdDsgy', 'test@test2', 2, '2023-01-20', '2023-01-20 19:29:56');

-- --------------------------------------------------------

--
-- Table structure for table `users_banned`
--

CREATE TABLE `users_banned` (
  `ban_id` int NOT NULL,
  `login` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `cause` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `deadline` datetime NOT NULL,
  `banned_by` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users_banned`
--

INSERT INTO `users_banned` (`ban_id`, `login`, `cause`, `deadline`, `banned_by`) VALUES
(1, 'Продуктовый', '123', '2022-10-01 11:59:38', 'admin'),
(2, 'Продуктовый', '123', '2022-10-01 12:06:47', 'admin'),
(3, 'newUser', 'Test', '2022-10-01 12:25:27', 'admin'),
(4, 'Продуктовый', 'Test2', '2022-10-01 13:20:07', 'moba'),
(5, 'Продуктовый', 'Test3', '2022-10-01 13:30:37', 'moba'),
(6, 'Продуктовый', 'Banword', '2022-10-01 21:31:35', 'admin'),
(7, 'newUser', 'Test3', '2022-10-01 21:55:17', 'moba'),
(12, 'Продуктовый', 'Test2', '2022-11-03 22:25:50', 'admin'),
(19, 'Продуктовый', 'Test', '2023-01-20 17:21:57', 'admin'),
(20, 'Продуктовый', 'Test', '2023-01-20 17:26:32', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `users_online`
--

CREATE TABLE `users_online` (
  `login` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `online_from` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`song_id`);

--
-- Indexes for table `songs_history`
--
ALTER TABLE `songs_history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_banned`
--
ALTER TABLE `users_banned`
  ADD PRIMARY KEY (`ban_id`);

--
-- Indexes for table `users_online`
--
ALTER TABLE `users_online`
  ADD UNIQUE KEY `nickname` (`login`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `message_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `song_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `songs_history`
--
ALTER TABLE `songs_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users_banned`
--
ALTER TABLE `users_banned`
  MODIFY `ban_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 12 2014 г., 05:23
-- Версия сервера: 5.6.12-log
-- Версия PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `db_schedro`
--
CREATE DATABASE IF NOT EXISTS `db_schedro` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `db_schedro`;

-- --------------------------------------------------------

--
-- Структура таблицы `affiliates`
--

DROP TABLE IF EXISTS `affiliates`;
CREATE TABLE IF NOT EXISTS `affiliates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `city_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Все филиалы' AUTO_INCREMENT=19 ;

--
-- Очистить таблицу перед добавлением данных `affiliates`
--

TRUNCATE TABLE `affiliates`;
--
-- Дамп данных таблицы `affiliates`
--

INSERT IGNORE INTO `affiliates` (`id`, `title`, `description`, `address`, `city_id`) VALUES
(1, 'Харьковский филиал', 'Контактное лицо: Кухарев Роман Алексеевич, директор филиала', 'ул. Овощная, 15, с. Васищево, Харьковский р-н, Харьковская обл., 62495 Тел.: (057) 766-37-63, 766-37-64, 766-37-65', 1),
(2, 'Полтавский филиал', 'Контактное лицо: Васильев Юрий Владимирович, директор филиала', 'ул. Половка, 66-Б, г. Полтава, 36034 Тел.: (0532 ) 613-702, 613-703', 9),
(3, 'Киевский филиал', 'Контактное лицо: Нимак Илья Владимирович, директор филиала', 'ул. Семьи Хохловых, 11/2, г. Киев, 04119 Тел.: (044) 393-03-63', 3),
(4, 'Донецкий филиал', 'Контактное лицо: Туряница Андрей Олегович, директор филиала', 'ул. Адыгейская, 13, г. Донецк, 83112 Тел.: (0622) 63-86-30, (062) 385-51-01, 345-85-54', 2),
(5, 'Запорожский филиал', 'Контактное лицо: Дуплин Владимир Викторович, директор филиала', 'ул. Пищевая, 5, г. Запорожье, 69014 Тел.: (061) 289-47-85, 289-47-84', 8),
(6, 'Одесский филиал', 'Контактное лицо: Безбабный Евгений Сергеевич, директор филиала', 'л. Моторная, 8-в, г. Одесса, 65085 Тел.: (048) 716-06-73', 7),
(7, 'Днепропетровский филиал', 'Контактное лицо: Алексеенко Игорь Васильевич, директор филиала', 'ул. Героев Сталинграда, 122, г. Днепропетровск, 49033 Тел.: (056) 373-03-67 , (056) 373-03-70', 5),
(8, 'Львовский филиал', 'Контактное лицо: Гниздюх Юрий Михайлович, директор филиала', 'ул. Промышленная, 50/52, г. Львов, 79024 (тер. мясокомбината) Тел.: (032) 245-81-45, 245-81-46, 245-81-47', 4),
(9, 'Винницкий филиал', 'Контактное лицо: Закревский Сергей Васильевич, директор филиала', 'ул. Чехова, 35, г. Винница, 21034 Тел.: (0432) 63-08-45', 6),
(18, 'Херсонский филиал', NULL, NULL, 15);

-- --------------------------------------------------------

--
-- Структура таблицы `aff_remainders`
--

DROP TABLE IF EXISTS `aff_remainders`;
CREATE TABLE IF NOT EXISTS `aff_remainders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `aff_id` int(11) NOT NULL,
  `remainder` double DEFAULT '0',
  `datetime_modified` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `remainder` (`remainder`),
  KEY `product_factored_id` (`product_factored_id`),
  KEY `aff_id` (`aff_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `aff_remainders`
--

TRUNCATE TABLE `aff_remainders`;
--
-- Дамп данных таблицы `aff_remainders`
--

INSERT IGNORE INTO `aff_remainders` (`id`, `product_factored_id`, `aff_id`, `remainder`, `datetime_modified`) VALUES
(1, 1, 1, 0, 1404657386);

-- --------------------------------------------------------

--
-- Структура таблицы `aff_stores`
--

DROP TABLE IF EXISTS `aff_stores`;
CREATE TABLE IF NOT EXISTS `aff_stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `aff_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`aff_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Склады филиалов' AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `aff_stores`
--

TRUNCATE TABLE `aff_stores`;
--
-- Дамп данных таблицы `aff_stores`
--

INSERT IGNORE INTO `aff_stores` (`id`, `title`, `aff_id`) VALUES
(1, 'Склад 1', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `aff_stores_cells`
--

DROP TABLE IF EXISTS `aff_stores_cells`;
CREATE TABLE IF NOT EXISTS `aff_stores_cells` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `aff_store_id` int(11) NOT NULL,
  `product_group_id` int(11) NOT NULL,
  `area` double NOT NULL,
  `volume` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Все камеры всех складов всех филиалов' AUTO_INCREMENT=3 ;

--
-- Очистить таблицу перед добавлением данных `aff_stores_cells`
--

TRUNCATE TABLE `aff_stores_cells`;
--
-- Дамп данных таблицы `aff_stores_cells`
--

INSERT IGNORE INTO `aff_stores_cells` (`id`, `title`, `aff_store_id`, `product_group_id`, `area`, `volume`) VALUES
(1, 'Камера 1-1-1', 1, 10, 100, NULL),
(2, 'Камера 1-1-2', 1, 23, 50, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `aff_stores_cells_remainders`
--

DROP TABLE IF EXISTS `aff_stores_cells_remainders`;
CREATE TABLE IF NOT EXISTS `aff_stores_cells_remainders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `remainder` double DEFAULT '0',
  `aff_store_id` int(11) NOT NULL,
  `aff_cell_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `datetime_modified` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_factored_id` (`product_factored_id`,`remainder`,`aff_cell_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Информация о том в какой камере какого склада сколько товара' AUTO_INCREMENT=3 ;

--
-- Очистить таблицу перед добавлением данных `aff_stores_cells_remainders`
--

TRUNCATE TABLE `aff_stores_cells_remainders`;
--
-- Дамп данных таблицы `aff_stores_cells_remainders`
--

INSERT IGNORE INTO `aff_stores_cells_remainders` (`id`, `product_factored_id`, `remainder`, `aff_store_id`, `aff_cell_id`, `user_id`, `datetime_modified`) VALUES
(1, 1, 4500, 1, 1, 1, 1404657290),
(2, 1, 13500, 1, 2, 1, 1404657386);

-- --------------------------------------------------------

--
-- Структура таблицы `carriers`
--

DROP TABLE IF EXISTS `carriers`;
CREATE TABLE IF NOT EXISTS `carriers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Перевозчики' AUTO_INCREMENT=6 ;

--
-- Очистить таблицу перед добавлением данных `carriers`
--

TRUNCATE TABLE `carriers`;
--
-- Дамп данных таблицы `carriers`
--

INSERT IGNORE INTO `carriers` (`id`, `title`, `description`) VALUES
(4, 'Гюнсел', 'Компания «Гюнсел» занимает ведущее место в сфере автотранспортных перевозок уже 15 лет. Деятельность компании стала настоящим прорывом на отечественном рынке автотранспортных услуг. Профессионализм, качество, оперативность, ответственность и высокий уровень комфорта и сервиса является основной концепцией работы компании &quot;Гюнсел&quot;. Вместе с внедрением передовых технологий бизнеса, меняется и имидж и корпоративно-коммуникативная стратегия компании. Сегодня «Гюнсел» представляет клиентам свое новое лицо новую торговую марку GNS ...'),
(5, 'Новая Почта', '“Нова Пошта” – оператор №1 на ринку експрес-доставки, який надає послуги швидкої, зручної та надійної доставки документів, посилок та вантажів в будь-яку точку України.      Сьогодні послугами Компанії користується кожен третій українець, отримуючи товари через Інтернет або ж надсилаючи посилки рідним та близьким.      “Нова Пошта” пропонує комплексні рішення, а також має спеціальні пропозиції для Інтернет-магазинів, які включають ряд додаткових послуг. ');

-- --------------------------------------------------------

--
-- Структура таблицы `carriers_drivers`
--

DROP TABLE IF EXISTS `carriers_drivers`;
CREATE TABLE IF NOT EXISTS `carriers_drivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `carrier_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fullname` (`fullname`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Водители перевозчиков' AUTO_INCREMENT=4 ;

--
-- Очистить таблицу перед добавлением данных `carriers_drivers`
--

TRUNCATE TABLE `carriers_drivers`;
--
-- Дамп данных таблицы `carriers_drivers`
--

INSERT IGNORE INTO `carriers_drivers` (`id`, `fullname`, `phone_number`, `carrier_id`) VALUES
(2, 'Иванов И. И.', '+380961234567', 4),
(3, 'Петров П. П.', '+380961239654', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `carriers_vehicles`
--

DROP TABLE IF EXISTS `carriers_vehicles`;
CREATE TABLE IF NOT EXISTS `carriers_vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `make` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `reg_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `carrier_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `make` (`make`,`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Автомобили перевозчиков' AUTO_INCREMENT=5 ;

--
-- Очистить таблицу перед добавлением данных `carriers_vehicles`
--

TRUNCATE TABLE `carriers_vehicles`;
--
-- Дамп данных таблицы `carriers_vehicles`
--

INSERT IGNORE INTO `carriers_vehicles` (`id`, `make`, `type`, `reg_number`, `carrier_id`) VALUES
(1, 'Ford', 'Transit', 'AX1234AX', 4),
(2, 'Volkswagen', 'Transporter', 'AA0123CC', 5),
(3, 'Fiat', 'Ducat', 'AA9856CO', 4),
(4, 'ГАЗ', '3302', 'AX9513CE', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `country_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `city_name` (`city_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Города' AUTO_INCREMENT=16 ;

--
-- Очистить таблицу перед добавлением данных `cities`
--

TRUNCATE TABLE `cities`;
--
-- Дамп данных таблицы `cities`
--

INSERT IGNORE INTO `cities` (`id`, `city_name`, `country_id`) VALUES
(1, 'Харьков', 1),
(2, 'Донецк', 1),
(3, 'Киев', 1),
(4, 'Львов', 1),
(5, 'Днепропетровск', 1),
(6, 'Винница', 1),
(7, 'Одесса', 1),
(8, 'Запорожье', 1),
(9, 'Полтава', 1),
(15, 'Херсон', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `city_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Клиенты' AUTO_INCREMENT=3 ;

--
-- Очистить таблицу перед добавлением данных `clients`
--

TRUNCATE TABLE `clients`;
--
-- Дамп данных таблицы `clients`
--

INSERT IGNORE INTO `clients` (`id`, `title`, `description`, `address`, `city_id`) VALUES
(1, 'Харьковская Бисквитная Фабрика', 'Корпорация "Бисквит-Шоколад" объединяет две фабрики - ПАО "Харьковская бисквитная фабрика" и ПАО "Кондитерская фабрика "Харьковчанка".Ассортимент мучных изделий: печенье (затяжное, сахарное, сдобное), крекер, галеты, вафли, вафельные трубочки, бисквиты, рулеты, торты (в том числе вафельные и шоколадно-вафельные).  Ассортимент сахаристых изделий: карамель, конфеты (глазированные и неглазированые), шоколад, зефир, ирис, мармелад.', '61017 Харьков, ул. Лозовская, 8', 1),
(2, 'ООО «Северская сласть-продукт»', 'фирма «Северская сласть-продукт» г. Харьков является производителем мучно-кондитерских изделий', 'ул. 23 Августа 12 А, Харьков, Украина', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Очистить таблицу перед добавлением данных `countries`
--

TRUNCATE TABLE `countries`;
--
-- Дамп данных таблицы `countries`
--

INSERT IGNORE INTO `countries` (`id`, `title`) VALUES
(2, 'Беларусь'),
(6, 'Российская Федерация'),
(1, 'Украина');

-- --------------------------------------------------------

--
-- Структура таблицы `dc_s`
--

DROP TABLE IF EXISTS `dc_s`;
CREATE TABLE IF NOT EXISTS `dc_s` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `city_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Все РЦ' AUTO_INCREMENT=3 ;

--
-- Очистить таблицу перед добавлением данных `dc_s`
--

TRUNCATE TABLE `dc_s`;
--
-- Дамп данных таблицы `dc_s`
--

INSERT IGNORE INTO `dc_s` (`id`, `title`, `description`, `address`, `city_id`) VALUES
(1, 'РЦ ХЖК', '376-21-28, 784-94-20, 784-93-93', '61019, Украина, г.Харьков  пр. Ильича, 120', 1),
(2, 'РЦ ЛЖК', NULL, NULL, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `dc_s_remainders`
--

DROP TABLE IF EXISTS `dc_s_remainders`;
CREATE TABLE IF NOT EXISTS `dc_s_remainders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `dc_id` int(11) NOT NULL,
  `remainder` double DEFAULT '0',
  `datetime_modified` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_factored_id` (`product_factored_id`,`dc_id`,`remainder`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `dc_s_remainders`
--

TRUNCATE TABLE `dc_s_remainders`;
--
-- Дамп данных таблицы `dc_s_remainders`
--

INSERT IGNORE INTO `dc_s_remainders` (`id`, `product_factored_id`, `dc_id`, `remainder`, `datetime_modified`) VALUES
(1, 1, 1, 0, 1404656885);

-- --------------------------------------------------------

--
-- Структура таблицы `dc_s_stores`
--

DROP TABLE IF EXISTS `dc_s_stores`;
CREATE TABLE IF NOT EXISTS `dc_s_stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dc_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Склады РЦ' AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `dc_s_stores`
--

TRUNCATE TABLE `dc_s_stores`;
--
-- Дамп данных таблицы `dc_s_stores`
--

INSERT IGNORE INTO `dc_s_stores` (`id`, `title`, `dc_id`) VALUES
(1, 'Склад 1', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `dc_s_stores_cells`
--

DROP TABLE IF EXISTS `dc_s_stores_cells`;
CREATE TABLE IF NOT EXISTS `dc_s_stores_cells` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dc_store_id` int(11) NOT NULL,
  `product_group_id` int(11) NOT NULL,
  `area` double NOT NULL,
  `volume` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`dc_store_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Все камеры всех складов всех РЦ' AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `dc_s_stores_cells`
--

TRUNCATE TABLE `dc_s_stores_cells`;
--
-- Дамп данных таблицы `dc_s_stores_cells`
--

INSERT IGNORE INTO `dc_s_stores_cells` (`id`, `title`, `dc_store_id`, `product_group_id`, `area`, `volume`) VALUES
(1, 'Камера 1-1', 1, 10, 100, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `dc_s_stores_cells_remainders`
--

DROP TABLE IF EXISTS `dc_s_stores_cells_remainders`;
CREATE TABLE IF NOT EXISTS `dc_s_stores_cells_remainders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `remainder` double DEFAULT '0',
  `dc_store_id` int(11) NOT NULL,
  `dc_cell_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `datetime_modified` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_factored_id` (`product_factored_id`,`remainder`,`dc_cell_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Информация о том в какой камере какого склада сколько товара' AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `dc_s_stores_cells_remainders`
--

TRUNCATE TABLE `dc_s_stores_cells_remainders`;
--
-- Дамп данных таблицы `dc_s_stores_cells_remainders`
--

INSERT IGNORE INTO `dc_s_stores_cells_remainders` (`id`, `product_factored_id`, `remainder`, `dc_store_id`, `dc_cell_id`, `user_id`, `datetime_modified`) VALUES
(1, 1, 72000, 1, 1, 1, 1404657120);

-- --------------------------------------------------------

--
-- Структура таблицы `factories`
--

DROP TABLE IF EXISTS `factories`;
CREATE TABLE IF NOT EXISTS `factories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `city_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Все комбинаты' AUTO_INCREMENT=4 ;

--
-- Очистить таблицу перед добавлением данных `factories`
--

TRUNCATE TABLE `factories`;
--
-- Дамп данных таблицы `factories`
--

INSERT IGNORE INTO `factories` (`id`, `title`, `description`, `address`, `city_id`) VALUES
(1, 'Харьковский жиркомбинат', 'Производство маргарина, линия рафинации масел, дезодорационные линии, освоено производство мягких наливных маргаринов.', '61019, Украина, г.Харьков  пр. Ильича, 120', 1),
(2, 'Запорожский масложиркомбинат', 'Предприятие с полным циклом переработки сырья, выпускающее маргариновую и жировую продукции в ассортименте, масло подсолнечное нерафинированного невымороженное, масло подсолнечное рафинированное дезодорированное, мыло хозяйственное в ассортименте, шрот подсолнечный, гранулированную лузгу, фосфатидный концентрат.', '69014, г. Запорожье, ул. Пищевая, 3.', 8),
(3, 'Львовский жирокомбинат', 'Підприємство має повний замкнутий цикл переробки рослинних олій та виробництва напівфабрикатів. Виробничий комплекс заводу складають сучасні системи зберігання та переробки. Основне обладнання цеху - це лінії англійського та німецького виробництва. На ЛЖК впроваджено систему менеджменту безпеки продуктів харчування у відповідності до міжнародного стандарту ISO 22000:2005, а також систему менеджменту якості у відповідності до міжнародного стандарту ISO 9001:2008.', '79015, м.Львів, вул.Городоцька,132', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `factories_remainders`
--

DROP TABLE IF EXISTS `factories_remainders`;
CREATE TABLE IF NOT EXISTS `factories_remainders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `factory_id` int(11) NOT NULL,
  `remainder` double DEFAULT '0',
  `datetime_modified` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_factored_id` (`product_factored_id`,`factory_id`,`remainder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Остатки на комбинатах' AUTO_INCREMENT=1 ;

--
-- Очистить таблицу перед добавлением данных `factories_remainders`
--

TRUNCATE TABLE `factories_remainders`;
-- --------------------------------------------------------

--
-- Структура таблицы `measures`
--

DROP TABLE IF EXISTS `measures`;
CREATE TABLE IF NOT EXISTS `measures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `short_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_weight` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'yes',
  `is_area` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `is_volume` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `is_modifiable` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'yes',
  `is_visible` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`short_title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Единицы измерения' AUTO_INCREMENT=19 ;

--
-- Очистить таблицу перед добавлением данных `measures`
--

TRUNCATE TABLE `measures`;
--
-- Дамп данных таблицы `measures`
--

INSERT IGNORE INTO `measures` (`id`, `title`, `short_title`, `is_weight`, `is_area`, `is_volume`, `is_modifiable`, `is_visible`) VALUES
(1, 'килограмм', 'кг', 'yes', 'no', 'no', 'no', 'yes'),
(2, 'тонна', 'т', 'yes', 'no', 'no', 'no', 'yes'),
(8, 'квадратный метр', 'м²', 'no', 'yes', 'no', 'no', 'no'),
(9, 'кубический метр', 'м³', 'no', 'no', 'yes', 'no', 'no'),
(10, 'грамм', 'г', 'yes', 'no', 'no', 'no', 'no'),
(16, 'поддон', 'под.', 'yes', 'no', 'no', 'no', 'yes'),
(17, 'ящик', 'ящ.', 'yes', 'no', 'no', 'yes', 'yes'),
(18, 'пачка', 'п.', 'yes', 'no', 'no', 'yes', 'yes');

-- --------------------------------------------------------

--
-- Структура таблицы `measures_rates`
--

DROP TABLE IF EXISTS `measures_rates`;
CREATE TABLE IF NOT EXISTS `measures_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `measure1_id` int(11) NOT NULL,
  `measure2_id` int(11) NOT NULL,
  `rate` float NOT NULL,
  `product_id` int(11) NOT NULL,
  `is_modifiable` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`id`),
  KEY `measure1_id` (`measure1_id`,`measure2_id`,`rate`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Пропорции (соотношения между единицами измерений)' AUTO_INCREMENT=49 ;

--
-- Очистить таблицу перед добавлением данных `measures_rates`
--

TRUNCATE TABLE `measures_rates`;
--
-- Дамп данных таблицы `measures_rates`
--

INSERT IGNORE INTO `measures_rates` (`id`, `measure1_id`, `measure2_id`, `rate`, `product_id`, `is_modifiable`) VALUES
(7, 1, 10, 1000, 0, 'no'),
(8, 2, 1, 1000, 0, 'no'),
(9, 16, 8, 1, 0, 'no'),
(22, 16, 1, 1000, 12, 'yes'),
(23, 16, 1, 1000, 13, 'yes'),
(24, 16, 1, 1000, 14, 'yes'),
(25, 16, 1, 1000, 17, 'yes'),
(26, 16, 1, 1000, 18, 'yes'),
(27, 16, 1, 900, 15, 'yes'),
(28, 16, 1, 900, 16, 'yes'),
(29, 16, 1, 500, 20, 'yes'),
(31, 16, 1, 1000, 19, 'yes'),
(32, 16, 1, 500, 22, 'yes'),
(34, 16, 1, 500, 23, 'yes'),
(35, 16, 1, 500, 24, 'yes'),
(36, 16, 2, 0.5, 22, 'yes'),
(37, 16, 2, 0.5, 23, 'yes'),
(38, 16, 2, 0.5, 24, 'yes'),
(39, 16, 2, 0.9, 26, 'yes'),
(40, 16, 1, 900, 26, 'yes'),
(41, 16, 1, 500, 25, 'yes'),
(42, 16, 2, 0.5, 25, 'yes'),
(43, 16, 1, 900, 27, 'yes'),
(44, 16, 2, 0.9, 27, 'yes'),
(45, 17, 1, 20, 26, 'yes'),
(46, 17, 2, 0.02, 26, 'yes'),
(47, 17, 1, 20, 27, 'yes'),
(48, 17, 2, 0.02, 27, 'yes');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Вся продукция' AUTO_INCREMENT=142 ;

--
-- Очистить таблицу перед добавлением данных `products`
--

TRUNCATE TABLE `products`;
--
-- Дамп данных таблицы `products`
--

INSERT IGNORE INTO `products` (`id`, `title`, `group_id`) VALUES
(6, 'Щедро Провансаль 67%', 5),
(7, 'Щедро Шашлычный', 6),
(8, 'Пампушок', 7),
(9, 'Солнечный', 7),
(10, 'Столичный', 7),
(11, 'Олли', 8),
(12, 'Провансаль 67%', 9),
(13, 'Салатный', 9),
(14, 'Золотой 50%', 9),
(15, 'Солнечный', 11),
(16, 'Столичный', 11),
(17, 'Шашлычный', 10),
(18, 'Барбекю', 10),
(19, 'Сацебели', 10),
(20, 'Олли', 12),
(22, 'Марг.  мяг. Щедро &quot;Укр. См. Бут.&quot; 50% 0,4 ЗМЖК', 12),
(23, 'Марг. мягк. Щедро &quot;Домашний&quot; 50% 0,4 ЗМЖК', 12),
(24, 'Марг. мягк. Щедро &quot;Укр. См. Бут.&quot; 80% ЗМЖК', 12),
(25, 'Марг. Запорожский &quot;Слойка для дом. вып.&quot; 80% 0,5 ЗМЖК', 16),
(26, 'Маргарин &quot;Молочный особый&quot; монолит ХЖК', 21),
(27, 'Маргарин &quot;Молочный особый&quot; монолит ЗМЖК', 19),
(28, 'Жир &quot;Для начинок-1&quot; монолит ЗМЖК', 19),
(29, 'Жир раст. &quot;Шортенинг кондитерский&quot; монолит ЗМЖК', 19),
(30, 'Масло пальмовое РДВ монолит ЗМЖК', 19),
(31, 'Марг. &quot;Слойка для клас. лист. вир&quot; 5 монолит ЗМЖК', 19),
(32, 'Майонез Щедро &quot;Провансаль Преміум&quot; 72% д/п 0,7 ЛЖК', 22),
(33, 'Майонез Щедро &quot;Провансаль&quot; 67% д/п 0,7 ЛЖК', 22),
(34, 'Майонез Оллі &quot;Провансаль&quot; 67% д/п 0,7 ЛЖК', 22),
(35, 'Майонез Оллі &quot;Провансаль легкий&quot; 30% д/п 0,7 ЛЖК', 22),
(36, 'Майонез Щедро &quot;Провансаль ORGANIC&quot; 67% Д/П 0,4 ЛЖК', 22),
(37, 'Майонез Щедро &quot;Постный&quot; 50% д/п 0,4 ХЖК', 23),
(38, 'Марг. Щедро &quot;Пампушок для п/випічки&quot; 72% 0,25 ЛЖК', 17),
(39, 'Майонез Щедро &quot;Провансаль&quot; с/б 0,46 ЛЖК', 22),
(40, 'Майонез Щедро &quot;Салатний&quot; 30% с/б 0,46 ЛЖК', 22),
(41, 'Майонез Щедро &quot;Провансаль&quot; 67% вІдро 0,9 ЛЖК', 22),
(42, 'Майонез Щедро &quot;Салатний&quot; 30% відро 0,9 ЛЖК', 22),
(43, 'Майонез Щедро &quot;Провансаль&quot; 67% відро 4,5 ЛЖК', 22),
(44, 'Майонез Щедро &quot;Салатний&quot; 30% відро 4,5 ЛЖК', 22),
(45, 'Майонез Щедро &quot;Провансаль Преміум&quot; 72% д/п 0,5 (акция +25%) ЛЖК', 22),
(46, 'Майонез &quot;Провансаль&quot; 67% д/п 0,5 (акция +25%) ЛЖК', 22),
(47, 'Майонез Щедро &quot;Провансаль Золотий&quot; 50% д/п 0,5 (акция +25%) ЛЖК', 22),
(48, 'Майонез Щедро &quot;Салатний&quot; 30% (акция +25%) ЛЖК', 22),
(49, 'Спред Щедро &quot;Селянський&quot; 72,5% 0,18 ЛЖК', 24),
(50, 'Спред Щедро &quot;Домашній&quot; 72,5% 0,18 ЛЖК', 24),
(51, 'Марг. Щедро &quot;Сонячний особий&quot; 72% 0,25 ХЖК', 18),
(52, 'Марг. Щедро &quot;Столичний особливий&quot; 60% 0,25 ХЖК', 18),
(53, 'Марг. Щедро &quot;Вершковий особливий&quot; 72% 0,25 ХЖК', 18),
(54, 'Марг. Щедро &quot;Пампушок для п/випічки&quot; 72% 0,25 ХЖК', 18),
(55, 'Марг. Щедро &quot;Домашній&quot; 40% 0,25 ХЖК', 18),
(56, 'Марг. Щедро &quot;Вершковий любительський&quot; 60% 0,18 ХЖК', 18),
(57, 'Марг. ХЖК &quot;Столичний любительский&quot; 50% 0,18 ХЖК', 18),
(58, 'Марг. ХЖК &quot;Домашній&quot; 40% 0,18 ХЖК', 18),
(59, 'Марг. Запорізький &quot;Молочний особий&quot; 70% 0,5 ХЖК', 18),
(60, 'Марг. Запорізький &quot;Молочний особий&quot; 70% 0,25 ХЖК ', 18),
(61, 'Марг. Запорізький &quot;Столичний особий&quot; 60% 0,25 ХЖК', 18),
(62, 'Марг. Запорізький &quot;Вершковий особий&quot; 72,5% 0,5 ХЖК', 18),
(63, 'Марг. Добрий Кухар &quot;Вершковий особий&quot; 72,5% 0,5 ХЖК', 18),
(64, 'Марг. Добрий Кухар &quot;Вершковий любительський&quot; 50% 0,5 ХЖК', 18),
(65, 'Жир Запорізький &quot;Кулінар&quot; 99,7% 0,5 ХЖК', 18),
(66, 'Жир &quot;Шортенинг Кондитерский&quot; монолит ХЖК', 21),
(67, 'Марг. &quot;Сонячний особий&quot; моноліт ХЖК', 21),
(68, 'Жир &quot;Фрітюрний&quot; моноліт ХЖК', 21),
(69, 'Жир &quot;Кондитерський&quot; моноліт ХЖК', 21),
(70, 'Майонез Щедро &quot;Провансаль Преміум&quot; 72% ф/п 0,38 ХЖК', 23),
(71, 'Майонез Оллі &quot;Провансаль&quot; 67% ф/п 0,19 ХЖК', 23),
(72, 'Майонез Оллі &quot;Провансаль легкий&quot; 30% ф/п 0,19 ХЖК', 23),
(73, 'Майонез Щедро &quot;Провансаль&quot; 67% ф/п 0,19 ХЖК', 23),
(74, 'Майонез Щедро &quot;Провансаль&quot; 67% ф/п 0,38 ХЖК', 23),
(75, 'Майонез Оллі &quot;Провансаль легкий&quot; 30% ф/п ХЖК', 23),
(76, 'Майонез Щедро &quot;Салатний&quot; 30% ф/п 0,19 ХЖК', 23),
(77, 'Майонез Щедро &quot;Салатний&quot; 30% ф/п 0,38 ХЖК', 23),
(78, 'Майонез Щедро &quot;Оливковий&quot; 50% д/п 0,19 ХЖК', 23),
(79, 'Майонез Щедро &quot;Сирний&quot; 50% д/п 0,4 ХЖК', 23),
(80, 'Майонез Щедро &quot;З хріном&quot; 50% д/п 0,4 ХЖК', 23),
(81, 'Майонез Щедро &quot;Пісний&quot; 50% д/п 0,4 ХЖК', 23),
(82, 'Майонез Щедро &quot;Львівський Преміум&quot; 80% д/п 0,19 ХЖК', 23),
(83, 'Майонез Щедро &quot;Львівський Преміум&quot; 80% д/п 0,4 ХЖК', 23),
(84, 'Майонез Щедро &quot;Провансаль Преміум&quot; 72% д/п 0,19 ХЖК', 23),
(85, 'Майонез Щедро &quot;Провансаль Преміум&quot; 72% д/п 0,4 ХЖК', 23),
(86, 'Майонез Щедро &quot;Провансаль&quot; 67% стік 12 г ХЖК', 23),
(87, 'Майонез Щедро &quot;Провансаль&quot; 67% д/п 0,19 ХЖК', 23),
(88, 'Майонез Щедро &quot;Провансаль&quot; 67% д/п 0,4 ХЖК', 23),
(89, 'Майонез Оллі &quot;Провансаль&quot; 67% д/п 0,4 ХЖК', 23),
(90, 'Майонез Оллі &quot;Провансаль легкий&quot; 30% д/п 0,4 ХЖК', 23),
(91, 'Майонез Щедро &quot;Салатний&quot; 30% д/п 0,19 ХЖК', 23),
(92, 'Майонез Щедро &quot;Салатний&quot; 30% д/п 0,4 ХЖК', 23),
(93, 'Майонез Щедро &quot;Провансаль Золотий&quot; 50% д/п 0,19 ХЖК', 23),
(94, 'Майонез Щедро &quot;Провонсаль Золотий&quot; 50% д/п 0,4 ХЖК', 23),
(95, 'Майонез Щедро &quot;Пісний&quot; 50% пакет 5 кг ХЖК', 23),
(96, 'Майонез Щедро &quot;Провансаль&quot; 67 % пакет 5 кг ХЖК', 23),
(97, 'Майонез Щедро &quot;Провансаль&quot; 67% пакет 20 кг ХЖК', 23),
(98, 'Майонез Щедро &quot;Салатний&quot; 30% пакет 20 кг ХЖК', 23),
(99, 'Кетчуп Щедро &quot;Лагідний&quot; д/п 0,3 ХЖК', 10),
(100, 'Кетчуп Щедро &quot;Лагідний&quot; д/п 0,45 ХЖК', 10),
(101, 'Кетчуп &quot;Лагідний&quot; пакет 20 кг ХЖК', 10),
(102, 'Кетчуп Щедро &quot;Шашличний&quot; д/п 0,3 ХЖК', 10),
(103, 'Кетчуп Щедро &quot;Шашличний&quot; д/п 0,45 ХЖК', 10),
(104, 'Кетчуп Щедро &quot;Томатний&quot; д/п 0,3 ХЖК', 10),
(105, 'Кетчуп &quot;Томатний&quot; пакет 5 кг ХЖК', 10),
(106, 'Кетчуп &quot;Томатний&quot; пакет 10 кг ХЖК', 10),
(107, 'Кетчуп &quot;Томатний&quot; пакет 20 кг ХЖК', 10),
(108, 'Кетчуп Щедро &quot;Супертоматний&quot; д/п 0,3 ХЖК', 10),
(109, 'Кетчуп Щедро &quot;Супертоматний&quot; д/п 0,45 ХЖК', 10),
(110, 'Кетчуп Щедро &quot;Чилі&quot; д/п 0,3 ХЖК', 10),
(111, 'Кетчуп Щедро &quot;Чилі&quot; д/п 0,45 ХЖК', 10),
(112, 'Кетчуп Щедро &quot;Барбекю&quot; д/п 0,3 ХЖК', 10),
(113, 'Соус Щедро &quot;Тартар&quot; д/п 0,2 ХЖК', 13),
(114, 'Соус Щедро &quot;Домашній з часником&quot; 30% д/п  ХЖК', 13),
(115, 'Соус Щедро &quot;Грибний&quot; д/п 0,2 ХЖК', 13),
(116, 'Соус Щедро &quot;Сацебелі&quot; д/п 0,2 ХЖК', 14),
(117, 'Соус Щедро &quot;Мексиканський&quot; д/п 0,2 ХЖК', 14),
(118, 'Соус Щедро &quot;Італійський&quot; д/п 0,2 ХЖК', 14),
(119, 'Соус Щедро &quot;Краснодарський&quot; д/п 0,3 ХЖК', 14),
(120, 'Соус &quot;Краснодарський&quot; пакет 5 кг ХЖК', 14),
(121, 'Соус &quot;Краснодарський&quot; пакет 20 кг ХЖК', 14),
(122, 'Соус Щедро &quot;Сальса вогняна&quot; д/п 0,2 ХЖК', 14),
(123, 'Соус Щедро &quot;Аджика домашня&quot; д/п 0,2 ХЖК', 14),
(124, 'Соус Щедро &quot;Барбекю&quot; д/п 0,2 ХЖК', 14),
(125, 'Соус Щедро &quot;Табаско&quot; д/п 0,3 ХЖК', 14),
(126, 'Гірчиця Щедро &quot;Гостра домашня&quot; д/п 0,12 ХЖК', 26),
(127, 'Гірчиця Щедро &quot;Гостра домашня&quot; д/п 0,5 ХЖК', 26),
(128, 'Гірчиця Щедро &quot;Французька&quot; д/п 0,12 ХЖК', 26),
(129, 'Гірчиця Добрий Кухар &quot;Російська&quot; д/п 0,12 ХЖК', 26),
(130, 'Маргарин &quot;Особый&quot; монолит ХЖК', 21),
(131, 'Маргарин &quot;Столичный монолит&quot; монолит ХЖК', 21),
(132, 'Маргарин Щедро &quot;Вершковый люкс&quot; 0,375 ЗМЖК', 16),
(133, 'Марг. Запорізький &quot; Столичний особий&quot; 60% 0,5 ХЖК', 18),
(134, 'Марг. Запорізький &quot;Вершковий особий&quot; 72,5% 0,25 ХЖК', 18),
(135, 'Марг. Добрий Кухар &quot;Вершковий особий&quot; 72,5% 0,25 ХЖК', 18),
(136, 'Жир Запорізький &quot;Кулінар&quot; 99,7% 0,25 ХЖК', 18),
(137, 'Гірчиця Щедро &quot;Украинская с хреном&quot; д/п 0,12 ХЖК', 26),
(138, 'Майонез Щедро &quot;Грибной&quot; 50% д/п 0,19 ХЖК', 23),
(139, 'Майонез Оллі &quot;Провансаль&quot; 67% ф/п 0,38 ХЖК', 23),
(140, 'Майонез Щедро &quot;Салатний&quot; 30% пакет 10 кг ХЖК', 23),
(141, 'Майонез &quot;Провансаль&quot; 67% пакет 10 кг ХЖК', 23);

-- --------------------------------------------------------

--
-- Структура таблицы `products_factored`
--

DROP TABLE IF EXISTS `products_factored`;
CREATE TABLE IF NOT EXISTS `products_factored` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `products_part` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `factored_date` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `measure_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `factory_id` int(11) DEFAULT NULL,
  `dc_id` int(11) DEFAULT NULL,
  `datetime` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_part` (`products_part`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Партии продукции, произведенной на комбинатах' AUTO_INCREMENT=2 ;

--
-- Очистить таблицу перед добавлением данных `products_factored`
--

TRUNCATE TABLE `products_factored`;
--
-- Дамп данных таблицы `products_factored`
--

INSERT IGNORE INTO `products_factored` (`id`, `products_part`, `factored_date`, `product_id`, `measure_id`, `quantity`, `factory_id`, `dc_id`, `datetime`, `user_id`) VALUES
(1, '1', 1404604800, 26, 16, 100, NULL, 1, 1404656847, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `products_movement`
--

DROP TABLE IF EXISTS `products_movement`;
CREATE TABLE IF NOT EXISTS `products_movement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_factored_id` bigint(20) NOT NULL,
  `quantity` double NOT NULL,
  `measure_id` int(11) NOT NULL,
  `from_id` int(11) DEFAULT NULL,
  `from_cell_id` int(11) DEFAULT NULL,
  `to_id` int(11) NOT NULL,
  `direction` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `carrier_id` int(11) DEFAULT NULL,
  `carrier_driver_id` int(11) DEFAULT NULL,
  `carrier_vehicle_id` int(11) DEFAULT NULL,
  `datetime` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('in_progress','shipped','arrived') COLLATE utf8_unicode_ci DEFAULT 'in_progress',
  PRIMARY KEY (`id`),
  KEY `direction` (`direction`),
  KEY `product_factored_id` (`product_factored_id`,`quantity`,`from_id`,`to_id`,`direction`),
  KEY `status` (`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Движение продукции между комбинат/рц/филиал/клиент' AUTO_INCREMENT=3 ;

--
-- Очистить таблицу перед добавлением данных `products_movement`
--

TRUNCATE TABLE `products_movement`;
--
-- Дамп данных таблицы `products_movement`
--

INSERT IGNORE INTO `products_movement` (`id`, `product_factored_id`, `quantity`, `measure_id`, `from_id`, `from_cell_id`, `to_id`, `direction`, `carrier_id`, `carrier_driver_id`, `carrier_vehicle_id`, `datetime`, `user_id`, `status`) VALUES
(1, 1, 100, 16, NULL, NULL, 1, 'fd', NULL, NULL, NULL, 1404656847, 1, 'arrived'),
(2, 1, 20, 16, 1, 1, 1, 'da', NULL, NULL, NULL, 1404657040, 1, 'arrived');

-- --------------------------------------------------------

--
-- Структура таблицы `products_movement_directions`
--

DROP TABLE IF EXISTS `products_movement_directions`;
CREATE TABLE IF NOT EXISTS `products_movement_directions` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direction_key` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('отгрузка','возврат') COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `direction_key` (`direction_key`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Возможные направления движения продукции' AUTO_INCREMENT=16 ;

--
-- Очистить таблицу перед добавлением данных `products_movement_directions`
--

TRUNCATE TABLE `products_movement_directions`;
--
-- Дамп данных таблицы `products_movement_directions`
--

INSERT IGNORE INTO `products_movement_directions` (`id`, `title`, `direction_key`, `type`) VALUES
(1, 'Комбинат -> Комбинат', 'ff', 'отгрузка'),
(2, 'Комбинат -> РЦ', 'fd', 'отгрузка'),
(3, 'Комбинат -> Филиал', 'fa', 'отгрузка'),
(4, 'Комбинат -> Клиент', 'fc', 'отгрузка'),
(5, 'РЦ -> Комбинат', 'df', 'возврат'),
(6, 'РЦ -> РЦ', 'dd', 'отгрузка'),
(7, 'РЦ -> Филиал', 'da', 'отгрузка'),
(8, 'РЦ -> Клиент', 'dc', 'отгрузка'),
(9, 'Филиал -> Комбинат', 'af', 'возврат'),
(10, 'Филиал -> РЦ', 'ad', 'отгрузка'),
(11, 'Филиал -> Филиал', 'aa', 'отгрузка'),
(12, 'Филиал -> Клиент', 'ac', 'отгрузка'),
(13, 'Клиент -> Комбинат', 'cf', 'возврат'),
(14, 'Клиент -> РЦ', 'cd', 'возврат'),
(15, 'Клиент -> Филиал', 'ca', 'возврат');

-- --------------------------------------------------------

--
-- Структура таблицы `product_groups`
--

DROP TABLE IF EXISTS `product_groups`;
CREATE TABLE IF NOT EXISTS `product_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Товарные группы' AUTO_INCREMENT=27 ;

--
-- Очистить таблицу перед добавлением данных `product_groups`
--

TRUNCATE TABLE `product_groups`;
--
-- Дамп данных таблицы `product_groups`
--

INSERT IGNORE INTO `product_groups` (`id`, `title`) VALUES
(26, 'Горчицы ХЖК'),
(10, 'Кетчупы ХЖК'),
(9, 'Майонезы'),
(22, 'Майонезы ЛЖК'),
(23, 'Майонезы ХЖК'),
(11, 'Маргарины'),
(19, 'Монолиты ЗМЖК'),
(20, 'Монолиты ЛЖК'),
(21, 'Монолиты ХЖК'),
(15, 'Наливні маргарини'),
(12, 'Наливные маргарины ЗМЖК'),
(13, 'Соусы белые ХЖК'),
(14, 'Соусы красные ХЖК'),
(24, 'Спреды ЛЖК'),
(25, 'Спреды ХЖК'),
(16, 'Фасованные маргарины ЗМЖК'),
(17, 'Фасованные маргарины ЛЖК'),
(18, 'Фасованные маргарины ХЖК');

-- --------------------------------------------------------

--
-- Структура таблицы `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `sys_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sys_value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_modifiable` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`sys_key`,`sys_value`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Пользовательские настройки приложения' AUTO_INCREMENT=4 ;

--
-- Очистить таблицу перед добавлением данных `settings`
--

TRUNCATE TABLE `settings`;
--
-- Дамп данных таблицы `settings`
--

INSERT IGNORE INTO `settings` (`id`, `title`, `description`, `sys_key`, `sys_value`, `is_modifiable`) VALUES
(1, 'Ограничитель остатка (кг)', 'Остатки меньше данного значения не учитываются при расчете<br/>остаточной свободной площади складских камер.', 'min_reminder', '100', 'yes'),
(2, 'Точность', 'Отображаемое количество знаков после запятой при округлении.', 'decimal_digits_num', '2', 'yes'),
(3, 'Формат даты', '<table cellspacing="0" cellpadding="0" border="0">\r\n	Разделители могут быть любыми.<br/>Формат времени можно настроить, используя коды из таблицы ниже.\r\n	<tr>\r\n		<td style="text-align: center;"><b>Код</b></td>\r\n		<td style="text-align: center;"><b>Описание</b></td>\r\n		<td style="text-align: center;"><b>Пример</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>День</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%a</em></td>\r\n		<td>Сокращенное название дня недели</td>\r\n		<td>От <em>Sun</em> до <em>Sat</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%A</em></td>\r\n		<td>Полное название дня недели</td>\r\n		<td>От <em>Sunday</em> до <em>Saturday</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%d</em></td>\r\n		<td>Двухзначное представление дня месяца (с ведущими нулями)</td>\r\n		<td>От <em>01</em> до <em>31</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%w</em></td>\r\n		<td>Порядковый номер дня недели</td>\r\n		<td>От <em>0</em> (воскресенье) до <em>6</em> (суббота)</td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>Неделя</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%U</em></td>\r\n		<td>Порядковый номер недели в указанном году, начиная с первого\r\n		воскресенья в качестве первой недели</td>\r\n		<td><em>13</em> (для полной 13-й недели года)</td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%W</em></td>\r\n		<td>Порядковый номер недели в указанном году, начиная с\r\n		первого понедельника в качестве первой недели</td>\r\n		<td><em>46</em> (для 46-й недели года,\r\n		начинающейся с понедельника)</td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>Месяц</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%b</em></td>\r\n		<td>Аббревиатура названия месяца, в соответствии с настройками локали</td>\r\n		<td>От <em>Jan</em> до <em>Dec</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%B</em></td>\r\n		<td>Полное название месяца, в соответствии с настройками локали</td>\r\n		<td>От <em>January</em> до <em>December</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%m</em></td>\r\n		<td>Двухзначный порядковый номер месяца</td>\r\n		<td>От <em>01</em> (январь) до <em>12</em> (декабрь)</td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>Год</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%y</em></td>\r\n		<td>Двухзначный порядковый номер года</td>\r\n		<td>Пример: <em>09</em> для 2009, <em>79</em> для 1979</td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%Y</em></td>\r\n		<td>Четырехзначный номер года</td>\r\n		<td>Пример: <em>2038</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>Время</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%H</em></td>\r\n		<td>Двухзначный номер часа в 24-часовом формате</td>\r\n		<td>От <em>00</em> до <em>23</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%M</em></td>\r\n		<td>Двухзначный номер минуты</td>\r\n		<td>От <em>00</em> до <em>59</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%S</em></td>\r\n		<td>Двухзначный номер секунды</td>\r\n		<td>От <em>00</em> до <em>59</em></td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" style="text-align: center;"><b>Различное</b></td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%n</em></td>\r\n		<td>Символ перевода строки ("\\n")</td>\r\n		<td>---</td>\r\n	</tr>\r\n	<tr>\r\n		<td><em>%t</em></td>\r\n		<td>Символ табуляции ("\\t")</td>\r\n		<td>---</td>\r\n	</tr>\r\n</table>', 'date_format', '%d.%m.%Y %H:%M', 'yes');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cphone` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `wphone` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `hphone` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('admin','moderator','factory_employee','rc_employee','affiliate_employee') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'affiliate_employee',
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_blocked` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `dob` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `user_group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `login` (`login`,`email`,`fullname`,`cphone`,`wphone`,`hphone`,`type`,`address`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='База сотрудников' AUTO_INCREMENT=16 ;

--
-- Очистить таблицу перед добавлением данных `users`
--

TRUNCATE TABLE `users`;
--
-- Дамп данных таблицы `users`
--

INSERT IGNORE INTO `users` (`id`, `login`, `password`, `email`, `fullname`, `cphone`, `wphone`, `hphone`, `type`, `address`, `is_blocked`, `dob`, `user_group_id`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'yuriy.edlenko@gmail.com', 'Едленко Ю. Г.', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum', 'admin', 'Pobedy ave', 'no', '1961-11-05', 1),
(4, '19eugen86', '1ffa03303364249b62fd5a085763bab0', 'eugenedlenko@gmail.com', 'Едленко Е. Ю.', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum', 'moderator', 'Pobedy ave', 'no', '1986-12-30', 12),
(14, 'user', 'ee11cbb19052e40b07aac0ca060c23ee', 'test@user.com', 'Test User', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum', '', 'Lorem Ipsum', 'no', '2013-11-01', 2),
(15, 'blocked', '827ccb0eea8a706c4c34a16891f84e7b', 'test@test.test', 'Blocked User', 'Blocked User', 'Blocked User', 'Blocked User', 'moderator', 'Blocked User', 'yes', '2014-01-01', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Группы пользователей' AUTO_INCREMENT=4 ;

--
-- Очистить таблицу перед добавлением данных `user_groups`
--

TRUNCATE TABLE `user_groups`;
--
-- Дамп данных таблицы `user_groups`
--

INSERT IGNORE INTO `user_groups` (`id`, `title`) VALUES
(1, 'Администрация'),
(2, 'Кладовщики'),
(3, 'Продавцы');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

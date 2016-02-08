<?php
// Пути
define('ROOT_FOLDER', 'schedro');
define('HOME_DIR', dirname(__FILE__).'/../');
define('CONFIG_DIR', HOME_DIR.'config/');
define('INCLUDES_DIR', HOME_DIR.'includes/');
define('COMPONENTS_DIR', INCLUDES_DIR.'components/');
define('CORE_COMPONENTS_DIR', COMPONENTS_DIR.'core/');
define('ENTITIES_COMPONENTS_DIR', COMPONENTS_DIR.'entities/');

define('HTTP_SITE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/'.ROOT_FOLDER.'/');
define('HTTPS_SITE_URL', 'https://'.$_SERVER['HTTP_HOST'].'/'.ROOT_FOLDER.'/');

// Константы неизменных единиц измерения
define('GM_MEASURE', 10);	// грамм
define('KG_MEASURE', 1);	// килограмм
define('TN_MEASURE', 2);	// тонна
define('P_MEASURE', 16);	// поддон
define('M2_MEASURE', 8);	// кв. метр
define('M3_MEASURE', 9);	// куб. метр

// Константы сайта
define('DEFAULT_COUNTRY', 1);	// Украина
<?php
header('Content-Type: text/html; charset=utf-8');

ini_set('display_errors', true);
error_reporting(E_ALL);

require_once dirname(__FILE__).'/../config/site.config.php';
require_once CORE_COMPONENTS_DIR.'smarty.class.php';
$smarty = new Smarty();

require_once CORE_COMPONENTS_DIR.'database.class.php';
require_once CORE_COMPONENTS_DIR.'session.class.php';
require_once COMPONENTS_DIR.'auth.class.php';
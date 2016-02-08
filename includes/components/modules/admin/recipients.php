<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = 'getGrid';

$direction = (!empty($_REQUEST['direction_selected'])) ? $_REQUEST['direction_selected'] : 'ac';
$recipientType = substr($direction, 1);
switch ($recipientType) {
	case 'f': // Список комбинатов
		EntityFactory::loadEntity('Factories');
		break;

	case 'd': // Список РЦ
		EntityFactory::loadEntity('DC');
		break;

	case 'c': // Список клиентов
		EntityFactory::loadEntity('Clients');
		break;

	case 'a': // Список филиалов
	default:
		EntityFactory::loadEntity('Affiliates');
		break;
}

$data = EntityFactory::processRequest($cmd);
echo json_encode($data);
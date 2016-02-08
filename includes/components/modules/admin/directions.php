<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('Directions');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
switch ($cmd) {
	case 'getDirections_F':
		$start = 'f';
		break;

	case 'getDirections_D':
		$start = 'd';
		break;

	case 'getDirections_C':
		$start = 'c';
		break;
		
	case 'getDirections_A':
	default:
		$start = 'a';
		break;
}
$data = $entity->getAllFiltered($start);
echo json_encode($data);
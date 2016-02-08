<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$possibleDirections = array('af', 'ad', 'aa', 'ac');

$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
if (!empty($_REQUEST['f'])) {
	if ($cmd == 'ship') {
		$data = $entity->shipProducts($_REQUEST['f']);
	} elseif ($cmd == 'toCells') {
		$data = $entity->moveToCells($_REQUEST['f']);
	}
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
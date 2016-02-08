<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$possibleDirections = array('af', 'ad', 'aa', 'ac');

$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
if (!empty($_REQUEST['f']) && $cmd == 'ship') {
	foreach ($_REQUEST['f']['products'] as $key => $shipProduct) {
		$_REQUEST['f']['products'][$key]['from_cell_id'] = $shipProduct['aff_cell_id'];
	}
	$data = $entity->shipProducts($_REQUEST['f'], 'cells', 'aff_cell_id');
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
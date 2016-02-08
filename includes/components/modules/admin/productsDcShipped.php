<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$possibleDirections = array('df', 'dd', 'da', 'dc');

$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
if (!empty($_REQUEST['f'])) {
	if ($cmd == 'ship') {
		foreach ($_REQUEST['f']['products'] as $key => $request) {
			$_REQUEST['f']['products'][$key]['dc_id'] = $_REQUEST['f']['dc_id'];
			$_REQUEST['f']['products'][$key]['dc_title'] = $_REQUEST['f']['dc_title'];
		}
		$data = $entity->shipProducts($_REQUEST['f']);
	} elseif ($cmd == 'toCells') {
		$data = $entity->moveToDcCells($_REQUEST['f']);
	}
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
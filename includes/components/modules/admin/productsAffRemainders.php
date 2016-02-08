<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

$placeType = 'affiliate';
if (!empty($_REQUEST['from_cell_id'])) {
	$placeType = 'cells';
	$place = $_REQUEST['from_cell_id'];
} elseif (!empty($_REQUEST['aff_id'])) {
	$place = $_REQUEST['aff_id'];	
}

$entity = EntityFactory::loadEntity('Remainders', $placeType);
if ($cmd == 'getAvailableGroups' && $place) {
	$data = $entity->getAvailableGroups($place);
} elseif ($cmd == 'getAvailableProducts' && $place) {
	$data = $entity->getAvailableProducts($place, $_REQUEST['group_id']);
} elseif ($cmd == 'getAvailableParts' && $place) {
	$data = $entity->getAvailableParts($place, $_REQUEST['product_id']);
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
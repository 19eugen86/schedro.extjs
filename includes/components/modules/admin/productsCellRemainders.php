<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

$entity = EntityFactory::loadEntity('Remainders', 'cells');
if ($cmd == 'getAvailableGroups') {
	$data = $entity->getAvailableGroups($_REQUEST['cell_id']);
} elseif ($cmd == 'getAvailableProducts') {
	$data = $entity->getAvailableProducts($_REQUEST['cell_id'], $_REQUEST['group_id']);
} elseif ($cmd == 'getAvailableParts') {
	$data = $entity->getAvailableParts($_REQUEST['cell_id'], $_REQUEST['product_id']);
} elseif ($cmd == 'getGrid') {
	$data = $entity->getCellsRemainders();
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
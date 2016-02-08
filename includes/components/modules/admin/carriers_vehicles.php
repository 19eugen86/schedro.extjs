<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('CarriersVehicles');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

if ($cmd == 'getGrouped' && !empty($_REQUEST['carrier_id'])) {
	$data = $entity->getGroupedBy(
		'carrier_id',
		intval($_REQUEST['carrier_id'])
	);
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
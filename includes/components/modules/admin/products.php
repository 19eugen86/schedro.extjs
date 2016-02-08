<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('Products');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
if ($cmd == 'getGrouped' && !empty($_REQUEST['group_selected'])) {
	$data = $entity->getGroupedBy(
		'group_id',
		intval($_REQUEST['group_selected'])
	);
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
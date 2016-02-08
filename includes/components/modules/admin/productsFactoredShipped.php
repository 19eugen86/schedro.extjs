<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$possibleDirections = array('ff', 'fd', 'fa', 'fc');

$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
if (!empty($_REQUEST['f']) && $cmd == 'ship') {
	foreach ($_REQUEST['f']['products'] as $key => $request) {
		$_REQUEST['f']['products'][$key]['factory_id'] = $_REQUEST['f']['factory_id'];
		$_REQUEST['f']['products'][$key]['factory_title'] = $_REQUEST['f']['factory_title'];
	}
	$data = $entity->shipProducts($_REQUEST['f']);
} else {
	$data = EntityFactory::processRequest($cmd);
	if ($cmd == 'getGrid') {
		foreach ($data['data'] as $key => $val) {
			if ($val['direction'] == 'fd' && empty($val['from_id'])) {
				unset($data['data'][$key]);
				$data['total']--;
			}
		}
	}
}

echo json_encode($data);
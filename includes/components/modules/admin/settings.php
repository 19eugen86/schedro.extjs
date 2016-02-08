<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('Settings');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
// TODO:
//if ($cmd == 'edit' && !empty($_REQUEST['f'])) {
//	$f = $_REQUEST['f'];
//	unset($_REQUEST['f']['key']);
//	if ($f['key'] == 'date_format') {
//		$dateValue = strtolower($f['value']);
//		$_REQUEST['f']['value'] = $dateFormat.' H:i';
//	}
//}

$data = EntityFactory::processRequest($cmd);

echo json_encode($data);
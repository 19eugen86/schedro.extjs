<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

$possibleDirections = array('fa', 'da', 'aa', 'ca');
$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
$data = EntityFactory::processRequest($cmd);

echo json_encode($data);
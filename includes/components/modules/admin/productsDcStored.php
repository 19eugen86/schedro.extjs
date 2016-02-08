<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

$possibleDirections = array('fd', 'dd', 'ad', 'cd');
$entity = EntityFactory::loadEntity('ProductsMovement', $possibleDirections);
$data = EntityFactory::processRequest($cmd);

echo json_encode($data);
<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

if (empty($_REQUEST['f']['city_id']) && !empty($_REQUEST['f']['city_name'])) {
	$entity = EntityFactory::loadEntity('Cities');
	if (is_numeric($_REQUEST['f']['city_name'])) {
		$name = $entity->getOne('city_name', $_REQUEST['f']['city_name']);
		if (!empty($name)) {
			$_REQUEST['f']['city_id'] = $_REQUEST['f']['city_name'];
		}
	} else {
		$_REQUEST['f']['city_id'] = $entity->getCustomFieldValue('id', 'city_name', $_REQUEST['f']['city_name']);
	}
	if (empty($_REQUEST['f']['city_id'])) {
		$_REQUEST['f']['city_id'] = $entity->add(
			array(
				'city_name' => $_REQUEST['f']['city_name'],
				'country_id' => DEFAULT_COUNTRY
			)
		);
	}
}

$entity = EntityFactory::loadEntity('Affiliates');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$data = EntityFactory::processRequest($cmd);

echo json_encode($data);
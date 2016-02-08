<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$data = array();
$errors = 0;
if (!empty($_REQUEST['f']) && ($cmd == 'add' || $cmd == 'addOnDc')) {
	$request = $_REQUEST['f'];
	foreach ($request['products'] as $factoredProduct) {
		$_REQUEST['f'] = $factoredProduct;
		$_REQUEST['f']['factory_id'] = $request['factory_id'];
		if ($cmd == 'addOnDc') {
			$_REQUEST['f']['dc_id'] = $request['dc_id'];
		}
		$_REQUEST['f']['user_id'] = Auth::isLoggedIn();
		$_REQUEST['f']['status'] = 'arrived';
		$_REQUEST['f']['datetime'] = strtotime('now');
		$_REQUEST['f']['factored_date'] = strtotime($_REQUEST['f']['factored_date']);
		
		$f = $_REQUEST['f'];
		if (isset($f['factory_id']) && !empty($f['product_id']) && !empty($f['quantity']) && !empty($f['measure_id']) && !empty($f['products_part'])) {
			$entity = EntityFactory::loadEntity('ProductsFactored');
			$result = $entity->add($f);
			if (!$result || is_string($result)) {
				$errors++;
				$msg = 'Ошибка добавления';
				if (is_string($result)) {
					$msg .= ': '.$result;
				}
				$msg .= '.';
			} else {
				$f['product_factored_id'] = $result;
				$msg = 'Произведенная продукция успешно добавлена.';
			}
	
			if ($errors > 0) {
				$data['is_error'] = true;
			} else {
				$data['is_error'] = false;
			}
			$data['messages'][] = $msg;
			
			// Сохраняем остатки
			if (!$data['is_error']) {
				if ($cmd == 'add') {
					// Оастатки на складе комбината
					$entity = EntityFactory::loadEntity('Remainders', 'factory');
					$entity->increaseReminder($f);
				} elseif ($cmd == 'addOnDc') {
					// Остатки на складе РЦ
					$entity = EntityFactory::loadEntity('Remainders', 'dc');
					$entity->increaseReminder($f);
					
					// Имитируем приход на РЦ
					$f['to_id'] = $f['dc_id'];
					$f['direction'] = 'fd';
					$f['datetime'] = strtotime('now');	
					$entity = EntityFactory::loadEntity('ProductsMovement', array($f['direction']));
					$entity->add($f);
				}
			}
		}
	}
} elseif ($cmd == 'getAvailable') {
	$entity = EntityFactory::loadEntity('ProductsFactored');
	$data = $entity->getAllAvailable();
} else {
	$entity = EntityFactory::loadEntity('Remainders', 'factory');
	if ($cmd == 'getAvailableGroups') {
		$data = $entity->getAvailableGroups($_REQUEST['factory_id']);
	} elseif ($cmd == 'getAvailableProducts') {
		$data = $entity->getAvailableProducts($_REQUEST['factory_id'], $_REQUEST['group_id']);
	} elseif ($cmd == 'getAvailableParts') {
		$data = $entity->getAvailableParts($_REQUEST['factory_id'], $_REQUEST['product_id']);
	} else {
		$entity = EntityFactory::loadEntity('ProductsFactored');
		$data = EntityFactory::processRequest($cmd);
	}
}

echo json_encode($data);
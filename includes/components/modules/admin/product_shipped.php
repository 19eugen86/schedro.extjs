<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
$errors = 0;
if ($cmd == 'ship') {
	// Получаем кол-во отгруженной продукции в кг
	$ratedShippedValue = $_REQUEST['f']['quantity'];
	if ($_REQUEST['f']['measure_id'] != KG_MEASURE) {
		if ($_REQUEST['f']['measure_id'] == GM_MEASURE || $_REQUEST['f']['measure_id'] == TN_MEASURE) {
			$product = 0;
		} else {
			$product = $_REQUEST['f']['product_id'];
		}
		$entity = EntityFactory::loadEntity('MeasureRates');
		$ratedShippedValue = $entity->getRatedValue(
			$_REQUEST['f']['measure_id'],
			KG_MEASURE,
			$product,
			$_REQUEST['f']['quantity']
		);
	}
	
	// Проверяем текущий остаток. Обновляем, если есть нужное кол-во товара.
	$entity = EntityFactory::loadEntity('ProductStored');
	$storedProduct = $entity->getOneItem($_REQUEST['f']['id']);
	$currentReminder = $storedProduct['remainder'];
	if ($currentReminder < $ratedShippedValue) {
		$data['is_error'] = true;
		$data['messages'][] = 'На складе нет столько товара. Текущий остаток: '.$currentReminder.' кг.';
	} else {
		$entity->edit(array(
			'id' => $_REQUEST['f']['id'],
			'datetime_modified' => strtotime('now'),
			'remainder' => $currentReminder-$ratedShippedValue
		));
		
		// Сохраняем информацию об отгрузке
		$_REQUEST['f']['user_id'] = Auth::isLoggedIn();
		$_REQUEST['f']['datetime'] = strtotime('now');
		$_REQUEST['f']['stored_product_id'] = $_REQUEST['f']['id'];
		$entity = EntityFactory::loadEntity('ProductShipped');
		$result = $entity->shipProduct($_REQUEST['f']);
		if (!$result || is_string($result)) {
			$errors++;
			$msg = 'Ошибка отгрузки';
			if (is_string($result)) {
				$msg .= ': '.$result;
			}
			$msg .= '.';
		} else {
			$msg = 'Товар успешно отгружен.';
		}

		if ($errors > 0) {
			$data['is_error'] = true;
		} else {
			$data['is_error'] = false;
		}
		$data['messages'][] = $msg;
	}
} else {
	$entity = EntityFactory::loadEntity('ProductShipped');
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
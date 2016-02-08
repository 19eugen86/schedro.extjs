<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('DcCells');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
if (($cmd == 'getDcStoreCells' || $cmd == 'getAvailableDcStoreCells') && !empty($_REQUEST['dc_store_id'])) {
	$data = $entity->getGroupedBy('dc_store_id', intval($_REQUEST['dc_store_id']));
} else {
	$data = EntityFactory::processRequest($cmd);
}

if ($cmd == 'getGrid' || $cmd == 'getDcStoreCells' || $cmd == 'getAvailableDcStoreCells') {
	if ($data['total'] > 0) {
		$entity = EntityFactory::loadEntity('MeasureRates');
		foreach ($data['data'] as $key => $cell) {
			$data['data'][$key]['free_area'] = $cell['area'];
			$entity = EntityFactory::loadEntity('DcCells');
			$cellProducts = $entity->getCellProducts($cell['id']);
			if ($cellProducts['total'] > 0) {
				$entity = EntityFactory::loadEntity('MeasureRates');
				foreach ($cellProducts['data'] as $product) {
					if ($product['remainder'] > EntityFactory::getSetting('min_reminder')) {
						// Получаем кол-во поддонов на основании остатков. Остаток всегда в кг
						$panNum = ceil(
							$entity->getRatedValue(
								KG_MEASURE,
								P_MEASURE,
								$product['product_id'],
								$product['remainder']
							)
						);
						// Получаем текущую занимаемую площадь
						$usedArea = ceil($entity->getRatedValue(P_MEASURE, M2_MEASURE, 0, $panNum));
						$data['data'][$key]['free_area'] -= $usedArea;
					}
				}
			}
		}
		
		// Убираем полностью занятые камеры из выпадающего списка.
		if ($cmd == 'getAvailableDcStoreCells') {
			$info = $data['data'];
			$data = array();
			foreach ($info as $key => $row) {
				if ($row['free_area'] > 0) {
					$info[$key]['title'] .= ' (Свободно: '.$info[$key]['free_area'].'м²)';
					$data[] = $info[$key];
				}
			}
			$data = array(
				'total' => count($data),
				'data' => $data
			);
		}
	}
}

echo json_encode($data);
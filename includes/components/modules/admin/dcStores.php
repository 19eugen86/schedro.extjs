<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('DcStores');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
if ($cmd == 'getDcStores' && !empty($_REQUEST['dc_id'])) {
	$data = $entity->getGroupedBy('dc_id', intval($_REQUEST['dc_id']));
} else {
	$data = EntityFactory::processRequest($cmd);
}

// Получаем визуальное представление заполненности камер
if ($cmd == 'getGrid' && $data['total'] > 0) {
	$entity = EntityFactory::loadEntity('DcCells');
	$cells = $entity->getAll();
	if ($cells && $cells['total'] > 0) {
		$entity = EntityFactory::loadEntity('MeasureRates');
		foreach ($cells['data'] as $key => $cell) {
			$cells['data'][$key]['free_area'] = $cell['area'];
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
						$cells['data'][$key]['free_area'] -= $usedArea;
					}
				}
			}
		}
		asort($cells['data']);

		foreach ($data['data'] as $key => $store) {
			$data['data'][$key]['cellsDivs'] = '';
			$data['data'][$key]['free_area'] = 0;
			foreach ($cells['data'] as $cell) {
				if ($store['id'] == $cell['dc_store_id']) {
					$S_total = $cell['area'];
					$S_free = $cell['free_area'];
					$S_used = $S_total - $S_free;
					$usedBar = ceil($S_used*100/$S_total);
					if ($usedBar <= 5) {
						$percent = 0;
					} elseif ($usedBar > 5 && $usedBar <= 20) {
						$percent = 15;
					} elseif ($usedBar > 20 && $usedBar <= 33) {
						$percent = 33;
					} elseif ($usedBar > 33 && $usedBar <= 55) {
						$percent = 50;
					} elseif ($usedBar > 55 && $usedBar <= 70) {
						$percent = 66;
					} elseif ($usedBar > 70 && $usedBar <= 85) {
						$percent = 80;
					} else {
						$percent = 99;
					}

					$cornerCut = 'border-top-right-radius: 5em; ';
					if ($usedBar == 0 || $usedBar == 100) {
						$cornerCut = '';
					}
					
					$data['data'][$key]['cellsDivs'] .= '<div class="bar-parent">';
					$data['data'][$key]['cellsDivs'] .= '<div class="bar-subparent"><div style="'.$cornerCut.'width: '.$usedBar.'%;" class="bar-'.$percent.'-fil"></div></div>';
					$data['data'][$key]['cellsDivs'] .= '<div class="bar-empty">'.$cell['title'].' (Свободно '.$S_free.'м² из '.$S_total.'м²)</div>';
					$data['data'][$key]['cellsDivs'] .= '<div class="bar-clear"></div>';
					$data['data'][$key]['cellsDivs'] .= '</div>';
					$data['data'][$key]['free_area'] += $S_free;
				}
			}
		}
	}
}

echo json_encode($data);
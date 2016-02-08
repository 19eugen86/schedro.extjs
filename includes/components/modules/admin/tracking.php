<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('ProductsMovement');

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';

$errors = 0;
$data = array();

if ($cmd == 'edit') {
	// Получаем трекинг информацию
	$productTrack = $entity->getOneItem($_REQUEST['f']['id']);
	
	// Проверяем остатки (неразнесенные ИЛИ в камерах) отправителя
	$directionFrom = substr($_REQUEST['f']['direction'], 0, 1);
	switch ($directionFrom) {
		case 'f':
			$remindersType = 'factory';
			$productTrack['factory_id'] = $productTrack['from_id'];
			break;
		
		case 'd':
			$remindersType = 'dc';
			if (intval($productTrack['from_cell_id']) > 0) {
				$productTrack['dc_cell_id'] = $productTrack['from_cell_id'];
				$remindersType = 'dcCells';
			}
			$productTrack['dc_id'] = $productTrack['from_id'];
			break;
		
		case 'a':
		default:
			$remindersType = 'affiliate';
			if (intval($productTrack['from_cell_id']) > 0) {
				$productTrack['aff_cell_id'] = $productTrack['from_cell_id'];
				$remindersType = 'cells';
			}
			$productTrack['aff_id'] = $productTrack['from_id'];
			break;
	}
	$entity = EntityFactory::loadEntity('Remainders', $remindersType);
	
	echo '<pre>';
	var_dump($remindersType);
	echo '</pre>';
	die();
} elseif ($cmd == 'delete') {
	$data = EntityFactory::processRequest($cmd);
} elseif ($cmd == 'updateStatus') {
	$ids = (!empty($_REQUEST['ids'])) ? json_decode($_REQUEST['ids']) : null;
	if (is_array($ids) && !empty($ids)) {
		foreach ($ids as $id) {
			$result = $entity->updateStatus($_REQUEST['status'], $id);
			if (!$result) {
				$errors++;
				$data['messages'][] = 'Ошибка статуса.';
			} else {
				$data['messages'][] = 'Статус успешно изменен.';
				
				// Получаем трекинг информацию
				$productTrack = $entity->getOneItem($id);
				
				// Обновляем остатки (неразнесенные ИЛИ в камерах) отправителя (статус == shipped)
				if ($_REQUEST['status'] == 'shipped') {
					$directionFrom = substr($productTrack['direction'], 0, 1);
					switch ($directionFrom) {
						case 'f':
							$remindersType = 'factory';
							$productTrack['factory_id'] = $productTrack['from_id'];
							break;
						
						case 'd':
							$remindersType = 'dc';
							if (intval($productTrack['from_cell_id']) > 0) {
								$productTrack['dc_cell_id'] = $productTrack['from_cell_id'];
								$remindersType = 'dcCells';
							}
							$productTrack['dc_id'] = $productTrack['from_id'];
							break;
						
						case 'a':
						default:
							$remindersType = 'affiliate';
							if (intval($productTrack['from_cell_id']) > 0) {
								$productTrack['aff_cell_id'] = $productTrack['from_cell_id'];
								$remindersType = 'cells';
							}
							$productTrack['aff_id'] = $productTrack['from_id'];
							break;
					}
					$entity = EntityFactory::loadEntity('Remainders', $remindersType);
					$entity->decreaseReminder($productTrack);
				}
			
				// Обновляем остатки получателя (комбинат/рц/филиал) (статус == arrived)
				if ($_REQUEST['status'] == 'arrived') {
					$directionTo = substr($productTrack['direction'], 1, 1);
					if ($directionTo != 'c') {
						switch ($directionTo) {
							case 'f':
								$recRemindersType = 'factory';
								$productTrack['factory_id'] = $productTrack['to_id'];
								break;
				
							case 'd':
								$recRemindersType = 'dc';
								$productTrack['dc_id'] = $productTrack['to_id'];
								break;
				
							case 'a':
								$recRemindersType = 'affiliate';
								$productTrack['aff_id'] = $productTrack['to_id'];
								break;
				
							default:
								break;
						}
						$entity = EntityFactory::loadEntity('Remainders', $recRemindersType);
						$entity->increaseReminder($productTrack);
					}
				}
			}
		}			
	} else {
		$errors++;
		$data['messages'][] = 'Записи не выбраны.';
	}
	
	if ($errors > 0) {
		$data['is_error'] = true;
	} else {
		$data['is_error'] = false;
	}
} else {
	$id = (!empty($_REQUEST['id'])) ? $_REQUEST['id'] : null;
	if ($id) {
		$data = $entity->getOneItem($id);
	}
}

echo json_encode($data);
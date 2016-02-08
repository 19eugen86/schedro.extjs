<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('Measures');

if (!empty($_REQUEST['f']['measure_type'])) {
	switch ($_REQUEST['f']['measure_type']) {
		case 'is_weight':
			$_REQUEST['f']['is_weight'] = 'yes';
			$_REQUEST['f']['is_area'] = 'no';
			$_REQUEST['f']['is_volume'] = 'no';
			break;

		case 'is_area':
			$_REQUEST['f']['is_weight'] = 'no';
			$_REQUEST['f']['is_area'] = 'yes';
			$_REQUEST['f']['is_volume'] = 'no';
			break;
			
		case 'is_volume':
			$_REQUEST['f']['is_weight'] = 'no';
			$_REQUEST['f']['is_area'] = 'no';
			$_REQUEST['f']['is_volume'] = 'yes';
			break;
					
		default:
			break;
	}
}

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
if ($cmd == 'getExcludedGrid') {
	$data = $entity->getAllExcluded(
		array(
			'id' => $_REQUEST['already_selected']
		)
	);
} elseif ($cmd == 'getGridModifiable') {
	$data = $entity->getAllModifiable();
} elseif ($cmd == 'getVisible') {
	$data = $entity->getAllVisible();
} elseif ($cmd == 'mkVisible' || $cmd == 'mkInvisible') {
	$errors = 0;
	$ids = (!empty($_REQUEST['ids'])) ? json_decode($_REQUEST['ids']) : null;
	if (is_array($ids) && !empty($ids)) {
		foreach ($ids as $id) {
			if ($cmd == 'mkVisible') {
				$result = $entity->makeVisible($id);
			} elseif ($cmd == 'mkInvisible') {
				$result = $entity->makeInvisible($id);
			}
			if (!$result) {
				$errors++;
				$msg = 'Ошибка.';
			} else {
				$msg = 'Все операции успешно завершены.';
			}
		}			
	} else {
		$errors++;
		$msg = 'Записи не выбраны.';
	}
	if ($errors > 0) {
		$data['is_error'] = true;
	} else {
		$data['is_error'] = false;
	}
	$data['messages'][] = $msg;
} else {
	$data = EntityFactory::processRequest($cmd);
}

echo json_encode($data);
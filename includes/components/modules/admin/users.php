<?php
if (!defined('KERNEL_LOADED')) {die;}

require_once ENTITIES_COMPONENTS_DIR.'EntityFactory.php';
$entity = EntityFactory::loadEntity('Users');
$errors = 0;

$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : 'getGrid';
if ($cmd == 'resetpwd') {
	$defaultPass = '12345';
	die($defaultPass);
} if ($cmd == 'block' || $cmd == 'unblock') {
	$ids = (!empty($_REQUEST['ids'])) ? json_decode($_REQUEST['ids']) : null;
	if (is_array($ids) && !empty($ids)) {
		foreach ($ids as $id) {
			if ($cmd == 'block') {
				$result = $entity->block($id);
				if (!$result) {
					$errors++;
					$msg = 'Ошибка блокировки.';
				} else {
					$msg = 'Пользователи успешно заблокированы.';
				}				
			} elseif ($cmd == 'unblock') {
				$result = $entity->unblock($id);
				if (!$result) {
					$errors++;
					$msg = 'Ошибка разблокировки.';
				} else {
					$msg = 'Пользователи успешно разблокированы.';
				}
			}
		}			
	} else {
		$errors++;
		$msg = 'Пользователи не выбраны.';
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
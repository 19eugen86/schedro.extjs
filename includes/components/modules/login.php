<?php
if (!defined('KERNEL_LOADED')) {die;}
$cmd = (!empty($_REQUEST['cmd'])) ? $_REQUEST['cmd'] : false;
if ('login' == $cmd) {
	$f = $_REQUEST['f'];
	$result = Auth::login($f['login'], $f['password']);
	if ($result === 'blocked') {
		$data = array(
			'is_error' => 'blocked',
			'success' => false,
			'messages' => array('Ваша учетная запись заблокирована. Обратитесь к администратору.')
		);
	} elseif($result === true) {
		$role = Auth::checkRole();
		switch ($role) {
			case 'admin':
			case 'moderator':
				$data = array(
					'is_error' => false,
					'success' => true,
					'isAdmin' => true
				);
				break;
			case 'user':
				$data = array(
					'is_error' => false,
					'success' => true,
					'isAdmin' => false
				);
				break;		
			case 'guest':
			default:
				$data = array(
					'is_error' => true,
					'success' => false,
					'messages' => array('Ошибка авторизации!')
				);
				break;
		}
	} elseif($result === false) {
		$data = array(
			'is_error' => 'invalid_user',
			'success' => false,
			'messages' => array('Такой учетной записи не существует.')
		);		
	}
	echo json_encode($data);
} else {
	$smarty->display('login.tpl');
}
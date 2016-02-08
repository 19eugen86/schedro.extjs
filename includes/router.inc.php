<?php
$role = Auth::checkRole();
switch ($role) {
	case 'admin':
		define('MODULES_DIR', COMPONENTS_DIR.'modules/admin/');
		break;
	case 'moderator':
		define('MODULES_DIR', COMPONENTS_DIR.'modules/moderator/');
		break;
	case 'factory_employee':
		define('MODULES_DIR', COMPONENTS_DIR.'modules/factory_employee/');
		break;
	case 'rc_employee':
		define('MODULES_DIR', COMPONENTS_DIR.'modules/affiliate_employee/');
		break;
	case 'affiliate_employee':
		define('MODULES_DIR', COMPONENTS_DIR.'modules/affiliate_employee/');
		break;
	default:
		define('MODULES_DIR', COMPONENTS_DIR.'modules/');
		break;
}

$requestPath = basename($_SERVER['REQUEST_URI']);
if ($requestPath == ROOT_FOLDER && $role != 'anonymous') {
	header('Location: '.HTTP_SITE_URL.$role.'/home');
} else {
	require_once MODULES_DIR.'loader.inc.php';
}
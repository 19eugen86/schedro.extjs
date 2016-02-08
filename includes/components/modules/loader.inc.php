<?php
define('KERNEL_LOADED', true);
switch ($requestPath) {
	case 'home':
		if (!Auth::isLoggedIn()) {
			header('Location: '.HTTP_SITE_URL);
		}
		require_once MODULES_DIR.'index.php';
		break;

	case 'logout':
		require_once MODULES_DIR.'logout.php';
		break;
		
	case '':
	case 'login':
	case 'schedro':
	default:
		require_once MODULES_DIR.'login.php';
		break;
}
<?php
define('KERNEL_LOADED', true);
if (!Auth::isLoggedIn()) {
	header('Location: '.HTTP_SITE_URL);
}

switch ($requestPath) {
	////////////////////////////////////////////////////////////////////////
	// BEGIN: Скрипты, отвечающие за работу с комбинатами
	//
	case '':
	case 'admin':
	case 'home':
		require_once MODULES_DIR.'index.php';
		break;

	case 'factories':
		require_once MODULES_DIR.'factories.php';
		break;
		
	case 'productsFactored':
		require_once MODULES_DIR.'productsFactored.php';
		break;

	case 'productsFactoredShipped':
		require_once MODULES_DIR.'productsFactoredShipped.php';
		break;		
	//
	// END: Скрипты, отвечающие за работу с комбинатами
	////////////////////////////////////////////////////////////////////////
	
		
	////////////////////////////////////////////////////////////////////////
	// BEGIN: Скрипты, отвечающие за работу с РЦ
	//	
	case 'dc':
		require_once MODULES_DIR.'dc.php';
		break;

	case 'dcStores':
		require_once MODULES_DIR.'dcStores.php';
		break;

	case 'dcCells':
		require_once MODULES_DIR.'dcCells.php';
		break;
		
	case 'productsDcRemainders':
		require_once MODULES_DIR.'productsDcRemainders.php';
		break;		

	case 'productsDcCellRemainders':
		require_once MODULES_DIR.'productsDcCellRemainders.php';
		break;
		
	case 'productsDcStored':
		require_once MODULES_DIR.'productsDcStored.php';
		break;

	case 'productsDcShipped':
		require_once MODULES_DIR.'productsDcShipped.php';
		break;

	case 'productsDcCellShipped':
		require_once MODULES_DIR.'productsDcCellShipped.php';
		break;
	//
	// END: Скрипты, отвечающие за работу с РЦ
	////////////////////////////////////////////////////////////////////////
	

	/////////////////////////////////////////////////////////////////////////////////
	// BEGIN: Скрипты, отвечающие за работу с филиалами + склады + складские камеры
	//
	case 'stores':
		require_once MODULES_DIR.'stores.php';
		break;

	case 'cells':
		require_once MODULES_DIR.'cells.php';
		break;

	case 'affiliates':
		require_once MODULES_DIR.'affiliates.php';
		break;
		
	case 'productsAffRemainders':
		require_once MODULES_DIR.'productsAffRemainders.php';
		break;
		
	case 'productsAffStored':
		require_once MODULES_DIR.'productsAffStored.php';
		break;
		
	case 'productsAffShipped':
		require_once MODULES_DIR.'productsAffShipped.php';
		break;
		
	case 'productsCellRemainders':
		require_once MODULES_DIR.'productsCellRemainders.php';
		break;

	case 'productsCellShipped':
		require_once MODULES_DIR.'productsCellShipped.php';
		break;
	//
	// END: Скрипты, отвечающие за работу с филиалами + склады + складские камеры
	/////////////////////////////////////////////////////////////////////////////////

		
	////////////////////////////////////////////////////////////////////////
	// BEGIN: Отчетность
	//
	case 'report':
		require_once MODULES_DIR.'report.php';
		break;	
	//
	// END: Отчетность
	////////////////////////////////////////////////////////////////////////
	
		
	////////////////////////////////////////////////////////////////////////
	// BEGIN: Справочники
	//
	case 'products':
		require_once MODULES_DIR.'products.php';
		break;
		
	case 'productGroups':
		require_once MODULES_DIR.'product_groups.php';
		break;
		
	case 'measures':
		require_once MODULES_DIR.'measures.php';
		break;

	case 'measureRates':
		require_once MODULES_DIR.'measure_rates.php';
		break;
		
	case 'users':
		require_once MODULES_DIR.'users.php';
		break;

	case 'userGroups':
		require_once MODULES_DIR.'user_groups.php';
		break;
		
	case 'cities':
		require_once MODULES_DIR.'cities.php';
		break;

	case 'countries':
		require_once MODULES_DIR.'countries.php';
		break;

	case 'clients':
		require_once MODULES_DIR.'clients.php';
		break;

	case 'directions':
		require_once MODULES_DIR.'directions.php';
		break;

	case 'recipients':
		require_once MODULES_DIR.'recipients.php';
		break;

	case 'carriers':
		require_once MODULES_DIR.'carriers.php';
		break;

	case 'carriersVehicles':
		require_once MODULES_DIR.'carriers_vehicles.php';
		break;

	case 'carriersDrivers':
		require_once MODULES_DIR.'carriers_drivers.php';
		break;
	//
	// END: Справочники
	////////////////////////////////////////////////////////////////////////
	
	case 'tracking':
		require_once MODULES_DIR.'tracking.php';
		break;
		
	case 'settings':
		require_once MODULES_DIR.'settings.php';
		break;
		
	case 'logout':
		require_once MODULES_DIR.'logout.php';
		break;

	default:
		require_once MODULES_DIR.'404.php';
		break;
}
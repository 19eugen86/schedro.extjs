<html>
	<head>
		<title>Щедро &raquo; Склад</title>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
		<link href="{$conf.base_url}images/favicon.ico" type="image/x-icon" rel="shortcut icon">
		<link href="{$conf.base_url}css/main.css" type="text/css" rel="stylesheet"></link>

		<script type="text/javascript"><!--{literal}
			var site_base_url = '{/literal}{$conf.base_url}{literal}';
		//-->{/literal}
		</script>
	</head>
	
	<body>
		<div id="loadingIco" style="opacity: 1;"> 
			<div id="loadingHide"></div> 
			<div id="loading">
				<div class="loading-indicator">
					<img height="32" width="32" style="margin-right: 8px; float: left; vertical-align: top;" src="{$conf.base_url}ui/js/resources/images/large-loading.gif">Щедро<br>
					<span id="loadingIco-msg">Инициализация...</span>
				</div>
			</div>
		</div>
		
		<link href="{$conf.base_url}ui/live/extjs/resources/css/ext-all.css" type="text/css" rel="stylesheet"></link>
		<link href="{$conf.base_url}ui/live/extjs/resources/css/xtheme-gray.css" type="text/css" rel="stylesheet"></link>
		<link href="{$conf.base_url}ui/js/resources/css/main.css" type="text/css" rel="stylesheet"></link>
		<link href="{$conf.base_url}ui/js/plugins/gridfilters/css/GridFilters.css" type="text/css" rel="stylesheet"></link>
		
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка ядра...';
		</script>
		
		<script src="{$conf.base_url}ui/live/extjs/ext-base.js" type="text/javascript" language="javascript"></script>
		
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка компонентов...';
		</script>
		
		<script src="{$conf.base_url}ui/live/extjs/ext-all.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/dev/extjs/src/locale/ext-lang-ru.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/ns.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/main.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/Functions.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/TabCloseMenu.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/RowExpander.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/RowEditor.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/plugins/gridfilters/filter/Filter.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/gridfilters/GridFilters.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/gridfilters/filter/DateFilter.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/plugins/gridfilters/filter/StringFilter.js" type="text/javascript" language="javascript"></script>
		<!-- <script src="{$conf.base_url}ui/js/plugins/gridfilters/filter/EditableItem.js" type="text/javascript" language="javascript"></script> -->

		{if $role == 'user'}
		<script src="{$conf.base_url}ui/js/Index.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/ProductsStoredUser.js" type="text/javascript" language="javascript"></script>
		{else}
		<script src="{$conf.base_url}ui/js/admin/Index.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/Factories.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/FactoryRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/FactoryStored.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/FactoryShipped.js" type="text/javascript" language="javascript"></script>

		
		<script src="{$conf.base_url}ui/js/admin/DC.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcStored.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcShipped.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcStores.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcCells.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/DcCellRemainders.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/Affiliates.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffStored.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffShipped.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffStores.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffCells.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/AffCellRemainders.js" type="text/javascript" language="javascript"></script>
	

		<script src="{$conf.base_url}ui/js/admin/Countries.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/Cities.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/Measures.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/MeasureRates.js" type="text/javascript" language="javascript"></script>
		
		
		<script src="{$conf.base_url}ui/js/admin/Clients.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/ProductGroups.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/Products.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/UserGroups.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/Users.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/Carriers.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/CarriersVehicles.js" type="text/javascript" language="javascript"></script>
		<script src="{$conf.base_url}ui/js/admin/CarriersDrivers.js" type="text/javascript" language="javascript"></script>
		
		<script src="{$conf.base_url}ui/js/admin/Settings.js" type="text/javascript" language="javascript"></script>
		{/if}
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка компонентов...';
		</script>
	</body>
</html>
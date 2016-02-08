<?php /* Smarty version Smarty-3.1.15, created on 2015-12-25 10:32:15
         compiled from "D:\xampp\htdocs\schedro\includes\components\templates\index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:14132567d0d1f9fef60-14953937%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'a5690cfed895666dd780f2813710bed9c9fc3853' => 
    array (
      0 => 'D:\\xampp\\htdocs\\schedro\\includes\\components\\templates\\index.tpl',
      1 => 1403971959,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '14132567d0d1f9fef60-14953937',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'conf' => 0,
    'role' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.15',
  'unifunc' => 'content_567d0d20e9f101_68746472',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_567d0d20e9f101_68746472')) {function content_567d0d20e9f101_68746472($_smarty_tpl) {?><html>
	<head>
		<title>Щедро &raquo; Склад</title>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
images/favicon.ico" type="image/x-icon" rel="shortcut icon">
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
css/main.css" type="text/css" rel="stylesheet"></link>

		<script type="text/javascript"><!--
			var site_base_url = '<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
';
		//-->
		</script>
	</head>
	
	<body>
		<div id="loadingIco" style="opacity: 1;"> 
			<div id="loadingHide"></div> 
			<div id="loading">
				<div class="loading-indicator">
					<img height="32" width="32" style="margin-right: 8px; float: left; vertical-align: top;" src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/resources/images/large-loading.gif">Щедро<br>
					<span id="loadingIco-msg">Инициализация...</span>
				</div>
			</div>
		</div>
		
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/live/extjs/resources/css/ext-all.css" type="text/css" rel="stylesheet"></link>
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/live/extjs/resources/css/xtheme-gray.css" type="text/css" rel="stylesheet"></link>
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/resources/css/main.css" type="text/css" rel="stylesheet"></link>
		<link href="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/css/GridFilters.css" type="text/css" rel="stylesheet"></link>
		
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка ядра...';
		</script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/live/extjs/ext-base.js" type="text/javascript" language="javascript"></script>
		
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка компонентов...';
		</script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/live/extjs/ext-all.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/dev/extjs/src/locale/ext-lang-ru.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/ns.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/main.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/Functions.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/TabCloseMenu.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/RowExpander.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/RowEditor.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/filter/Filter.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/GridFilters.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/filter/DateFilter.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/filter/StringFilter.js" type="text/javascript" language="javascript"></script>
		<!-- <script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/plugins/gridfilters/filter/EditableItem.js" type="text/javascript" language="javascript"></script> -->

		<?php if ($_smarty_tpl->tpl_vars['role']->value=='user') {?>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/Index.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/ProductsStoredUser.js" type="text/javascript" language="javascript"></script>
		<?php } else { ?>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Index.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Factories.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/FactoryRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/FactoryStored.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/FactoryShipped.js" type="text/javascript" language="javascript"></script>

		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DC.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcStored.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcShipped.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcStores.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcCells.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/DcCellRemainders.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Affiliates.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffRemainders.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffStored.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffShipped.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffStores.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffCells.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/AffCellRemainders.js" type="text/javascript" language="javascript"></script>
	

		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Countries.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Cities.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Measures.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/MeasureRates.js" type="text/javascript" language="javascript"></script>
		
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Clients.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/ProductGroups.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Products.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/UserGroups.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Users.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Carriers.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/CarriersVehicles.js" type="text/javascript" language="javascript"></script>
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/CarriersDrivers.js" type="text/javascript" language="javascript"></script>
		
		<script src="<?php echo $_smarty_tpl->tpl_vars['conf']->value['base_url'];?>
ui/js/admin/Settings.js" type="text/javascript" language="javascript"></script>
		<?php }?>
		<script type="text/javascript">
			document.getElementById('loadingIco-msg').innerHTML = 'Загрузка компонентов...';
		</script>
	</body>
</html><?php }} ?>

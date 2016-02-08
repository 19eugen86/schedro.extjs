Schedro.Index = function(config) {
	config = config || {};
	config.id = Ext.id();
	
	Ext.apply(this, config);	
	Schedro.Index.superclass.constructor.call(this);
	
	this.buildContent();
};

Ext.extend(Schedro.Index, Schedro.Functions, {
	allItemsPageHeight: 0,
	pageSize: 20,
	buildContent: function(){
		new Ext.Viewport({layout:'border', border: false, bodyBorder: false, 
			items: [this.getNortPanel(), this.getCenterPanel()], 
			renderTo: Ext.getBody()
		});

		//Hide loader panel
		(function(){
			Ext.get('loadingIco').hide(document.body);
			
			Ext.addBehaviors({
			    'a.nav_menu_link@click' : function(e, t){
			    	var action = t.getAttribute('action');
			    	var tabTitle = t.getAttribute('tabTitle');
			    	wnd.addTab(action, tabTitle);
			    }
			});
  		}).defer(100, this);		
	},

	chCard: function(item){
		Ext.getCmp(this.id + '-card-panel').getLayout().setActiveItem(item);
	},
	
	getNortPanel: function(){
		var factoryProductTrafficMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Остатки', iconCls: 'package', handler: this.addTab.createDelegate(this, ['FactoryRemainders', 'Комбинаты &raquo; Остатки', 'FactoryRemainders'])},
	            {text: 'Приход', iconCls: 'dbIn', handler: this.addTab.createDelegate(this, ['FactoryStored', 'Комбинаты &raquo; Приход', 'FactoryStored'])},
            	{text: 'Расход', iconCls: 'dbOut', handler: this.addTab.createDelegate(this, ['FactoryShipped', 'Комбинаты &raquo; Расход', 'FactoryShipped'])}
        	]
	    });

		var dcReminders = new Ext.menu.Menu({
        	items: [
                	{text: 'Неразнесенные', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['DcRemainders', 'РЦ &raquo; Остатки', 'DcRemainders'])},
                	{text: 'В камерах', iconCls: 'drive_network', handler: this.addTab.createDelegate(this, ['DcCellRemainders', 'РЦ &raquo; Камеры &raquo; Остатки', 'DcCellRemainders'])}
            ]
		});
		
		var dcProductTrafficMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Остатки', iconCls: 'package', menu: dcReminders},
	            {text: 'Приход', iconCls: 'dbIn', handler: this.addTab.createDelegate(this, ['DcStored', 'РЦ &raquo; Приход', 'DcStored'])},
            	{text: 'Расход', iconCls: 'dbOut', handler: this.addTab.createDelegate(this, ['DcShipped', 'РЦ &raquo; Расход', 'DcShipped'])}
        	]
	    });

		var affReminders = new Ext.menu.Menu({
        	items: [
        	    {text: 'Неразнесенные', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['AffRemainders', 'Филиалы &raquo; Остатки', 'AffRemainders'])},
				{text: 'В камерах', iconCls: 'drive_network', handler: this.addTab.createDelegate(this, ['AffCellRemainders', 'Филиалы &raquo; Камеры &raquo; Остатки', 'AffCellRemainders'])},
            ]
		});
		
		var affiliateProductTrafficMenu = new Ext.menu.Menu({
        	items: [
        	    {text: 'Остатки', iconCls: 'package', menu: affReminders},
	            {text: 'Приход', iconCls: 'dbIn', handler: this.addTab.createDelegate(this, ['AffStored', 'Филиалы &raquo; Приход', 'AffStored'])},
            	{text: 'Расход', iconCls: 'dbOut', handler: this.addTab.createDelegate(this, ['AffShipped', 'Фиилалы &raquo; Расход', 'AffShipped'])}
        	]
	    });

		var productTrafficMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'По комбинатам', iconCls: 'building', menu: factoryProductTrafficMenu},
            	{text: 'По РЦ', iconCls: 'outArrows', menu: dcProductTrafficMenu},
            	{text: 'По филиалам', iconCls: 'book_addresses', menu: affiliateProductTrafficMenu}
        	]
	    });
		
	    var reportsMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Сводная таблица', iconCls: 'table_refresh', handler: this.openFullReport.createDelegate(this, ['FullReport', 'Сводная таблица', 'FullReport'])},
	            {text: 'Отгрузочные листы', iconCls: 'script_delete', handler: this.addTab.createDelegate(this, ['OutLists', 'Отгрузочные листы', 'OutLists'])}
        	]
	    });

	    var dcStoreMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Склады', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['DcStores', 'Склады РЦ', 'DcStores'])},
	            {text: 'Камеры', iconCls: 'drive_network', handler: this.addTab.createDelegate(this, ['DcCells', 'Камеры РЦ', 'DcCells'])}
        	]
	    });
	    
	    var affiliateStoreMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Склады', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['AffStores', 'Склады филиалов', 'AffStores'])},
	            {text: 'Камеры', iconCls: 'drive_network', handler: this.addTab.createDelegate(this, ['AffCells', 'Камеры филиалов', 'AffCells'])}
        	]
	    });
	    
		var storeMenu = new Ext.menu.Menu({
        	items: [
//            	{text: 'Склады комбинатов', iconCls: 'building', handler: this.addTab.createDelegate(this, ['FactoryStores', 'Склады комбинатов', 'FactoryStores'])},
	            {text: 'Склады РЦ', iconCls: 'outArrows', menu: dcStoreMenu},
	            {text: 'Склады филиалов', iconCls: 'book_addresses', menu: affiliateStoreMenu}
        	]
	    });

		var productMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Номенклатура', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['Products', 'Продукция', 'Products'])},
	            {text: 'Товарные группы', iconCls: 'chart_pie', handler: this.addTab.createDelegate(this, ['ProductGroups', 'Товарные группы', 'ProductGroups'])}
        	]
	    });

	    var measureMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Справочник', iconCls: 'text_list_bullets', handler: this.addTab.createDelegate(this, ['Measures', 'Единицы измерерния', 'Measures'])},
	            {text: 'Пропорции', iconCls: 'refreshArrows', handler: this.addTab.createDelegate(this, ['MeasureRates', 'Пропорции', 'MeasureRates'])}
        	]
	    });

	    var trafficMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Перевозчики', iconCls: 'date', handler: this.addTab.createDelegate(this, ['Carriers', 'Перевозчики', 'Carriers'])},
	            {text: 'Автомобили', iconCls: 'car', handler: this.addTab.createDelegate(this, ['CarriersVehicles', 'Автомобили', 'CarriersVehicles'])},
	            {text: 'Водители', iconCls: 'user_gray', handler: this.addTab.createDelegate(this, ['CarriersDrivers', 'Водители', 'CarriersDrivers'])}
        	]
	    });
	    
	    var usersMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Пользователи', iconCls: 'user', handler: this.addTab.createDelegate(this, ['Users', 'Пользователи', 'Users'])},
	            {text: 'Группы', iconCls: 'userGroup', handler: this.addTab.createDelegate(this, ['UserGroups', 'Группы пользователей', 'UserGroups'])}
        	]
	    });

	    var organizationMenu = new Ext.menu.Menu({
        	items: [
        	    {text: 'Страны', iconCls: 'world', handler: this.addTab.createDelegate(this, ['Countries', 'Страны', 'Countries'])},
				{text: 'Города', iconCls: 'building', handler: this.addTab.createDelegate(this, ['Cities', 'Города', 'Cities'])},
				{text: 'Комбинаты', iconCls: 'server', handler: this.addTab.createDelegate(this, ['Factories', 'Комбинаты', 'Factories'])},
				{text: 'РЦ', iconCls: 'outArrows', handler: this.addTab.createDelegate(this, ['DC', 'РЦ', 'DC'])},
				{text: 'Филиалы', iconCls: 'book_addresses', handler: this.addTab.createDelegate(this, ['Affiliates', 'Филиалы', 'Affiliates'])},
				{text: 'Продукция', iconCls: 'product', menu: productMenu},
				{text: 'Транспорт', iconCls: 'lorry', menu: trafficMenu},
				{text: 'Сотрудники', iconCls: 'user_suit', menu: usersMenu}
        	]
	    });
	    
	    var settingsMenu = new Ext.menu.Menu({
        	items: [
            	{text: 'Организация компании', iconCls: 'organization', menu: organizationMenu},
            	{text: 'Единицы измерения', iconCls: 'measure', menu: measureMenu},
            	{text: 'Клиенты', iconCls: 'user_suit', handler: this.addTab.createDelegate(this, ['Clients', 'Клиенты', 'Clients'])},
            	{text: 'Системные настройки', iconCls: 'cog', handler: this.addTab.createDelegate(this, ['Settings', 'Системные настройки', 'Settings'])}
        	]
	    });
	    
		return new Ext.Panel({
			id: this.id + '-north-panel',
        	margins: '5 5 5 5', region: 'north', /*height: 112, */autoScroll:true, title: false,
        	bbar:[
        	    {text: 'Товарооборот', iconCls: 'incommingProducts', menu: productTrafficMenu},
        	    '-',
        	    {text: 'Склады', iconCls: 'store', menu: storeMenu},
        	    '-',
        	    {text: 'Документы', iconCls: 'report', menu: reportsMenu},
        	    '->',
	        	{text: 'Настройки', iconCls: 'settings', menu: settingsMenu},
	        	'-',
	        	{text: 'Выход', iconCls: 'logout', handler: function(){document.location.href = site_base_url + '/admin/logout';}}
        	]
    	});
	},
	
	openFullReport: function(id, title, titleTooltip){
		window.open(site_base_url + 'admin/report', '_blank', 'toolbar=0,location=0,menubar=0');
	},
	
	getCenterPanel: function(){
		var obj = new Schedro.DcRemainders();
		
		return new Ext.TabPanel({
			id: this.id + '-center-panel',
        	resizeTabs:true,  margins: '0 5 5 5', region: 'center', 
	        minTabWidth: 115, tabWidth:165,
    	    activeItem: 0, enableTabScroll:true,
        	defaults: {autoScroll:true},
        	items: [
				{xtype:'panel', id: 'DcRemainders', title: 'РЦ &raquo; Остатки', tooltip: 'РЦ &raquo; Остатки', bodyStyle: 'padding: 5px;', layout: 'fit',  items: obj.getItemsInPanel()}
        	],
	        plugins: new Ext.ux.TabCloseMenu()        	
    	});
	},
	
	addTab: function(id, tabTitle, tabTitleTooltip){
		if(Ext.isFunction(Schedro[id])){
			var obj = new Schedro[id];
			var cmp = Ext.getCmp(this.id + '-center-panel');
			
			if(null == cmp.findById(id)) {
				var items = obj.getItemsInPanel();
				cmp.add({title: tabTitle, tooltip: tabTitleTooltip, id: id, bodyStyle: 'padding: 5px;', items: items, closable:true, layout: 'fit'}).show();
		        cmp.doLayout(true);
			} else {
				cmp.setActiveTab(id);
			}
			obj.preparePage();
		} else {
			this.showSysErr();
		}
	}
});
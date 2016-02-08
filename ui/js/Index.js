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
			items: [this.getNortPanel(), /*this.getWestPanel(),*/ this.getCenterPanel()], 
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
		return new Ext.Panel({
			id: this.id + '-north-panel',
        	margins: '5 5 5 5', region: 'north', height: 112, autoScroll:true, title: false,
        	bbar:[
        	    '->',
	        	{text: 'Выход', iconCls: 'logout', handler: function(){document.location.href = site_base_url + '/logout';}}
        	]
    	});
	},
	
	getCenterPanel: function(){
		var obj = new Schedro.ProductStored();
		
		return new Ext.TabPanel({
			id: this.id + '-center-panel',
        	resizeTabs:true,  margins: '0 5 5 5', region: 'center', 
	        minTabWidth: 115, tabWidth:165,
    	    activeItem: 0, enableTabScroll:true,
        	defaults: {autoScroll:true},
        	items: [
				{xtype:'panel', id: 'ProductStored', title: 'Склад', tooltip: 'Склад', bodyStyle: 'padding: 5px;', layout: 'fit',  items: obj.getItemsInPanel()}
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
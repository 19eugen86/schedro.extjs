Schedro.FactoryStored = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.FactoryStored.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.FactoryStored, Schedro.Functions, {
	grid: null,
	form: null,
	dlg: null,
	pageSize: 20,
	smallPageSize: 10,
	
	/**
	 * Function buildContent
	 * Build page content
	 */
	buildContent: function(){
		var r = Ext.data.Record.create([
			{name: 'id', type: 'int'}, {name: 'products_part'}, {name: 'product_title'},
			{name: 'quantity'}, {name: 'measure_title'},
			{name: 'group_title'}, {name: 'factory_title'}, {name: 'datetime'},
			{name: 'date_formated'}, {name: 'user'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsFactored'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });
		
		var filters = new Ext.ux.grid.GridFilters({
	  		filters:[
 	  		    {type: 'date', dataIndex: 'date_formated'},
	  		    {type: 'string', dataIndex: 'products_part'},
	    		{type: 'string', dataIndex: 'product_title'},
	    		{type: 'string', dataIndex: 'measure_title'},
	    		{type: 'string', dataIndex: 'group_title'},
	    		{type: 'string', dataIndex: 'factory_title'},
	    		{type: 'string', dataIndex: 'user'}
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			csm,
			{header: 'Дата', dataIndex: 'date_formated', sortable: true},
			{header: 'Партия', dataIndex: 'products_part', sortable: true},
			{header: 'Продукт', dataIndex: 'product_title', width: 130, sortable: true},
			{header: 'Количество', dataIndex: 'quantity', sortable: true},
			{header: 'Ед. измерения', dataIndex: 'measure_title', sortable: true},
			{header: 'Группа', dataIndex: 'group_title', sortable: true},
			{header: 'Комбинат', dataIndex: 'factory_title', sortable: true},
			{header: 'Кладовщик', dataIndex: 'user', sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [filters],
			title: 'Комбинаты &raquo; Приход', buttonsAlign: 'right', frame:true,
			listeners: {
				'render': function(){
					ds.load({params: {start: 0, limit: this.pageSize}});
				}, scope: this
			}
		});
		
	    ds.on('load', this.getSelector, this.grid, true);
	    this.grid.on('click', this.getSelector, this.grid, true);
	},
	
	/**
	 * Function getItemsInPanel
	 * get UI located in this panel
	 * @return {Array} cArray of UI components
	 */
	getItemsInPanel: function(){
		return [this.grid];
	},
	
	/**
	 * Function preparePage
	 * Prepare page after showing
	 */
	preparePage: function(){
//		this.reloadGrid();
	},
	
	/**
	 * Function reloadGrid
	 * reload grid
	 */
	reloadGrid: function(){
		this.grid.getStore().load({
			params: {start:0, limit: this.pageSize},
			callback: function(records, options, success){
				if(records.length < 1){
					this.grid.getStore().removeAll();
				}
			},
			scope: this
		});
	},
	
	updateGrid: function(response){
		if(!this.showErrors(response)){
			if(this.dlg)this.dlg.close();
			this.reloadGrid();
		}
	}
});
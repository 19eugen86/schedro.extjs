Schedro.DcStored = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.DcStored.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.DcStored, Schedro.Functions, {
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
			{name: 'group_title'}, {name: 'from_title'}, {name: 'to_title'}, {name: 'datetime'},
			{name: 'date_formated'}, {name: 'user'}, {name: 'status'}, {name: 'status_ru'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcStored'}),
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
	    		{type: 'string', dataIndex: 'from_title'},
	    		{type: 'string', dataIndex: 'to_title'},
	    		{type: 'string', dataIndex: 'user'},
	    		{type: 'string', dataIndex: 'status_ru'},
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel({
			listeners: {
		        'rowselect' : {
		            fn: function(sm) {
						if (sm.hasSelection()) {
		                    var selected = sm.getSelected();
		                    if (selected.get('status') == "shipped") {
		                    	Ext.getCmp('dcStoredBtnEdit').show();
		                    	Ext.getCmp('dcStoredBtnConfirm').show();
		                    }
		                }
		            }
		            ,scope: this
		        },
		        'rowdeselect' : {
		        	fn: function(sm) {
		        		Ext.getCmp('dcStoredBtnEdit').hide();
		        		Ext.getCmp('dcStoredBtnConfirm').hide();
		            }
		        }
		    }
		});
		
		var cm = new Ext.grid.ColumnModel([
			csm,
			{header: 'Дата', dataIndex: 'date_formated', sortable: true},
			{header: 'Партия', dataIndex: 'products_part', sortable: true},
			{header: 'Продукт', dataIndex: 'product_title', width: 130, sortable: true},
			{header: 'Количество', dataIndex: 'quantity', sortable: true},
			{header: 'Ед. измерения', dataIndex: 'measure_title', sortable: true},
			{header: 'Откуда', dataIndex: 'from_title', sortable: true},
			{header: 'Куда', dataIndex: 'to_title', sortable: true},
			{header: 'Группа', dataIndex: 'group_title', sortable: true},
			{header: 'Кладовщик', dataIndex: 'user', sortable: true},
			{header: 'Статус', dataIndex: 'status_ru', sortable: true}
		]);
		
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {
				getRowClass: function(record) {
		        	var rowClassName = '';
		        	if (record.get('status') == "shipped") {
		        		rowClassName = 'yellow-row';
		        	}
		        	if (record.get('status') == "arrived") {
		        		rowClassName = 'blue-row';
		        	}
		        	if (record.get('status') == "in_progress") {
		        		rowClassName = 'green-row';
		        	}
		        	return rowClassName;
		    	},
		    	stripeRows: false,
				scrollOffset: 0,
				forceFit: true
			},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [filters],
	        buttons:[{
		        	text: 'Редактировать', id: 'dcStoredBtnEdit', selection: '1',
		        	handler: this.showDialog.createDelegate(this, ['edit']), scope: this,
		        	listeners: {
				        'beforerender' : {
				            fn: function(sm) {
	        					Ext.getCmp('dcStoredBtnEdit').hide();
				            }
				        }
				    }
	        	},{
	        		text: 'Принять', id: 'dcStoredBtnConfirm', selection: '1',
	        		handler: this.receiveRequest, scope: this,
	        		listeners: {
				        'beforerender' : {
				            fn: function(sm) {
	        					Ext.getCmp('dcStoredBtnConfirm').hide();
				            }
				        }
				    }
	        	},{
	        		text: 'Экспорт', selection: 'N',
	        		handler: this.exportRequest.createDelegate(this), scope: this
	        	}
  			],
			title: 'РЦ &raquo; Приход', buttonsAlign: 'right', frame:true,
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
	},
	
	/**
	 * Function deleteRequest
	 * Call if delete button was clicked
	 */	
	receiveRequest: function(){
		var dshow_fn = function(btn){
			if('yes' == btn){
				var sm = this.grid.getSelectionModel();
				if(sm.hasSelection()){
					var ids = [];
					var sels = sm.getSelections();
					for(var i=0, l = sels.length; i<l; i++){
						ids.push(sels[i].id);
					}
					
					Ext.Ajax.request({
	            		url: site_base_url + 'admin/tracking',
	        		    params: {
							'cmd': 'updateStatus',
							'ids': Ext.encode(ids),
							'status': 'arrived'
						},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Принять', msg: 'Вы уверены, что хотите принять выбранные позиции?', fn: dshow_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},
	
	showDialog: function(mode){
		this.showSysErr();
//		var title = 'Редактирование';
//		var cancel = function (){
//			this.dlg.close();
//		}
	},
	
	exportRequest: function(){
		this.showSysErr();
	}
});
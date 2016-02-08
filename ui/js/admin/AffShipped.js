Schedro.AffShipped = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.AffShipped.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.AffShipped, Schedro.Functions, {
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
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsAffShipped'}),
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
	    		{type: 'string', dataIndex: 'status_ru'}
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel({
			listeners: {
		        'rowselect' : {
		            fn: function(sm) {
						if (sm.hasSelection()) {
		                    var selected = sm.getSelected();
		                    if (selected.get('status') == "in_progress") {
		                    	Ext.getCmp('affShippedBtnEdit').show();
		                    	Ext.getCmp('affShippedBtnConfirm').show();
		                    	Ext.getCmp('affShippedBtnDelete').show();
		                    }
		                }
		            }
		            ,scope: this
		        },
		        'rowdeselect' : {
		        	fn: function(sm) {
		        		Ext.getCmp('affShippedBtnEdit').hide();
		        		Ext.getCmp('affShippedBtnConfirm').hide();
		        		Ext.getCmp('affShippedBtnDelete').hide();
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
	        		text: 'Редактировать', id: 'affShippedBtnEdit', selection: '1',
	        		handler: this.showDialog.createDelegate(this, ['edit']), scope: this,
	        		listeners: {
	        			'beforerender' : {
	        				fn: function(sm) {
	        					Ext.getCmp('affShippedBtnEdit').hide();
	        				}
	        			}
	        		}
	        	},{
	        		text: 'Отправить', id: 'affShippedBtnConfirm', selection: 'N',
	        		handler: this.shipRequest, scope: this,
	        		listeners: {
				        'beforerender' : {
				            fn: function(sm) {
	        					Ext.getCmp('affShippedBtnConfirm').hide();
				            }
				        }
				    }
	        	},{
	        		text: 'Удалить', id: 'affShippedBtnDelete', selection: '1',
	        		handler: this.deleteRequest, scope: this,
	        		listeners: {
				        'beforerender' : {
				            fn: function(sm) {
	        					Ext.getCmp('affShippedBtnDelete').hide();
				            }
				        }
				    }
	        	},{
	        		text: 'Экспорт', selection: 'N',
	        		handler: this.exportRequest.createDelegate(this), scope: this
	        	}
			],
			title: 'Филиалы &raquo; Расход', buttonsAlign: 'right', frame:true,
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
	 * Function shipRequest
	 * Call if delete button was clicked
	 */	
	shipRequest: function(){
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
							'status': 'shipped'
						},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Отправить', msg: 'Вы уверены, что хотите отправить выбранные позиции?', fn: dshow_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},

	/**
	 * Function deleteRequest
	 * Call if delete button was clicked
	 */	
	deleteRequest: function(){
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
							'cmd': 'delete',
							'ids': Ext.encode(ids)
						},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранные позиции?', fn: dshow_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},
	
	/**
	 * Function showDialog
	 * Show add/edit dlg
	 * @param {String} mode
	 */
	showDialog: function(mode){
		var title = 'Редактирование';
		
		var cancel = function (){
			this.dlg.close();
		}
		
		var saveData = function(){
			var ship_fn = function() {
				var f = this.form.getForm();
				if(f.isValid()){
					var params = f.getValues();
					Ext.Ajax.request({url: site_base_url + 'admin/tracking', params: params, success: this.updateGrid, scope: this});
				}
			}
			Ext.Msg.show({
				title: 'Подтверждение', msg: 'Все верно? Сохраняем?', fn: ship_fn,
				scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
			});
		}
		
		/////////////////////////////////////////////////////////////////////////////////////////////
		// BEGIN: Все комбобоксы для окна отгрузки
		//
		// Список партий выбранной продукции
		var productPartsOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Партия',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsAffRemainders'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'products_part']
	        	),
	        	baseParams: {cmd: 'getAvailableParts'},
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[products_part]').setValue(cmp.getValue());
				}, scope: this
            },
            valueField:'products_part', displayField: 'products_part', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[products_part]', allowBlank: false,
            listWidth: 300, width: 100,
		});
		
		// Список продуктов
		var productOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Продукт',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsAffRemainders'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
	        	baseParams: {cmd: 'getAvailableProducts'},
                remoteSort: true
            }),
            listeners: {
				'select': function(cmp){
					shipForm.getForm().findField('f[product_id]').setValue(cmp.getValue());
					
					productPartsOutCmb.clearValue();
					productPartsOutCmb.getStore().setBaseParam('product_id', cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[product_title]', allowBlank: false
		});
		
		// Список товарных групп
		var productGroupOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Товарная группа',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsAffRemainders'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
	        	baseParams: {cmd: 'getAvailableGroups'},
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[group_id]').setValue(cmp.getValue());
					
					productOutCmb.clearValue();
					productOutCmb.getStore().setBaseParam('group_id', cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[group_title]', allowBlank: false
		});
		
		// Список филиалов
		var affOutCmb = new Ext.form.ComboBox({
			loadingText: 'Пожалуйста подождите... ', emptyText: 'Филиал',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/affiliates'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[from_id]').setValue(cmp.getValue());
					
					productOutCmb.clearValue();
					productOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
					
					productGroupOutCmb.clearValue();
					productGroupOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
					
					productPartsOutCmb.clearValue();
					productPartsOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[from_title]', allowBlank: false
		});
		
		// Список единиц измерения
		var measureOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Ед. измерения',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/measures'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'short_title']
	        	),
	        	baseParams: {cmd: 'getVisible'},
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[measure_id]').setValue(cmp.getValue());
				}, scope: this
            },
            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[measure_short_title]', allowBlank: false
		});
		
		// Список получателей в зависимости от направления отправки
		var recipientsOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Кому',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/recipients'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
	        	baseParams: {cmd: 'getRecipient'},
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[to_id]').setValue(cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[to_title]', allowBlank: false
		});
		
		// Список направлений отправки
		var directionsOutCmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ', emptyText: 'Куда',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/directions'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title', 'direction_key']
	        	),
	        	baseParams: {cmd: 'getDirections_A'},
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
					shipForm.getForm().findField('f[direction]').setValue(cmp.getValue());
					
					recipientsOutCmb.clearValue();
					recipientsOutCmb.getStore().setBaseParam('direction_selected', cmp.getValue());
            	}, scope: this
            },
            valueField:'direction_key', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[direction_title]', allowBlank: false,
            listWidth: 300, width: 100
		});
		//
		// END: Все комбобоксы для окна отгрузки
		/////////////////////////////////////////////////////////////////////////////////////////////

		var shipForm = new Ext.FormPanel({
		    url: '', defaultType: 'textfield',  width: 1022, labelWidth: 100,
			frame: true, title: false,
			items: [{
				xtype: 'container',
				anchor: '100%',
				layout:'column', 
				items:[
				       {xtype: 'hidden', name: 'cmd', value: mode},
				       {xtype: 'hidden', name: 'f[from_id]'},
				       {xtype: 'hidden', name: 'f[group_id]'},
				       {xtype: 'hidden', name: 'f[product_id]'},
				       {xtype: 'hidden', name: 'f[measure_id]'},
				       {xtype: 'hidden', name: 'f[direction]'},
				       {xtype: 'hidden', name: 'f[to_id]'},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [affOutCmb]},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px; 0px', layout: 'anchor', items: [productGroupOutCmb]},
				       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productOutCmb]},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [productPartsOutCmb]},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[quantity]', allowBlank: false, anchor:'100%'}]},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [measureOutCmb]},
				       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [directionsOutCmb]},
				       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [recipientsOutCmb]}
				]
			}]
		});
		this.form = shipForm;

		this.dlg = new Ext.Window({
			title: title, width: 1034,
			autoHeight: true, closable: true, bodyBorder: false, border: false,
            draggable: true, plain:true, modal: true, resizable: false,
            items: [this.form],
			buttons: [
				{text: 'Сохранить', handler: saveData, scope: this},
				{text: 'Отмена', handler: cancel, scope: this}
			],
			buttonAlign: 'center'
		});
		this.dlg.show();
		
		// TODO: Убрать
		this.showSysErr();
		
		var sm = this.grid.getSelectionModel();
		if(sm.hasSelection()){
			Ext.Ajax.request({
           		url: site_base_url + 'admin/tracking',
	               params: {'cmd': 'get', 'id': sm.getSelected().id},
	               success: function(response){
	               	this.setValues(response);
	                	
	               	var data = Ext.decode(response.responseText);
	               	productPartsOutCmb.getStore().setBaseParam('product_id', data.product_id);
	               	productOutCmb.getStore().setBaseParam('group_id', data.group_id);
	               	productOutCmb.getStore().setBaseParam('aff_id', data.from_id);
					productGroupOutCmb.getStore().setBaseParam('aff_id', data.from_id);
					productPartsOutCmb.getStore().setBaseParam('aff_id', data.from_id);
	               	recipientsOutCmb.getStore().setBaseParam('direction_selected', data.direction);
	               	
	               	if(data.from_cell_id > 0){
	               		productPartsOutCmb.getStore().setBaseParam('from_cell_id', data.from_cell_id);
	               		productOutCmb.getStore().setBaseParam('from_cell_id', data.from_cell_id);
	               		productGroupOutCmb.getStore().setBaseParam('from_cell_id', data.from_cell_id);
	               	}
	            },
	            scope: this
			});
		}
	},
	
	exportRequest: function(){
		this.showSysErr();
	}
});
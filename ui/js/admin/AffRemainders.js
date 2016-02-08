Schedro.AffRemainders = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.AffRemainders.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.AffRemainders, Schedro.Functions, {
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
			{name: 'id', type: 'int'}, {name: 'products_part'}, {name: 'product_title'}, {name: 'remainder'}, 
			{name: 'place_title'}, {name: 'group_title'}, {name: 'date_formated'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsAffRemainders'}),
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
	    		{type: 'string', dataIndex: 'remainder'},
	    		{type: 'string', dataIndex: 'place_title'},
	    		{type: 'string', dataIndex: 'group_title'}
			]
		});
		
		var cm = new Ext.grid.ColumnModel([
			{header: 'Последнее обновление', dataIndex: 'date_formated', sortable: true},
			{header: '№ партии', dataIndex: 'products_part', sortable: true},
			{header: 'Продукт', dataIndex: 'product_title', width: 130, sortable: true},
			{header: 'Остаток (кг)', dataIndex: 'remainder', sortable: true},
			{header: 'Филиал', dataIndex: 'place_title', sortable: true},
			{header: 'Группа', dataIndex: 'group_title', sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: false,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [filters],
	        buttons:[
				{text: 'Разнести по камерам', selection: '0', handler: this.showDialog.createDelegate(this, ['toCells']), scope: this},
				{text: 'Отправить', selection: '0', handler: this.showDialog.createDelegate(this, ['ship']), scope: this}
			],
			title: 'Доступная продукция на филиалах', buttonsAlign: 'right', frame:true,
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
	
	/**
	 * Function showDialog
	 * Show add/edit dlg
	 * @param {String} mode
	 */
	showDialog: function(mode){
		var cancel = function (){
			this.dlg.close();
		}
		
		var fieldsCounter = 0;

		if (mode == 'toCells') {
			var title = 'Разнесение по камерам';
			
			var saveData = function(){
				var ship_fn = function() {
					var f = this.form.getForm();
					if(f.isValid()){
						var params = f.getValues();
						Ext.Ajax.request({url: site_base_url + 'admin/productsAffShipped', params: params, success: this.updateGrid, scope: this});
					}
				}
				Ext.Msg.show({
					title: 'Подтверждение', msg: 'Все верно?', fn: ship_fn,
					scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
				});
			}
			
			/////////////////////////////////////////////////////////////////////////////////////////////
			// BEGIN: Все комбобоксы
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
						shipForm.getForm().findField(cmp.getName()).setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'products_part', displayField: 'products_part', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][products_part]', allowBlank: false,
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
						var fieldName = cmp.getName().replace('product_title', 'product_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('product_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('group_title', 'group_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('group_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('aff_title', 'aff_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
						productGroupOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
						storesCmb.getStore().setBaseParam('aff_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][aff_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('measure_short_title', 'measure_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: false
			});
			
			// Список камер
			var cellsCmb = new Ext.form.ComboBox({
				loadingText: 'Пожалуйста подождите... ', emptyText: 'Камера',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/cells'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
		        	baseParams: {cmd: 'getAvailableAffStoreCells'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('aff_cell_title', 'aff_cell_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][aff_cell_title]', allowBlank: false
			});
			
			// Список складов
			var storesCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Склад',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/stores'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
		        	baseParams: {cmd: 'getAffStores'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('aff_store_title', 'aff_store_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						cellsCmb.getStore().setBaseParam('aff_store_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][aff_store_title]', allowBlank: false
			});
			//
			// END: Все комбобоксы
			/////////////////////////////////////////////////////////////////////////////////////////////
	
			var shipForm = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 1022, labelWidth: 100,
				frame: true, title: false,
				items: [{
					xtype: 'container',
					anchor: '100%',
					layout:'column', 
					items:[
					       {xtype: 'hidden', name: 'cmd', value: mode},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_store_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_cell_id]'},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [affOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px; 0px', layout: 'anchor', items: [productGroupOutCmb]},
					       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [productPartsOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: true, anchor:'100%'}]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [measureOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [storesCmb]},
					       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [cellsCmb]}
					]
				}]
			});
			this.form = shipForm;
	
			dialogWin = new Ext.Window({
				title: title, width: 1034,
				autoHeight: true, closable: true, bodyBorder: false, border: false,
	            draggable: true, plain:true, modal: true, resizable: false,
	            addField: function(){
					fieldsCounter = fieldsCounter + 1;
	
					//////////////////////////////////////////////////////////////////////////////////////////////
					// BEGIN: Все склонированные комбобоксы для окна отгрузки
					//
					// Склонированный список партий выбранной продукции
					var productPartsOutCmbCloned = productPartsOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][products_part]', allowBlank: true
					});
					
					// Склонированный список продуктов
					var productOutCmbCloned = productOutCmb.cloneConfig({
			            listeners: {
						'select': function(cmp){
								var fieldName = cmp.getName().replace('product_title', 'product_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productPartsOutCmbCloned.getStore().setBaseParam('product_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: true
		            });
					
					// Склонированный список товарных групп
					var productGroupOutCmbCloned = productGroupOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('group_title', 'group_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productOutCmbCloned.getStore().setBaseParam('group_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: true
					});
					
					// Склонированный список филиалов
					var affOutCmbCloned = affOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('aff_title', 'aff_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
								productGroupOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
								productPartsOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
								storesCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][aff_title]', allowBlank: true
					});
	
					// Склонированный список единиц измерения
					var measureOutCmbCloned = measureOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: true
					});
					
					// Склонированный список камер
					var cellsCmbCloned = cellsCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][aff_cell_title]', allowBlank: true
					});
					
					// Склонированный список складов
					var storesCmbCloned = storesCmb.cloneConfig({
						listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('aff_store_title', 'aff_store_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								cellsCmbCloned.getStore().setBaseParam('aff_store_id', cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][aff_store_title]', allowBlank: true
					});
					//
					// END: Все склонированные комбобоксы для окна отгрузки
					//////////////////////////////////////////////////////////////////////////////////////////////
					
					shipForm.add({
						xtype: 'container',
						anchor: '100%',
						layout:'column', 
						items:[
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_store_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_cell_id]'},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [affOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px; 0px', layout: 'anchor', items: [productGroupOutCmbCloned]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [productPartsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [measureOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [storesCmbCloned]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [cellsCmbCloned]}
						]
					});
					this.doLayout();
				},
	            items: [this.form],
				buttons: [
					{text: 'Отправить', handler: saveData, scope: this},
					{text: 'Отмена', handler: cancel, scope: this},
					{text: 'Добавить строку', handler: function(){dialogWin.addField();}, scope: this}
				],
				buttonAlign: 'center'
			});
		} else {
			var title = 'Отправка продукции';
			
			var saveData = function(){
				var ship_fn = function() {
					var f = this.form.getForm();
					if(f.isValid()){
						var params = f.getValues();
						Ext.Ajax.request({url: site_base_url + 'admin/productsAffShipped', params: params, success: this.updateGrid, scope: this});
					}
				}
				Ext.Msg.show({
					title: 'Подтверждение отправки', msg: 'Все верно? Отправляем?', fn: ship_fn,
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
						shipForm.getForm().findField(cmp.getName()).setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'products_part', displayField: 'products_part', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][products_part]', allowBlank: false,
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
						var fieldName = cmp.getName().replace('product_title', 'product_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('product_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('group_title', 'group_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('group_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('aff_title', 'aff_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
						productGroupOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('aff_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][aff_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('measure_short_title', 'measure_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('recipient_title', 'recipient_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][recipient_title]', allowBlank: false
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
						var fieldName = cmp.getName().replace('direction_title', 'direction');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						recipientsOutCmb.getStore().setBaseParam('cmd', 'getRecipient');
						recipientsOutCmb.getStore().setBaseParam('direction_selected', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'direction_key', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][direction_title]', allowBlank: false,
	            listWidth: 300, width: 100
			});
			//
			// END: Все комбобоксы для окна отгрузки
			/////////////////////////////////////////////////////////////////////////////////////////////
	
			var shipForm = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 1022, labelWidth: 100,
				frame: true, title: false,
				items: [{
					xtype: 'container',
					anchor: '100%',
					layout:'column', 
					items:[
					       {xtype: 'hidden', name: 'cmd', value: mode},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][direction]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][recipient_id]'},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [affOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px; 0px', layout: 'anchor', items: [productGroupOutCmb]},
					       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [productPartsOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [measureOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [directionsOutCmb]},
					       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [recipientsOutCmb]}
					]
				}]
			});
			this.form = shipForm;
	
			dialogWin = new Ext.Window({
				title: title, width: 1034,
				autoHeight: true, closable: true, bodyBorder: false, border: false,
	            draggable: true, plain:true, modal: true, resizable: false,
	            addField: function(){
					fieldsCounter = fieldsCounter + 1;
	
					//////////////////////////////////////////////////////////////////////////////////////////////
					// BEGIN: Все склонированные комбобоксы для окна отгрузки
					//
					// Склонированный список партий выбранной продукции
					var productPartsOutCmbCloned = productPartsOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][products_part]', allowBlank: true
					});
					
					// Склонированный список продуктов
					var productOutCmbCloned = productOutCmb.cloneConfig({
			            listeners: {
						'select': function(cmp){
								var fieldName = cmp.getName().replace('product_title', 'product_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productPartsOutCmbCloned.getStore().setBaseParam('product_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: true
		            });
					
					// Склонированный список товарных групп
					var productGroupOutCmbCloned = productGroupOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('group_title', 'group_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productOutCmbCloned.getStore().setBaseParam('group_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: true
					});
					
					// Склонированный список филиалов
					var affOutCmbCloned = affOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('aff_title', 'aff_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
								productGroupOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
								productPartsOutCmbCloned.getStore().setBaseParam('aff_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][aff_title]', allowBlank: true
					});
	
					// Склонированный список единиц измерения
					var measureOutCmbCloned = measureOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: true
					});
					
					// Склонированный список получателей в зависимости от направления отправки
					var recipientsOutCmbCloned = recipientsOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][recipient_title]', allowBlank: true
					});
					
					// Склонированный список направлений отправки
					var directionsOutCmbCloned = directionsOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('direction_title', 'direction');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
			            		recipientsOutCmbCloned.getStore().setBaseParam('cmd', 'getRecipient');
			            		recipientsOutCmbCloned.getStore().setBaseParam('direction_selected', cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][direction_title]', allowBlank: true
					});
					//
					// END: Все склонированные комбобоксы для окна отгрузки
					//////////////////////////////////////////////////////////////////////////////////////////////
					
					shipForm.add({
						xtype: 'container',
						anchor: '100%',
						layout:'column', 
						items:[
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][aff_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][direction]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][recipient_id]'},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [affOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px; 0px', layout: 'anchor', items: [productGroupOutCmbCloned]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [productPartsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [measureOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [directionsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [recipientsOutCmbCloned]}
						]
					});
					this.doLayout();
				},
	            items: [this.form],
				buttons: [
					{text: 'Отправить', handler: saveData, scope: this},
					{text: 'Отмена', handler: cancel, scope: this},
					{text: 'Добавить строку', handler: function(){dialogWin.addField();}, scope: this}
				],
				buttonAlign: 'center'
			});
		}
		this.dlg = dialogWin;
		this.dlg.show();
	},
	
	updateGrid: function(response){
		if(!this.showErrors(response)){
			if(this.dlg)this.dlg.close();
			this.reloadGrid();
		}
	}
});
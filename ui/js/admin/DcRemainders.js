Schedro.DcRemainders = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.DcRemainders.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.DcRemainders, Schedro.Functions, {
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
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
//			baseParams: {cmd: 'getAvailable'},
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
			{header: 'РЦ', dataIndex: 'place_title', sortable: true},
			{header: 'Группа', dataIndex: 'group_title', sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: false,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [filters],
	        buttons:[
	            {text: 'Принять произведенную продукцию', selection: '0', handler: this.showDialog.createDelegate(this, ['addOnDc']), scope: this},
	            {text: 'Разнести по камерам', selection: '0', handler: this.showDialog.createDelegate(this, ['toCells']), scope: this},
	            {text: 'Отправить', selection: '0', handler: this.showDialog.createDelegate(this, ['ship']), scope: this}
			],
			title: 'Доступная продукция на РЦ', buttonsAlign: 'right', frame:true,
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
		if ('ship' == mode) {
			var title = 'Отправка продукции';
			
			var saveData = function(){
				var ship_fn = function() {
					var f = this.form.getForm();
					if(f.isValid()){
						var params = f.getValues();
						Ext.Ajax.request({url: site_base_url + 'admin/productsDcShipped', params: params, success: this.updateGrid, scope: this});
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
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
	            listWidth: 300, width: 50,
			});
			
			// Список продуктов
			var productOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Продукт',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			// Список товарных групп
			var productGroupOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Товарная группа',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			// Список РЦ
			var dcOutCmb = new Ext.form.ComboBox({
				fieldLabel: '<span class="required">*</span> РЦ', loadingText: 'Пожалуйста, подождите... ', emptyText: 'Пожалуйста, выберите РЦ...',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dc'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						shipForm.getForm().findField('f[dc_id]').setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
						productGroupOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[dc_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			// Список единиц измерения
			var measureOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Ед. измер.',
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
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: false,
	            listWidth: 300, width: 50
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
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][recipient_title]', allowBlank: false,
	            listWidth: 300, width: 50
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
		        	baseParams: {cmd: 'getDirections_D'},
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
	            listWidth: 300, width: 50
			});
			
			// Список водителей
			var carriersDriversOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Водитель',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/carriersDrivers'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'fullname']
		        	),
		        	baseParams: {cmd: 'getGrouped'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('carrier_driver_title', 'carrier_driver_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'fullname', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][carrier_driver_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			// Список автомобилей
			var carriersVehiclesOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Автомобиль',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/carriersVehicles'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
		        	baseParams: {cmd: 'getGrouped'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('carrier_vehicle_title', 'carrier_vehicle_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][carrier_vehicle_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			// Список перевозчиков
			var carriersOutCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Перевозчик',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/carriers'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('carrier_title', 'carrier_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						carriersDriversOutCmb.getStore().setBaseParam('carrier_id', cmp.getValue());
						carriersVehiclesOutCmb.getStore().setBaseParam('carrier_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][carrier_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			//
			// END: Все комбобоксы для окна отгрузки
			/////////////////////////////////////////////////////////////////////////////////////////////
	
			var shipForm = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 1052, labelWidth: 35,
				frame: true, title: false,
				items: [dcOutCmb, {
					xtype: 'container',
					anchor: '100%',
					layout:'column', 
					items:[
					       {xtype: 'hidden', name: 'cmd', value: mode},
					       {xtype: 'hidden', name: 'f[dc_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][direction]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][recipient_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_driver_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_vehicle_id]'},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productGroupOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productPartsOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Кол-во', width: 50, name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [measureOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [directionsOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [recipientsOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [carriersOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [carriersVehiclesOutCmb]},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [carriersDriversOutCmb]}
					]
				}]
			});
			this.form = shipForm;
	
			dialogWin = new Ext.Window({
				title: title, width: 1064,
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
					
					// Склонированный список водителей
					var carriersDriversOutCmbCloned = carriersDriversOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('carrier_driver_title', 'carrier_driver_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][carrier_driver_title]', allowBlank: true
			        });
					
					// Склонированный список автомобилей
					var carriersVehiclesOutCmbCloned = carriersVehiclesOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('carrier_vehicle_title', 'carrier_vehicle_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][carrier_vehicle_title]', allowBlank: true
			        });
					
					// Склонированный список перевозчиков
					var carriersOutCmbCloned = carriersOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('carrier_title', 'carrier_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								carriersDriversOutCmbCloned.getStore().setBaseParam('carrier_id', cmp.getValue());
								carriersVehiclesOutCmbCloned.getStore().setBaseParam('carrier_id', cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][carrier_title]', allowBlank: true
			        });
					//
					// END: Все склонированные комбобоксы для окна отгрузки
					//////////////////////////////////////////////////////////////////////////////////////////////
					
					shipForm.add({
						xtype: 'container',
						anchor: '100%',
						layout:'column', 
						items:[
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][direction]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][recipient_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_driver_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][carrier_vehicle_id]'},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productGroupOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productPartsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Кол-во', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [measureOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [directionsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [recipientsOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [carriersOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [carriersVehiclesOutCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [carriersDriversOutCmbCloned]}
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
		} else if (mode == 'addOnDc') {
			var title = 'Принять на склад';
			
			var saveData = function(){
				var f = this.form.getForm();
				if(f.isValid()){
					var params = f.getValues();
					Ext.Ajax.request({url: site_base_url + 'admin/productsFactored', params: params, success: this.updateGrid, scope: this});
				}
			}

			// Список продуктов
			var productInCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Продукт',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/products'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
					'select': function(cmp){
						var fieldName = cmp.getName().replace('product_title', 'product_id');
						factoryProductForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: false
			});
			
			// Список товарных групп
			var productGroupInCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Товарная группа',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productGroups'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('group_title', 'group_id');
						factoryProductForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productInCmb.getStore().setBaseParam('cmd', 'getGrouped');
						productInCmb.getStore().setBaseParam('group_selected', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: false
			});
			
			// Список единиц измерения
			var measureInCmb = new Ext.form.ComboBox({
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
						factoryProductForm.getForm().findField(fieldName).setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: false
			});
			
			// Список РЦ
			var dcInCmb = new Ext.form.ComboBox({
				fieldLabel: '<span class="required">*</span> РЦ', loadingText: 'Пожалуйста, подождите... ', emptyText: 'Пожалуйста, выберите РЦ...',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dc'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						factoryProductForm.getForm().findField('f[dc_id]').setValue(cmp.getValue());
					}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[dc_title]', allowBlank: false,
	            listWidth: 300, width: 50
			});
			
			var factoryProductForm = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 822, labelWidth: 35,
				frame: true, title: false,
				items: [dcInCmb, {
					xtype: 'container',
					anchor: '100%',
					layout:'column', 
					items:[
					       {xtype: 'hidden', name: 'cmd', value: mode},
					       {xtype: 'hidden', name: 'f[factory_id]', value: '0'},
					       {xtype: 'hidden', name: 'f[dc_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
					       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productGroupInCmb]},
						   {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productInCmb]},
						   {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', allowBlank: false, anchor:'100%'}]},
						   {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [measureInCmb]},
					       {xtype: 'container',	columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'numberfield', emptyText: 'Партия', name: 'f[products]['+fieldsCounter+'][products_part]', allowBlank: false, anchor:'100%'}]},
						   {xtype: 'container',	columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'datefield', format: 'd-m-Y', emptyText: 'Дата произв.', name: 'f[products]['+fieldsCounter+'][factored_date]', allowBlank: false, anchor:'100%'}]}
					]
				}]
			});
			this.form = factoryProductForm;
			
			var dialogWin = new Ext.Window({
				title: title, width: 834,
				autoHeight: true, closable: true, bodyBorder: false, border: false,
	            draggable: true, plain:true, modal: true, resizable: false,
	            addField: function(){
					fieldsCounter = fieldsCounter + 1;
					
					// Склонированный список продуктов
					var productInCmbCloned = productInCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][product_title]', allowBlank: true
		            });
					
					// Склонированный список товарных групп
					var productGroupInCmbCloned = productGroupInCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('group_title', 'group_id');
								factoryProductForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productInCmbCloned.getStore().setBaseParam('cmd', 'getGrouped');
								productInCmbCloned.getStore().setBaseParam('group_selected', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][group_title]', allowBlank: true
					});
					
					// Склонированный список единиц измерения
					var measureInCmbCloned = measureInCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: true
					});
					
					factoryProductForm.add({
						xtype: 'container',
						anchor: '100%',
						layout:'column', 
						items:[
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [productGroupInCmbCloned]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [productInCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'textfield', emptyText: 'Количество', name: 'f[products]['+fieldsCounter+'][quantity]', anchor:'100%'}]},
						       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [measureInCmbCloned]},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px 0px 0px;', layout: 'anchor', items: [{xtype: 'numberfield', emptyText: 'Партия', name: 'f[products]['+fieldsCounter+'][products_part]', anchor:'100%'}]},
						       {xtype: 'container',	columnWidth:.2, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'datefield', format: 'd-m-Y', emptyText: 'Дата произв.', name: 'f[products]['+fieldsCounter+'][factored_date]', allowBlank: false, anchor:'100%'}]}
						]
					});
					this.doLayout();
				},
	            items: [this.form],
				buttons: [
					{text: 'Принять', handler: saveData, scope: this},
					{text: 'Отмена', handler: cancel, scope: this},
					{text: 'Добавить строку', handler: function(){dialogWin.addField();}, scope: this}
				],
				buttonAlign: 'center'
			});
		} else if (mode == 'toCells') {
			var title = 'Разнесение по камерам';
			
			var saveData = function(){
				var ship_fn = function() {
					var f = this.form.getForm();
					if(f.isValid()){
						var params = f.getValues();
						Ext.Ajax.request({url: site_base_url + 'admin/productsDcShipped', params: params, success: this.updateGrid, scope: this});
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
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productsDcRemainders'}),
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
			
			// Список РЦ
			var dcOutCmb = new Ext.form.ComboBox({
				loadingText: 'Пожалуйста подождите... ', emptyText: 'РЦ',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dc'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('dc_title', 'dc_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						productOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
						productGroupOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
						productPartsOutCmb.getStore().setBaseParam('dc_id', cmp.getValue());
						storesCmb.getStore().setBaseParam('dc_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][dc_title]', allowBlank: false
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
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dcCells'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
		        	baseParams: {cmd: 'getAvailableDcStoreCells'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('dc_cell_title', 'dc_cell_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][dc_cell_title]', allowBlank: false
			});
			
			// Список складов
			var storesCmb = new Ext.form.ComboBox({
	            loadingText: 'Пожалуйста подождите... ', emptyText: 'Склад',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dcStores'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
		        	baseParams: {cmd: 'getDcStores'},
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
						var fieldName = cmp.getName().replace('dc_store_title', 'dc_store_id');
						shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
						cellsCmb.getStore().setBaseParam('dc_store_id', cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, name: 'f[products]['+fieldsCounter+'][dc_store_title]', allowBlank: false
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
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_store_id]'},
					       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_cell_id]'},
					       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [dcOutCmb]},
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
					var dcOutCmbCloned = dcOutCmb.cloneConfig({
			            listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('dc_title', 'dc_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								productOutCmbCloned.getStore().setBaseParam('dc_id', cmp.getValue());
								productGroupOutCmbCloned.getStore().setBaseParam('dc_id', cmp.getValue());
								productPartsOutCmbCloned.getStore().setBaseParam('dc_id', cmp.getValue());
								storesCmbCloned.getStore().setBaseParam('dc_id', cmp.getValue());
			            	}, scope: this
			            },
						name: 'f[products]['+fieldsCounter+'][dc_title]', allowBlank: true
					});
	
					// Склонированный список единиц измерения
					var measureOutCmbCloned = measureOutCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][measure_short_title]', allowBlank: true
					});
					
					// Склонированный список камер
					var cellsCmbCloned = cellsCmb.cloneConfig({
						name: 'f[products]['+fieldsCounter+'][dc_cell_title]', allowBlank: true
					});
					
					// Склонированный список складов
					var storesCmbCloned = storesCmb.cloneConfig({
						listeners: {
			            	'select': function(cmp){
								var fieldName = cmp.getName().replace('dc_store_title', 'dc_store_id');
								shipForm.getForm().findField(fieldName).setValue(cmp.getValue());
								cellsCmbCloned.getStore().setBaseParam('dc_store_id', cmp.getValue());
			            	}, scope: this
			            },
			            name: 'f[products]['+fieldsCounter+'][dc_store_title]', allowBlank: true
					});
					//
					// END: Все склонированные комбобоксы для окна отгрузки
					//////////////////////////////////////////////////////////////////////////////////////////////
					
					shipForm.add({
						xtype: 'container',
						anchor: '100%',
						layout:'column', 
						items:[
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][group_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][product_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][products_part]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][measure_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_store_id]'},
						       {xtype: 'hidden', name: 'f[products]['+fieldsCounter+'][dc_cell_id]'},
						       {xtype: 'container', columnWidth:.1, style: 'margin: 0px 2px;', layout: 'anchor', items: [dcOutCmbCloned]},
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
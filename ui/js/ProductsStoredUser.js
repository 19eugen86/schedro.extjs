Schedro.ProductStored = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.ProductStored.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.ProductStored, Schedro.Functions, {
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
			{name: 'id', type: 'int'}, {name: 'product_title'}, {name: 'quantity'}, {name: 'receipt_num'},
			{name: 'measure_title'}, {name: 'group_title'}, {name: 'datetime'}, {name: 'date_formated'},
			{name: 'alt_measures'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'storedProducts'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });
		
		var expander = new Ext.grid.RowExpander({enableCaching: false});
		
		var filters = new Ext.ux.grid.GridFilters({
	  		filters:[
	    		{type: 'string', dataIndex: 'product_title'},
	    		{type: 'string', dataIndex: 'measure_title'},
	    		{type: 'string', dataIndex: 'group_title'},
//	    		{type: 'date', dataIndex: 'date_formated'},
	    		{type: 'string', dataIndex: 'receipt_num'}
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			csm,
			expander,
			{header: 'Продукт', dataIndex: 'product_title', width: 130, sortable: true},
			{header: 'Количество', dataIndex: 'quantity', sortable: true},
			{header: 'Ед. измерения', dataIndex: 'measure_title', sortable: true},
			{header: 'Группа', dataIndex: 'group_title', sortable: true},
			{header: 'Дата прихода на склад', dataIndex: 'date_formated', sortable: true},
			{header: '№ накладной', dataIndex: 'receipt_num'}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [expander, filters],
	        buttons:[
				{text: 'Принять', selection: '0', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Отгрузить', selection: '1', handler: this.showDialog.createDelegate(this, ['ship']), scope: this}
			],
			title: 'Список продуктов', buttonsAlign: 'right', frame:true,
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
		this.reloadGrid();
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
	 * Function deleteRequest
	 * Call if delete button was clicked
	 */	
	deleteRequest: function(){
		var show_fn = function(btn){
			if('yes' == btn){
				var sm = this.grid.getSelectionModel();
				if(sm.hasSelection()){
					var ids = [];
					var sels = sm.getSelections();
					for(var i=0, l = sels.length; i<l; i++){
						ids.push(sels[i].id);
					}
					
					Ext.Ajax.request({
	            		url: site_base_url + 'storedProducts',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранные продукты?', fn: show_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
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
		
		if ('ship' == mode) {
			var title = 'Отгрузить';
			
			var saveData = function(){
				var ship_fn = function() {
					var f = this.form.getForm();
					if(f.isValid()){
						var params = f.getValues();
						Ext.Ajax.request({url: site_base_url + 'shippedProducts', params: params, success: this.updateGrid, scope: this});
					}
				}
				Ext.Msg.show({
					title: 'Подтверждение отгрузки', msg: 'Все верно? Отгружаем?', fn: ship_fn,
					scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
				});
			}
			
			this.form = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 330, labelWidth: 100,
				frame: true, title: false,
				items: [
					{xtype: 'hidden', name: 'cmd', value: mode},
					{xtype: 'hidden', name: 'f[id]'},
					{xtype: 'hidden', name: 'f[product_id]'},
					{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Продукт', name: 'f[product_title]', disabled: true, anchor:'100%'},
					{xtype: 'numberfield', fieldLabel: '<span class="required">*</span> Количество', name: 'f[quantity]', allowNegative: false, allowBlank: false, anchor:'100%'},
					{xtype: 'numberfield', fieldLabel: '<span class="required">*</span> № накладной', name: 'f[receipt_num]', allowNegative: false, allowBlank: false, anchor:'100%'},
				]
			});

			this.dlg = new Ext.Window({
				title: title, width: 342,
				autoHeight: true, closable: true, bodyBorder: false, border: false,
	            draggable: true, plain:true, modal: true, resizable: false,
	            items: [this.form],
				buttons: [
					{text: 'Отгрузить', handler: saveData, scope: this},
					{text: 'Отмена', handler: cancel, scope: this}
				],
				buttonAlign: 'center'
			});
		} else {
			var title = ('edit' == mode)?'Редактировать':'Добавить';
			
			var saveData = function(){
				var f = this.form.getForm();
				if(f.isValid()){
					var params = f.getValues();
					Ext.Ajax.request({url: site_base_url + 'storedProducts', params: params, success: this.updateGrid, scope: this});
				}
			}

			var product_cmb = new Ext.form.ComboBox({
	            fieldLabel: '<span class="required">*</span> Продукт', loadingText: 'Пожалуйста подождите... ', emptyText: 'Пожалуйста, выберите продукт...',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'products'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
					'expand': function(self){
						self.clearValue();
					},
					'select': function(cmp){
	            		this.form.getForm().findField('f[product_id]').setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, hiddenName: 'f[product_title]', allowBlank: false
			});
			
			var product_group_cmb = new Ext.form.ComboBox({
	            fieldLabel: '<span class="required">*</span> Группа', loadingText: 'Пожалуйста подождите... ', emptyText: 'Пожалуйста, выберите группу...',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'productGroups'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
	            		this.form.getForm().findField('f[group_id]').setValue(cmp.getValue());
	            		product_cmb.getStore().baseParams = {
	            			group_selected: cmp.getValue(),
	            			cmd: 'getGrouped'
	            		};
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, hiddenName: 'f[group_title]', allowBlank: false
			});
			
			var measure_cmb = new Ext.form.ComboBox({
	            fieldLabel: '<span class="required">*</span> Ед. измерения', loadingText: 'Пожалуйста подождите... ', emptyText: 'Пожалуйста, выберите ед. измерения...',
	            store: new Ext.data.Store({
		            proxy: new Ext.data.HttpProxy({url: site_base_url + 'measures'}),
		            reader: new Ext.data.JsonReader(
		                {root: 'data', totalProperty: 'total', id: 'id'},
		                ['id', 'short_title']
		        	),
	                remoteSort: true
	            }),
	            listeners: {
	            	'select': function(cmp){
	            		this.form.getForm().findField('f[measure_id]').setValue(cmp.getValue());
	            	}, scope: this
	            },
	            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
	            anchor: '100%', minChars: 0, hiddenName: 'f[measure_title]', allowBlank: false
			});
			
			this.form = new Ext.FormPanel({
			    url: '', defaultType: 'textfield', width: 330, labelWidth: 100,
				frame: true, title: false,
				items: [
					{xtype: 'hidden', name: 'cmd', value: mode},
					{xtype: 'hidden', name: 'f[id]'},
					{xtype: 'hidden', name: 'f[group_id]'},
					{xtype: 'hidden', name: 'f[product_id]'},
					{xtype: 'hidden', name: 'f[measure_id]'},
					product_group_cmb,
					product_cmb,
					{xtype: 'numberfield', fieldLabel: '<span class="required">*</span> Количество', name: 'f[quantity]', allowNegative: false, allowBlank: false, anchor:'100%'},
					measure_cmb,
					{xtype: 'numberfield', fieldLabel: '<span class="required">*</span> № накладной', name: 'f[receipt_num]', allowNegative: false, allowBlank: false, anchor:'100%'},
				]
			});

			this.dlg = new Ext.Window({
				title: title, width: 342,
				autoHeight: true, closable: true, bodyBorder: false, border: false,
	            draggable: true, plain:true, modal: true, resizable: false,
	            items: [this.form],
				buttons: [
					{text: 'Сохранить', handler: saveData, scope: this},
					{text: 'Отмена', handler: cancel, scope: this}
				],
				buttonAlign: 'center'
			});
		}
		this.dlg.show();
		
		if ('edit' == mode || 'ship' == mode) {
			var sm = this.grid.getSelectionModel();
			if (sm.hasSelection()) {
				Ext.Ajax.request({
            		url: site_base_url + 'storedProducts',
	                params: {'cmd': 'get', 'id': sm.getSelected().id},
	                success: function(response){
	                	this.setValues(response);
	                },
	                scope: this
	        	});
			}
		}
	},
	
	updateGrid: function(response){
		if(!this.showErrors(response)){
			if(this.dlg)this.dlg.close();
			this.reloadGrid();
		}
	}
});
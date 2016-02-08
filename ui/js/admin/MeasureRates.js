Schedro.MeasureRates = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.MeasureRates.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.MeasureRates, Schedro.Functions, {
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
			{name: 'id', type: 'int'},
			{name: 'measure1_id'},
			{name: 'measure1_title'},
			{name: 'measure2_id'},
			{name: 'measure2_title'},
			{name: 'rate'},
			{name: 'product_id'},
			{name: 'product_title'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/measureRates'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			csm,
			{header: 'Ед 1.', dataIndex: 'measure1_title', width: 130, sortable: true},
			{header: 'Продукт', dataIndex: 'product_title', sortable: true},
			{header: 'Коэфф.', dataIndex: 'rate', sortable: true},
			{header: 'Ед 2.', dataIndex: 'measure2_title', sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true}),
	        loadMask: true,
	        buttons:[
				{text: 'Добавить', selection: '0', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Редактировать', selection: '1', handler: this.showDialog.createDelegate(this, ['edit']), scope: this},
				{text: 'Удалить', selection: 'N', handler: this.deleteRequest, scope: this}
			],
			title: 'Пропорции', buttonsAlign: 'right', /*height: 544,*/ frame:true
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
	            		url: site_base_url + 'admin/measureRates',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранные пропорции?', fn: show_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},	
	
	/**
	 * Function showDialog
	 * Show add/edit dlg
	 * @param {String} mode
	 */
	showDialog: function(mode){
		var title = ('edit' == mode)?'Редактировать':'Добавить';	
		
		var saveData = function(){
			var f = this.form.getForm();
			if(f.isValid()){
				var params = f.getValues();
				Ext.Ajax.request({url: site_base_url + 'admin/measureRates', params: params, success: this.updateGrid, scope: this});
			}
		}
		
		var cancel = function (){
			this.dlg.close();
		}

		var product_cmb = new Ext.form.ComboBox({
            fieldLabel: '<span class="required">*</span> Продукт', loadingText: 'Пожалуйста подождите... ', emptyText: 'Пожалуйста, выберите продукт...',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/products'}),
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
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/productGroups'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
            		product_cmb.getStore().baseParams = {
            			group_selected: cmp.getValue(),
            			cmd: 'getGrouped'
            		};
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, hiddenName: 'f[group_title]', allowBlank: false
		});
		
		var measure1_cmb = new Ext.form.ComboBox({
			loadingText: 'Пожалуйста подождите... ',
            emptyText: 'Ед. 1',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/measures'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title', 'short_title']
	        	),
	        	remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
            		this.form.getForm().findField('f[measure1_id]').setValue(cmp.getValue());
            		measure2_cmb.getStore().baseParams = {
            			already_selected: cmp.getValue(),
            			cmd: 'getExcludedGrid'
            		};
            	}, scope: this
            },
            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
            listWidth: 100, width: 100,
            anchor: '100%', minChars: 0, allowBlank: false, hiddenName: 'f[measure1_title]'
		});

		var measure2_cmb = new Ext.form.ComboBox({
            loadingText: 'Пожалуйста подождите... ',
            emptyText: 'Ед. 2',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/measures'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title', 'short_title']
	        	),
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
            		this.form.getForm().findField('f[measure2_id]').setValue(cmp.getValue());
            		measure1_cmb.getStore().baseParams = {
            			already_selected: cmp.getValue(),
            			cmd: 'getExcludedGrid'
            		};
            	}, scope: this
            },
            valueField:'id', displayField: 'short_title', pageSize: this.smallPageSize,
            listWidth: 100, width: 100,
            anchor: '100%', minChars: 0, allowBlank: false, hiddenName: 'f[measure2_title]'
		});
		
		this.form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 350, labelWidth: 0,
			frame: true, title: false,
			items: [product_group_cmb, product_cmb, {
				xtype: 'container',
				anchor: '100%',
				layout:'column', 
				items:[
				       {xtype: 'hidden', name: 'cmd', value: mode},
				       {xtype: 'hidden', name: 'f[id]'},
				       {xtype: 'hidden', name: 'f[measure1_id]'},
				       {xtype: 'hidden', name: 'f[measure2_id]'},
				       {xtype: 'hidden', name: 'f[product_id]'},
				       {xtype: 'container', columnWidth:.3, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'textfield', disabled: true, value: '1', anchor:'100%'}]},
				       measure1_cmb,
				       {xtype: 'container', columnWidth:.2, style: 'margin: 0px 5px; padding-top: 3px; text-align: center;', layout: 'anchor', items: [{xtype: 'label', html: '=', hidden: false, style: 'font-size: small; font-weight: bold;', anchor: '100%'}]},
				       {xtype: 'container',	columnWidth:.5, style: 'margin: 0px 2px;', layout: 'anchor', items: [{xtype: 'numberfield', name: 'f[rate]', allowBlank: false, anchor:'100%'}]},
				       measure2_cmb,
				]
			}]
		});

		this.dlg = new Ext.Window({
			title: title, width: 362,
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
		
		if('edit' == mode){
			var sm = this.grid.getSelectionModel();
			if(sm.hasSelection()){
				Ext.Ajax.request({
            		url: site_base_url + 'admin/measureRates',
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
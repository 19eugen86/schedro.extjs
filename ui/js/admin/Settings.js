Schedro.Settings = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.Settings.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.Settings, Schedro.Functions, {
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
			{name: 'id', type: 'int'}, {name: 'title'}, {name: 'description'}, {name: 'sys_key'}, {name: 'sys_value'}, {name: 'is_modifiable'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/settings'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });

		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			/*csm,*/
			{header: 'Название', dataIndex: 'title', sortable: false},
			{header: 'Значение', dataIndex: 'sys_value', sortable: false, flex: 1, 
				editor: {
					xtype:'textfield',
					allowBlank: false
				}
			},
			{header: 'Описание', dataIndex: 'description', sortable: false},
		]);
		
		var editor = new Ext.ux.grid.RowEditor({
			clicksToEdit: 2,
			listeners: {
				afteredit: function(object, changes, r, rowIndex) {
					Ext.Ajax.disableCaching = false;
					Ext.Ajax.request({
						url: site_base_url + 'admin/settings',
						params: {
							'cmd': 'edit',
							'f[id]': r.data.id,
							'f[sys_value]': r.data.sys_value,
							'f[sys_key]': r.data.sys_key
						},
						callback: function() {
							this.grid.getStore().load({params: {start:0, limit: this.pageSize}});
						},
						scope: this
					});
				}
			}
		});
		
		this.grid = new Ext.grid.EditorGridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true}),
	        loadMask: false,
	        plugins: [editor],
	        title: 'Системные настройки', buttonsAlign: 'right', /*height: 544,*/ frame:true
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
	/*deleteRequest: function(){
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
	            		url: site_base_url + 'admin/settings',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранные страны?', fn: show_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},*/
	
	/**
	 * Function showDialog
	 * Show add/edit dlg
	 * @param {String} mode
	 */
	/*showDialog: function(mode){
		var title = ('edit' == mode)?'Редактировать':'Добавить';	
		
		var saveData = function(){
			var f = this.form.getForm();
			if(f.isValid()){
				var params = f.getValues();
				Ext.Ajax.request({url: site_base_url + 'admin/countries', params: params, success: this.updateGrid, scope: this});
			}
		}
		
		var cancel = function (){
			this.dlg.close();
		}
		
		this.form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 400, labelWidth: 100,
			frame: true, title: false,
			items: [
				{xtype: 'hidden', name: 'cmd', value: mode},
				{xtype: 'hidden', name: 'f[id]'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Страна', name: 'f[title]', anchor: '100%', allowBlank: false}
			]
		});
			
		this.dlg = new Ext.Window({
			title: title, width: 413,
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
            		url: site_base_url + 'admin/countries',
	                params: {'cmd': 'get', 'id': sm.getSelected().id},
	                success: function(response){
	                	var content = Ext.decode(response.responseText).content;
	                	this.setValues(response);
	                },
	                scope: this
	        	});
			}
		}
	},*/
	
	updateGrid: function(response){
		if(!this.showErrors(response)){
			if(this.dlg)this.dlg.close();
			this.reloadGrid();
		}
	}
});
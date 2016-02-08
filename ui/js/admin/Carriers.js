Schedro.Carriers = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.Carriers.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.Carriers, Schedro.Functions, {
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
			{name: 'id', type: 'int'}, {name: 'title'}, {name: 'description'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/carriers'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });
		
		var filters = new Ext.ux.grid.GridFilters({
	  		filters:[
	    		{type: 'string', dataIndex: 'title'},
	    		{type: 'string', dataIndex: 'description'}
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			csm,
			{header: 'Перевозчик', dataIndex: 'title', width: 130, sortable: true},
			{header: 'Описание', dataIndex: 'description', width: 130, sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true, plugins: filters}),
	        loadMask: true,
	        plugins: [filters],
	        buttons:[
				{text: 'Добавить', selection: '0', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Редактировать', selection: '1', handler: this.showDialog.createDelegate(this, ['edit']), scope: this},
				{text: 'Удалить', selection: 'N', handler: this.deleteRequest, scope: this}
			],
			title: 'Перевозчики', buttonsAlign: 'right', /*height: 544,*/ frame:true
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
	            		url: site_base_url + 'admin/carriers',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранных перевозчиков?', fn: show_fn,
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
				Ext.Ajax.request({url: site_base_url + 'admin/carriers', params: params, success: this.updateGrid, scope: this});
			}
		}
		
		var cancel = function (){
			this.dlg.close();
		}

		this.form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 330, labelWidth: 100,
			frame: true, title: false,
			items: [
				{xtype: 'hidden', name: 'cmd', value: mode},
				{xtype: 'hidden', name: 'f[id]'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Название', name: 'f[title]', anchor: '100%', allowBlank: false},
				{xtype: 'textfield', fieldLabel: 'Описание', name: 'f[description]', anchor: '100%'}
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
		this.dlg.show();
		
		if('edit' == mode){
			var sm = this.grid.getSelectionModel();
			if(sm.hasSelection()){
				Ext.Ajax.request({
            		url: site_base_url + 'admin/carriers',
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
Schedro.DcStores = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.DcStores.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.DcStores, Schedro.Functions, {
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
			{name: 'title'},
			{name: 'area'},
			{name: 'free_area'},
//			{name: 'volume'},
			{name: 'dc_title'},
			{name: 'cellsDivs'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/dcStores'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });

		var tpl = new Ext.XTemplate(
			'<tpl if="this.isEmpty(cellsDivs) == false">',
				'{cellsDivs}',
			'</tpl>',
			{
				isEmpty: function(value){
					if( ('' == value) || (null == value) ){
						return true;
					} else {
						return false;
					}
				}
			}
		);
		tpl.compile();
		var expander = new Ext.grid.RowExpander({enableCaching: false, tpl: tpl});
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel([
			csm,
			expander,
			{header: 'Название', dataIndex: 'title', sortable: true},
			{header: 'Полезная площадь (м²)', dataIndex: 'area', sortable: true},
			{header: 'Остаточная площадь (м²)', dataIndex: 'free_area', sortable: true},
//			{header: 'Объем (м³)', dataIndex: 'volume', sortable: true},
			{header: 'РЦ', dataIndex: 'dc_title', sortable: true}
		]);
						
		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {scrollOffset: 0, forceFit:true},
	        bbar: new Ext.PagingToolbar({pageSize: this.pageSize, store: ds, displayInfo: true}),
	        loadMask: true,
	        plugins: [expander],
	        buttons:[
				{text: 'Добавить', selection: '0', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Редактировать', selection: '1', handler: this.showDialog.createDelegate(this, ['edit']), scope: this},
				{text: 'Удалить', selection: 'N', handler: this.deleteRequest, scope: this}
			],
			title: 'Список складов', buttonsAlign: 'right', /*height: 544,*/ frame:true
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
	            		url: site_base_url + 'admin/dcStores',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранные склады?', fn: show_fn,
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
				Ext.Ajax.request({url: site_base_url + 'admin/dcStores', params: params, success: this.updateGrid, scope: this});
			}
		}
		
		var cancel = function (){
			this.dlg.close();
		}
		
		// Список филиалов
		var affCmb = new Ext.form.ComboBox({
			fieldLabel: '<span class="required">*</span> РЦ',
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
					this.form.getForm().findField('f[dc_id]').setValue(cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, name: 'f[dc_title]', allowBlank: false
		});
		
		this.form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 400, labelWidth: 100,
			frame: true, title: false,
			items: [
				{xtype: 'hidden', name: 'cmd', value: mode},
				{xtype: 'hidden', name: 'f[id]'},
				{xtype: 'hidden', name: 'f[dc_id]'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Название', name: 'f[title]', anchor: '100%', allowBlank: false},
				affCmb,
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
            		url: site_base_url + 'admin/dcStores',
	                params: {'cmd': 'get', 'id': sm.getSelected().id},
	                success: function(response){
	                	var content = Ext.decode(response.responseText).content;
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
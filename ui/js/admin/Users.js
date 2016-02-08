Schedro.Users = function(config) {
	config = config || {};
	
	Ext.apply(this, config)
	Schedro.Users.superclass.constructor.call(this);
	this.buildContent();
};

Ext.extend(Schedro.Users, Schedro.Functions, {
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
			{name: 'id', type: 'int'}, {name: 'fullname'}, {name: 'login'}, {name: 'dob'},
			{name: 'address'}, {name: 'hphone'}, {name: 'cphone'}, {name: 'wphone'}, {name: 'email'},
			{name: 'user_group_id'}, {name: 'user_group_title'}, {name: 'type'}, {name: 'is_blocked'}
		]);
	
		var ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/users'}),
			baseParams: {cmd: 'getGrid'},
	        reader: new Ext.data.JsonReader(
				{root: 'data', totalProperty: 'total', id: 'id', fields: r}
			),
			remoteSort: true
	    });
		
		var renderEmail = function(v){
			return '<a href="mailto:' + v + '">' + v + '</a>';
		}
		
		var filters = new Ext.ux.grid.GridFilters({
	  		filters:[
	    		{type: 'string', dataIndex: 'fullname'},
	    		{type: 'string', dataIndex: 'login'},
	    		{type: 'string', dataIndex: 'hphone'},
	    		{type: 'string', dataIndex: 'cphone'},
	    		{type: 'string', dataIndex: 'wphone'},
	    		{type: 'string', dataIndex: 'email'},
	    		{type: 'string', dataIndex: 'user_group_title'}
			]
		});
		
		var csm = new Ext.grid.CheckboxSelectionModel();
		
		var cm = new Ext.grid.ColumnModel([
			csm,
			{header: 'ФИО', dataIndex: 'fullname', width: 130, sortable: true},
			{header: 'Группа', dataIndex: 'user_group_title', sortable: true},
			{header: 'Тел. мобильный', dataIndex: 'cphone', sortable: true},
			{header: 'Тел. рабочий', dataIndex: 'wphone', sortable: true},
			{header: 'Тел. домашний', dataIndex: 'hphone', sortable: true},
			{header: 'Эл. почта', dataIndex: 'email', sortable: true, renderer: renderEmail},
			{header: 'Почтовый адрес', dataIndex: 'address', sortable: true},
			{header: 'Дата рождения', dataIndex: 'dob', sortable: true},
			{header: 'Логин', dataIndex: 'login', sortable: true}
		]);

		this.grid = new Ext.grid.GridPanel({
			ds: ds, cm: cm, sm: csm,
			viewConfig: {
				getRowClass: function(record) {
		        	var rowClassName = 'blue-row';
		        	if (record.get('type') == "admin") {
		        		rowClassName = 'green-row';
		        	}
		        	if (record.get('type') == "moderator") {
		        		rowClassName = 'yellow-row';
		        	}
		        	if (record.get('is_blocked') == "yes") {
		        		rowClassName = 'red-row';
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
	        buttons:[
				{text: 'Добавить', selection: '0', handler: this.showDialog.createDelegate(this, ['add']), scope: this},
				{text: 'Редактировать', selection: '1', handler: this.showDialog.createDelegate(this, ['edit']), scope: this},
				{text: 'Заблокировать', selection: 'N', handler: this.blockRequest, scope: this},
				{text: 'Разблокировать', selection: 'N', handler: this.unblockRequest, scope: this},
				{text: 'Удалить', selection: 'N', handler: this.deleteRequest, scope: this}
			],
			title: 'Список пользователей', buttonsAlign: 'right', /*height: 544,*/ frame:true
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
	            		url: site_base_url + 'admin/users',
	        		    params: {'cmd': 'delete', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Удалить', msg: 'Вы уверены, что хотите удалить выбранных пользователей?', fn: dshow_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},

	/**
	 * Function blockRequest
	 * Call if block button was clicked
	 */	
	blockRequest: function(){
		var bshow_fn = function(btn){
			if('yes' == btn){
				var sm = this.grid.getSelectionModel();
				if(sm.hasSelection()){
					var ids = [];
					var sels = sm.getSelections();
					for(var i=0, l = sels.length; i<l; i++){
						ids.push(sels[i].id);
					}
					
					Ext.Ajax.request({
	            		url: site_base_url + 'admin/users',
	        		    params: {'cmd': 'block', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Блокировка', msg: 'Вы уверены, что хотите заблокировать выбранных пользователей?', fn: bshow_fn,
			scope: this, icon: Ext.Msg.QUESTION, buttons: Ext.Msg.YESNO
		});
	},
	
	/**
	 * Function unblockRequest
	 * Call if unblock button was clicked
	 */	
	unblockRequest: function(){
		var ushow_fn = function(btn){
			if('yes' == btn){
				var sm = this.grid.getSelectionModel();
				if(sm.hasSelection()){
					var ids = [];
					var sels = sm.getSelections();
					for(var i=0, l = sels.length; i<l; i++){
						ids.push(sels[i].id);
					}
					
					Ext.Ajax.request({
	            		url: site_base_url + 'admin/users',
	        		    params: {'cmd': 'unblock', 'ids': Ext.encode(ids)},
		                success: this.updateGrid, scope: this
		        	});
				}
			}
		}
		Ext.Msg.show({
			title: 'Блокировка', msg: 'Вы уверены, что хотите разблокировать выбранных пользователей?', fn: ushow_fn,
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
				Ext.Ajax.request({url: site_base_url + 'admin/users', params: params, success: this.updateGrid, scope: this});
			}
		}
		
		var cancel = function (){
			this.dlg.close();
		}

		if('edit' == mode){
			var userGroupFieldMark = 'Группа';
		} else {
			var userGroupFieldMark = '<span class="required">*</span> Группа';
		}
		
		var user_group_cmb = new Ext.form.ComboBox({
            fieldLabel: userGroupFieldMark, loadingText: 'Пожалуйста подождите... ', emptyText: 'Пожалуйста, выберите группу...',
            store: new Ext.data.Store({
	            proxy: new Ext.data.HttpProxy({url: site_base_url + 'admin/userGroups'}),
	            reader: new Ext.data.JsonReader(
	                {root: 'data', totalProperty: 'total', id: 'id'},
	                ['id', 'title']
	        	),
                remoteSort: true
            }),
            listeners: {
            	'select': function(cmp){
            		this.form.getForm().findField('f[user_group_id]').setValue(cmp.getValue());
            	}, scope: this
            },
            valueField:'id', displayField: 'title', pageSize: this.smallPageSize,
            anchor: '100%', minChars: 0, hiddenName: 'f[user_group_title]'
		});
		

		if('edit' == mode){
			var pwd_field = {xtype: 'textfield', anchor: '100%', fieldLabel: 'Пароль', name: 'f[password]', id: this.id + '-pwd-field', inputType: 'password'}	
		} else {
			var pwd_field = {xtype: 'textfield', anchor: '100%', fieldLabel: '<span class="required">*</span> Пароль', name: 'f[password]', id: this.id + '-pwd-field', inputType: 'password', allowBlank: false}
		}
		
		this.form = new Ext.FormPanel({
		    url: '', defaultType: 'textfield', width: 388, labelWidth: 120,
			frame: true, title: false,
			items: [
				{xtype: 'hidden', name: 'cmd', value: mode},
				{xtype: 'hidden', name: 'f[id]'},
				{xtype: 'hidden', name: 'f[user_group_id]'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> ФИО', name: 'f[fullname]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Логин', name: 'f[login]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Эл. почта', name: 'f[email]', vtype: 'email', anchor: '100%'},
				{xtype: 'datefield', format: 'd-m-Y', fieldLabel: '<span class="required">*</span> Дата рождения', name: 'f[dob]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Адрес', name: 'f[address]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Дом. телефон', name: 'f[hphone]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Моб. телефон', name: 'f[cphone]', anchor: '100%'},
				{xtype: 'textfield', fieldLabel: '<span class="required">*</span> Раб. телефон', name: 'f[wphone]', anchor: '100%'},
				user_group_cmb,
				{xtype: 'label', html: 'Оставьте это поле пустым, если не хотите менять пароль.', hidden: ('edit' == mode) ? false : true, style: 'color: red; font-weight: bold;', anchor: '100%'},
				{xtype: 'panel', layout: 'column',
					items: [
						{xtype: 'panel', width: 250, layout: 'form', style: 'margin-right: 5px;',
							items: pwd_field
						},
						{xtype: 'panel', 
							items: [
								{xtype: 'button', text: 'Пароль по умолчанию', scope: this,
									handler: function(){
										Ext.Ajax.request({
						            		url: site_base_url + 'admin/users',
						        		    params: {'cmd': 'resetpwd'}, scope: this,
							                success: function(response){
							                	var data = Ext.decode(response.responseText);
							                	Ext.getCmp(this.id + '-pwd-field').setValue(data);
							                }
							        	});
									}
								}
							]
						}
					]
				},
				{xtype: 'radiogroup', id: 'rolegroup', fieldLabel: 'Роль', anchor: '100%', columns: 1, vertical: true,
					defaults: {xtype: "radio", name: "f[type]"},
					items: [{
		            	boxLabel: 'Пользователь',
		            	inputValue: 'user',
		            	id: 'user',
		            	checked: true
		            }, {
		            	boxLabel: 'Модератор',
		            	inputValue: 'moderator',
		            	id: 'moderator',
		            }, {
		            	boxLabel: 'Администратор',
		            	inputValue: 'admin',
		            	id: 'admin',
		            }]
				}
			]
		});
			
		this.dlg = new Ext.Window({
			title: title, width: 401,
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
            		url: site_base_url + 'admin/users',
	                params: {'cmd': 'get', 'id': sm.getSelected().id},
	                success: function(response){
	                	adminChecked = true;
	                	this.setValues(response);
	                	
	                	var data = Ext.decode(response.responseText);
	            		for(var key in data){
	            			if(key == "type"){
	            				Ext.getCmp(data[key]).setValue(true);
	            			}
	                	}
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
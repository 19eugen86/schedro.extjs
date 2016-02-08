Schedro.Login = function(config){
    config = config || {};
    
    config.id = Ext.id();
    config.buttons = [{text: 'Войти', handler: this.tryLogin, scope: this}];
    
    Ext.apply(this, config);
    Schedro.Login.superclass.constructor.call(this);
  	this.buildContent();    
};

Ext.extend(Schedro.Login, Ext.Window, {
	closable: false, draggable: true, autoHeight: true,  y: 100,
	resizable: false, title: 'Щедро &raquo; Вход', shadow:  false, width: 413, modal: true, 
	bodyBorder: false,
	buttonAlign: 'center',
	buildContent: function (){
		this.loginFormPanel = new Ext.FormPanel({
			url: '', defaultType: 'textfield', fileUpload: true, bodyStyle: 'padding: 5px;',
			maskDisabled :true, id: 'login-form', border: false, bodyBorder: false, width: 390,
			items: [
				{name: 'cmd', value: 'login', xtype:'hidden'},
				{fieldLabel: 'Пользователь', name: 'f[login]', allowBlank: false, xtype: 'textfield', anchor: '100%'},
				{fieldLabel: 'Пароль', name: 'f[password]', allowBlank: false, xtype: 'textfield', anchor: '100%', inputType: 'password'},
			]
		});

		this.add(this.loginFormPanel);
		this.show('login_form');
		
		var map = new Ext.KeyMap(Ext.getBody(), {
		    key: 13, // or Ext.EventObject.ENTER
		    fn: this.tryLogin,
		    scope: this
		});
	},
	
	tryLogin: function(){
		var form = this.loginFormPanel.getForm();
		if(form.isValid()){
			form.submit({
				url: site_base_url + 'login',
				success: function(f, r){
					var data = Ext.decode(r.response.responseText);
					if (false == data.is_error) {
						this.close();
						if (false == data.isAdmin) {
							document.location.href = site_base_url + 'home/';
						} else {
							document.location.href = site_base_url + 'admin/home/';
						}
					} else {
						wnd.showErrors(r.response);
					}
				},
				failure: function(f, r){
					var data = Ext.decode(r.response.responseText);
					if (data.is_error == 'blocked' || data.is_error == 'invalid_user') {
						wnd.showErrors(r.response);
					} else {
						wnd.showSysErr();
					}
				}
			});
		}	
	},
	
	/**
	 * Function showMessage
	 * Showsystem/information/warning/status message
	 * @param {String} title
	 * @param {String} msg
	 * @param {String} icon
	 */
	showMessage: function(title, msg, icon){
	    Ext.Msg.show({title: title, msg: msg, buttons: Ext.Msg.OK, icon: Ext.Msg[icon]});
	},
	
	/**
	 * Function showErrors
	 * Show action result
	 * @param {Object} Server response
	 * @return {Bool} action result
	 */
	showErrors: function(response) {
	    var resp = Ext.decode(response.responseText);
    	if (resp.is_error) {
        	var msg = '';
        	for(var i=0; i<resp.messages.length; i++){
            	msg += resp.messages[i] + '<br />';
        	}
        	msg.substring(0, msg.length - 6);//<br /> - 6 symbols
        	this.showMessage('Системное сообщение', msg, 'WARNING');
        	return true;
		}
		if(resp.messages){
        	if(resp.messages.length > 0){
            	var msg = '';
            	for(var i=0; i<resp.messages.length; i++){
                	msg += resp.messages[i] + '<br />';
            	}
            	msg.substring(0, msg.length - 6);//<br /> - 6 symbols
            	this.showMessage('Информационное сообщение', msg, 'INFO');
            	return false;
        	}
    	}
    	return false;
	},
	
	/**
	 * Function showSysErr
	 * Show dummy msg
	 */
	showSysErr: function(){
		var msg = 'По техническим причинам эта функция временно недоступна.';
		this.showMessage('Ошибка', msg, 'ERROR');
	}	
});
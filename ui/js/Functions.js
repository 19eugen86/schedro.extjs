Schedro.Functions = function(config){
    config = config || {};
    Ext.apply(this, config);
};

Ext.extend(Schedro.Functions, Ext.util.Observable, {
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
            	this.showMessage('Информация', msg, 'INFO');
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
		var msg = 'По техническим причинам данная функциональность временно не доступна.';
		this.showMessage('Системное сообщение', msg, 'ERROR');
	},
	
	/**
	 * Function getSelector
	 * disable or enable grid buttons when row clicked or datastore loaded
	 */
	getSelector: function(){
        var sm = this.getSelectionModel();
        var store = this.getStore();
        var selected = sm.selections.keys;
        var buttons = (this.buttons)?this.buttons:[];
        var selCount = sm.getCount();

        for (var i=0; i<buttons.length; i++){
            switch (selCount) {
                case 0: 
                	{
                        buttons[i].setDisabled(true);
                        if('0' == buttons[i].selection){
                                buttons[i].setDisabled(false);
                        }
                    }
					break;
                case 1:
                    {
                        buttons[i].setDisabled(false);
                    }
                    break;
                default:
                    {
                        buttons[i].setDisabled(true);
                        if (('N' == buttons[i].selection) || ('0' == buttons[i].selection)) {
                            buttons[i].setDisabled(false);
                        }
                        break;
                    }
        	}
            if (buttons[i].enablerFunc && typeof buttons[i].enablerFunc == 'function') {
                if (!buttons[i].enablerFunc.call(this, buttons[i])) {
                    buttons[i].setDisabled(true);
                }else{
                    buttons[i].setDisabled(false);
                }
            }
        }
	},
	
	htmlEncode : function(value){
		return !value ? value : String(value)
		.replace(/&/g, "&amp;")
		.replace(/>/g, "&gt;")
		.replace(/</g, "&lt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "'")
		.replace(/à/g, "&agrave;")
		.replace(/è/g, "&egrave;")
		.replace(/ì/g, "&igrave;")
		.replace(/ò/g, "&ograve;")
		.replace(/ù/g, "&ugrave;")
		;
	},
	
	htmlDecode : function(value){
		return !value ? value :
		String(value)
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&quot;/g, '"')
		.replace(/"/g, '"')
		.replace(/'/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&agrave;/g, "à")
		.replace(/&egrave;/g, "è")
		.replace(/&igrave;/g, "ì")
		.replace(/&ograve;/g, "ò")
		.replace(/&ugrave;/g, "ù")
		;
	},
	
	/**
	 * Function setValues
	 * Set form values
	 * @param {Object}  Srever response
	 */
	setValues: function(response){
		var d = {};
		var data = Ext.decode(response.responseText);
		for(var key in data){
			d['f[' + key + ']'] = this.htmlDecode(data[key]);
    	}
		this.form.getForm().setValues(d);
	}
});
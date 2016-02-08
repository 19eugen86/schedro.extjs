Ext.form.CKEditor = function(config){
    this.config = config;
    Ext.form.CKEditor.superclass.constructor.call(this, config);
    this.on('destroy', function (ct) {
    	ct.destroyInstance();
    });
};
 
Ext.extend(Ext.form.CKEditor, Ext.form.TextArea,  {
    onRender : function(ct, position){
        if(!this.el){
            this.defaultAutoCreate = {tag: 'textarea', autocomplete: 'off'};
        }
 
        Ext.form.TextArea.superclass.onRender.call(this, ct, position);
        if (!this.config.CKConfig) this.config.CKConfig = {};
        var defConfig = {
			 resize_enabled : false,
			 on : {
	         // maximize the editor on startup
	         'instanceReady' : function( evt ) {
	            evt.editor.resize((evt.editor.element.$.style.width ? evt.editor.element.$.style : '100%'), parseInt(evt.editor.element.$.style.height));
	            evt.editor.is_instance_ready = true;
	         }
	      }
        }
        Ext.apply(this.config.CKConfig, defConfig);
        CKEDITOR.replace(this.id, this.config.CKConfig);
 
    },
 
    onResize: function(width, height) {
    	Ext.form.TextArea.superclass.onResize.call(this, width, height);    	
    	if (CKEDITOR.instances[this.id].is_instance_ready) {
    		CKEDITOR.instances[this.id].resize(width, height);
    	}		
    },
 
    setValue : function(value){
    	if (!value) value = '&nbsp;'; 
 
        Ext.form.TextArea.superclass.setValue.apply(this,arguments);
 
        if (CKEDITOR.instances[this.id]) CKEDITOR.instances[this.id].setData( value );
 
    },
 
    getValue : function(){
 
        if (CKEDITOR.instances[this.id]) CKEDITOR.instances[this.id].updateElement();
        return Ext.form.TextArea.superclass.getValue.call(this);
 
    },
 
    getRawValue : function(){
 
        if (CKEDITOR.instances[this.id]) CKEDITOR.instances[this.id].updateElement();    
 
        return Ext.form.TextArea.superclass.getRawValue.call(this);
 
    },
 
	destroyInstance: function(){
        if (CKEDITOR.instances[this.id]) {
            delete CKEDITOR.instances[this.id];
        }
    } 
});
 
Ext.reg('ckeditor', Ext.form.CKEditor);
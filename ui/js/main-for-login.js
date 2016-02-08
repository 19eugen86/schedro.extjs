Ext.BLANK_IMAGE_URL = site_base_url+"ui/js/resources/images/s.gif";

var wnd = null;
Ext.onReady(function(){
	Ext.QuickTips.init();
	wnd = new Schedro.Login();
});
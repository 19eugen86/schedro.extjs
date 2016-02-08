<?php
require_once dirname(__FILE__).'/smarty/Smarty.core.class.php';
class Smarty extends SmartyCore
{
	public function __construct() {
		parent::__construct();
		$this->_setDirs();
		$this->_setConfParam();
	}

	private function _setDirs() {
		require_once CONFIG_DIR.'smarty.config.php';
		$this->setTemplateDir(SMARTY_TEMPLATES_DIR);
		$this->setCompileDir(SMARTY_TEMPLATES_C_DIR);
		$this->setPluginsDir(SMARTY_PLUGINS_DIR);
		$this->setCacheDir(SMARTY_CACHE_DIR);
		$this->setConfigDir(CONFIG_DIR);
	}
	
	private function _setConfParam() {
		$this->assign(
			'conf',
			array (
				'site_url' => HTTP_SITE_URL,
				'base_url' => HTTP_SITE_URL,
				'ssl_url' => HTTPS_SITE_URL,
				'root_url' => ($_SERVER ['SERVER_PORT'] == 443) ? HTTPS_SITE_URL : HTTP_SITE_URL
			)
		);
	}
}
<?php
class Session
{
	protected static $instance;
	
	private function __construct() {}
	private function __clone() {}
	private function __wakeup() {}
	
	public static function getInstance() {
		if (!isset(self::$instance)) {
			$class = __CLASS__;
			self::$instance = new $class();
			session_start();
		}
		return self::$instance;
	}
	
	public function setValue($key, $value) {
		$_SESSION[$key] = $value;
	}
	
	public function getValue($key) {
		if (array_key_exists($key, $_SESSION) && !empty($_SESSION[$key])) {
			return $_SESSION[$key];
		}
	}
	
	public function removeValue($key) {
		unset($_SESSION[$key]);
	}
}
?>
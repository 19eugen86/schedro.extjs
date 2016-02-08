<?php
class Auth
{
	const SESSION_VAR_NAME = 'loggedUser';
	
	public static function login($login, $password) {
		if (!empty($login) && !empty($password)) {
			$db = Database::getInstance();
			$login = "'".$db->escapeStr($login)."'";
			$password = "'".md5($password)."'";
			$sql = 'SELECT id FROM users WHERE login = '.$login.' AND password = '.$password;
			$userId = $db->getOne($sql);
			if (self::isBlocked($userId)) {
				return 'blocked';
			}
			if ($userId > 0) {
				Session::getInstance()->setValue(self::SESSION_VAR_NAME, $userId);
				return true;
			}
		}
		return false;
	}
	
	public static function checkRole() {
		$role = 'anonymous';
		$userId = Session::getInstance()->getValue(self::SESSION_VAR_NAME);
		if ($userId) {
			$db = Database::getInstance();
			$sql = 'SELECT type FROM users WHERE id = '.intval($userId);
			$role = $db->getOne($sql);
		}
		return $role;
	}
	
	public static function logout() {
		Session::getInstance()->removeValue(self::SESSION_VAR_NAME);
		header('Location: '.HTTP_SITE_URL);
	}
	
	public static function isLoggedIn() {
		$userId = Session::getInstance()->getValue(self::SESSION_VAR_NAME);
		if (!empty($userId) && is_numeric($userId)) {
			if (!self::isBlocked()) {
				return $userId;
			}
		}
		return false;
	}
	
	public static function isBlocked($userId = '') {
		if (empty($userId)) {
			$userId = Session::getInstance()->getValue(self::SESSION_VAR_NAME);
		}
		if ($userId > 0) {
			$db = Database::getInstance();
			$sql = 'SELECT is_blocked FROM users WHERE id = '.intval($userId);
			$isBlocked = $db->getOne($sql);
			if ($isBlocked == 'no') {
				return false;
			} else {
				return true;
			}
		}
	}
}
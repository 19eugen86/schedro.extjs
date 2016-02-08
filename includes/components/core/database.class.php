<?php
class Database
{
	protected static $instance;
	protected static $connection;
	
	private function __construct() {}
	private function __clone() {}
	private function __wakeup() {}
	
	public static function getInstance() {
		if (!isset(self::$instance)) {
			$class = __CLASS__;
			self::$instance = new $class();
			self::$instance->_connect();
		}
		return self::$instance;
	}
	
	private function _connect() {
		require_once CONFIG_DIR.'db.config.php';
		self::$connection = mysqli_connect(
			DB_HOST,
			DB_USERNAME,
			DB_PASSWORD,
			DB_NAME
		);
		$this->query('SET names UTF8');
	}
	
	public function query($sql) {
		$res = mysqli_query(self::$connection, $sql);
		return $res;
	}
	
	public function getOne($sql) {
		$res = $this->getAll($sql);
		if (!empty($res)) {
			foreach ($res as $row) {
				return $row[0];
			}
		}
	}
	
	public function getRow($sql) {
		$queryRes = $this->query($sql);
		$res = mysqli_fetch_row($queryRes);
		if (!empty($res)) {
			return $res;
		}
	}
	
	public function getColumn($sql) {
		$res = $this->getAll($sql);
		if (!empty($res)) {
			$column = array();
			foreach ($res as $row) {
				$column[] = $row[0];
			}
			return $column;
		}
	}
	
	public function getAll($sql) {
		$queryRes = $this->query($sql);
		$res = mysqli_fetch_all($queryRes);
		if (!empty($res)) {
			return $res;
		}
	}

	public function getAllAssoc($sql) {
		$queryRes = $this->query($sql);
		$res = mysqli_fetch_all($queryRes, MYSQLI_ASSOC);
		if (!empty($res)) {
			return $res;
		}
	}
	
	public function getAssoc($sql) {
		$queryRes = $this->query($sql);
		$res = mysqli_fetch_assoc($queryRes);
		if (!empty($res)) {
			return $res;
		}
	}
	
	public function getLastInsertId() {
		return mysqli_insert_id(self::$connection);
	}
	
	public function escapeStr($str = '') {
		return htmlspecialchars($str);
		//return mysqli_real_escape_string(self::$connection, $str);
	}
	
	public function __destruct() {
		mysqli_close(self::$connection);
	}
}
?>
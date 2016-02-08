<?php
abstract class AbstractEntity
{
	private $_db;
	private $_dateFormat = 'd.m.Y H:i';
	
	protected $dbTable;
	protected $dbColumns;
	protected $dbTablePrimaryKey = 'id';
	protected $dbTablePrimaryKeyValue = '';
	
	protected $filter;
	protected $filterTable;
	protected $filterField;
	
	protected $sortTable;
	protected $sortField;
	protected $sortDirection;
	protected $dbUniqueValues;
	
	public function __construct($primKey = null) {
		$this->_db = Database::getInstance();
		$this->setFilter();
		$this->setSort();
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
		}
	}

	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				$value = $this->getDb()->escapeStr($filter['data']['value']);
				$this->filter[] = $this->filterTable.".".$field." LIKE '%".$value."%'";
			}
			$this->filter = implode(' AND ', $this->filter);
		}
	}
	
	protected function getFilter() {
		return $this->filter;
	}
	
	protected function setSort() {
		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
			$columns = $this->getColumns();
			if (in_array($_REQUEST['sort'], $columns)) {
				$this->sortTable = $this->getTable();
				$this->sortField = $this->getDb()->escapeStr($_REQUEST['sort']);
				$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
			}
		}
	}
	
	protected function getSort() {
		if (!empty($this->sortField) && !empty($this->sortDirection)) {
			return ' ORDER BY '.$this->sortTable.'.'.$this->sortField.' '.$this->sortDirection;
		}
	}
	
	protected function getDb() {
		return $this->_db;
	}

	protected function setPrimaryKey($key) {
		$this->dbTablePrimaryKey = $key;
	}

	protected function getPrimaryKey() {
		return $this->dbTablePrimaryKey;
	}
	
	protected function setPrimaryKeyValue($value) {
		$this->dbTablePrimaryKeyValue = $value;
	}

	protected function getPrimaryKeyValue() {
		return $this->getDb()->escapeStr($this->dbTablePrimaryKeyValue);
	}
	
	protected function getTable() {
		return $this->dbTable;
	}

	protected function getColumns() {
		return $this->dbColumns;
	}
	
	public function getCustomFieldValue($field, $customKey = null, $customKeyValue = null) {
		if ($customKey) {
			$this->setPrimaryKey($customKey);
		}
		$customKeyValue = "'".$customKeyValue."'";
		return $this->getOne($field, $customKeyValue);
	}
	
	public function getOne($field, $primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
		}
		$sql = 'SELECT '.$this->getDb()->escapeStr($field).
				' FROM '.$this->getTable().
				' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		return $this->getDb()->getOne($sql);
	}
	
	protected function getAll() {
		$sql = 'SELECT * FROM '.$this->getTable();
		if ($filter = $this->getFilter()) {
			$sql .= ' WHERE '.$filter;
		}
		$sql .= $this->getSort();
		return $this->getDb()->getAllAssoc($sql);
	}
	
	protected function getRow($primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
		}
		$sql = 'SELECT * FROM '.$this->getTable().
				' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		$result = $this->getDb()->getAllAssoc($sql);
		if (is_array($result) && !empty($result)) {
			return $result[0];	
		}
	}
	
	protected function getDbUniqueValues() {
		return $this->dbUniqueValues;
	}
	
	protected function isUnique($values, $action = 'insert') {
		$validValues = $this->getDbUniqueValues();
		if (!empty($validValues) && is_array($validValues)) {
			foreach ($values as $column => $value) {
				if (array_key_exists($column, $validValues)) {
					$sql = 'SELECT COUNT(*) FROM '.$this->getTable().' WHERE '.$column.' LIKE '.$value;
					if ($action != 'insert') {
						$sql .= ' AND '.$this->getPrimaryKey().' != '.$this->getPrimaryKeyValue();
					}
					$result = $this->getDb()->getOne($sql);
					if ($result > 0) {
						return $validValues[$column];
					}
				}
			}
		}
		return true;
	}
	
	public function insert($data) {
		$values = array();
		$columns = $this->getColumns();
		foreach ($columns as $column) {
			if (array_key_exists($column, $data) && !empty($data[$column]) && !is_array($data[$column])) {
				$values[$column] = "'".$this->getDb()->escapeStr($data[$column])."'";
			}
		}

		if (!empty($values)) {
			$isUnique = $this->isUnique($values);
			if (is_string($isUnique)) {
				return $isUnique;
			}
			$columns = array_keys($values);
			$sql = 'INSERT INTO '.$this->getTable().' ('.implode(',', $columns).') VALUES ('.implode(',', $values).')';
			$this->getDb()->query($sql);
			return $this->getDb()->getLastInsertId();
		}
	}

	public function update($data, $primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
		}
		$values = $validValues = array();
		$columns = $this->getColumns();
		foreach ($data as $column => $value) {
			if (in_array($column, $columns) && isset($value)) {
				$validValues[$column] = "'".$this->getDb()->escapeStr($value)."'";
				$values[] = $this->getDb()->escapeStr($column)."='".$this->getDb()->escapeStr($value)."'";
			}
		}
		if (!empty($values) && !empty($validValues)) {
			$isUnique = $this->isUnique($validValues, 'update');
			if (is_string($isUnique)) {
				return $isUnique;
			}
			$sql = 'UPDATE '.$this->getTable().' SET '.implode(',', $values).' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
			if ($this->getDb()->query($sql)) {
				return true;
			}
		}
	}
	
	public function delete($primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
			$sql = 'DELETE FROM '.$this->getTable().' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
			if ($this->getDb()->query($sql)) {
				return true;
			}
		}		
	}
	
	public function setDateFormat($dateFormat) {
		$this->_dateFormat = $dateFormat;
	}
	
	protected function getDateFormat() {
		return $this->_dateFormat;
	}
	
	public function formatDate($date) {
		$format = $this->getDateFormat();
		setlocale(LC_TIME, 'ru_RU.utf-8', 'rus_RUS.utf-8', 'ru_RU.utf8');
		return strftime($format, $date);
	}
}
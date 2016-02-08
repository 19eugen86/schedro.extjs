<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class MeasureEntity extends AbstractEntity
{
	protected $dbTable = 'measures';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'short_title',
			'is_weight',
			'is_area',
			'is_volume',
			'is_modifiable',
			'is_visible'
		);
		$this->dbUniqueValues = array(
			'title' => 'Такая единица уже существует',
			'short_title' => 'Такое сокращение уже существует'
		);
		parent::__construct($id);
	}
	
	public function getAll() {
		$all = parent::getAll();
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}

	public function getAllModifiable() {
		$sql = "SELECT * FROM ".$this->getTable()." WHERE is_modifiable = 'yes'";
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getAllVisible() {
		$sql = "SELECT * FROM ".$this->getTable()." WHERE is_visible = 'yes'";
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getOneItem($id = null) {
		return parent::getRow($id);
	}

	public function edit($request) {
		if (!empty($request['id'])) {
			$id = $request['id'];
			unset($request['id']);
			return parent::update($request, $id);
		}
	}
	
	public function add($request) {
		unset($request['id']);
		return parent::insert($request);
	}
	
	public function getAllExcluded($filter) {
		if (!empty($filter) && is_array($filter)) {
			$tableColumns = $this->getColumns();
			$sql = "SELECT * FROM ".$this->getTable();
			$filters = array();
			foreach ($filter as $key => $value) {
				if (in_array($key, $tableColumns)) {
					$filters[] = $this->getDb()->escapeStr($key)." != '".$this->getDb()->escapeStr($value)."'";
				}
			}
			if (!empty($filters)) {
				$filterStr = implode(' AND ', $filters);
				$sql .= ' WHERE '.$filterStr;
			}
			$result = $this->getDb()->getAllAssoc($sql);
			return array(
				'data' => $result,
				'total' => count($result)
			);
		}
	}

	public function makeVisible($primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
			$sql = 'UPDATE '.$this->getTable().' SET is_visible = \'yes\' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
			if ($this->getDb()->query($sql)) {
				return true;
			}
		}		
	}
	
	public function makeInvisible($primKey = null) {
		if ($primKey) {
			$this->setPrimaryKeyValue($primKey);
			$sql = 'UPDATE '.$this->getTable().' SET is_visible = \'no\' WHERE '.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
			if ($this->getDb()->query($sql)) {
				return true;
			}
		}		
	}
}
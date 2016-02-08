<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class DcStoreEntity extends AbstractEntity
{
	protected $dbTable = 'dc_s_stores';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'dc_id'
		);
		parent::__construct($id);
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', SUM(dc_s_stores_cells.area) AS area';
		$select .= ', dc_s.title AS dc_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' LEFT JOIN dc_s_stores_cells ON ('.$this->getTable().'.id = dc_s_stores_cells.dc_store_id)';
		$sql .= ' LEFT JOIN dc_s ON ('.$this->getTable().'.dc_id = dc_s.id)';
		$sql .= ' GROUP BY '.$this->getTable().'.id';
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getGroupedBy($key, $value, $filterTable = '') {
		$value = "'".$this->getDb()->escapeStr($value)."'";
		if (empty($filterTable)) {
			$filterTable = $this->getTable();
		}
		$select = $this->getTable().'.*';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' WHERE '.$filterTable.'.'.$key.' = '.$value;
		
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getOneItem($id = null) {
		if ($id) {
			$this->setPrimaryKeyValue($id);
		}
		$select = $this->getTable().'.*';
		$select .= ', dc_s.title AS dc_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN dc_s ON ('.$this->getTable().'.dc_id = dc_s.id)';
		$sql .= ' WHERE '.$this->getTable().'.'.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		$result = $this->getDb()->getAllAssoc($sql);
		if (is_array($result) && !empty($result)) {
			return $result[0];	
		}
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
}
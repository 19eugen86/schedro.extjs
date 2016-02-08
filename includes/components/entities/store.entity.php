<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class StoreEntity extends AbstractEntity
{
	protected $dbTable = 'aff_stores';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'aff_id'
		);
		parent::__construct($id);
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', SUM(aff_stores_cells.area) AS area';
		$select .= ', affiliates.title AS aff_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' LEFT JOIN aff_stores_cells ON ('.$this->getTable().'.id = aff_stores_cells.aff_store_id)';
		$sql .= ' LEFT JOIN affiliates ON ('.$this->getTable().'.aff_id = affiliates.id)';
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
		$select .= ', affiliates.title AS aff_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN affiliates ON ('.$this->getTable().'.aff_id = affiliates.id)';
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
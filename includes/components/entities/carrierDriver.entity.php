<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class CarrierDriverEntity extends AbstractEntity
{
	protected $dbTable = 'carriers_drivers';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'fullname',
			'phone_number',
			'carrier_id'
		);
		parent::__construct($id);
	}
	
	protected function setSort() {
		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
			$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
			$sort = $this->getDb()->escapeStr($_REQUEST['sort']);
			switch ($sort) {
				case 'carrier_title':
					$this->sortTable = 'carriers';
					$this->sortField = 'title';
					break;
				default:
					parent::setSort();
					break;
			}
		}
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'carrier_title') {
					$this->filterTable = 'carriers';
					$field = 'title';
				}
				$value = $this->getDb()->escapeStr($filter['data']['value']);
				$this->filter[] = $this->filterTable.".".$field." LIKE '%".$value."%'";
			}
			$this->filter = implode(' AND ', $this->filter);
		}
	}
	
	public function getGroupedBy($key, $value, $filterTable = '') {
		$value = "'".$this->getDb()->escapeStr($value)."'";
		if (empty($filterTable)) {
			$filterTable = $this->getTable();
		}
		$select = $this->getTable().'.*';
		$select .= ', carriers.title AS carrier_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN carriers ON ('.$this->getTable().'.carrier_id = carriers.id)';
		$sql .= ' WHERE '.$filterTable.'.'.$key.' = '.$value;
		
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', carriers.title AS carrier_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN carriers ON ('.$this->getTable().'.carrier_id = carriers.id)'; 
		if ($filter = $this->getFilter()) {
			$sql .= ' WHERE '.$filter;
		}
		$sql .= $this->getSort();
		
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
		$select .= ', carriers.title AS carrier_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN carriers ON ('.$this->getTable().'.carrier_id = carriers.id)'; 
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
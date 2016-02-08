<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class FactoryEntity extends AbstractEntity
{
	protected $dbTable = 'factories';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'description',
			'address',
			'city_id'
		);
		$this->dbUniqueValues = array(
			'title' => 'Такой комбинат уже существует'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'city_name') {
					$this->filterTable = 'cities';
				}
				$value = $this->getDb()->escapeStr($filter['data']['value']);
				$this->filter[] = $this->filterTable.".".$field." LIKE '%".$value."%'";
			}
			$this->filter = implode(' AND ', $this->filter);
		}
	}
	
	protected function setSort() {
		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
			$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
			$sort = $this->getDb()->escapeStr($_REQUEST['sort']);
			switch ($sort) {
				case 'city_name':
					$this->sortTable = 'cities';
					$this->sortField = 'city_name';
					break;
				default:
					parent::setSort();
					break;
			}
		}
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', cities.city_name AS city_name';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN cities ON ('.$this->getTable().'.city_id = cities.id)';
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
		$select .= ', cities.city_name AS city_name';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN cities ON ('.$this->getTable().'.city_id = cities.id)';
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
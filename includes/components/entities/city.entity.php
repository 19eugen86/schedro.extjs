<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class CityEntity extends AbstractEntity
{
	protected $dbTable = 'cities';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'city_name',
			'country_id'
		);
		$this->dbUniqueValues = array(
			'city_name' => 'Такой город уже существует'
		);
		parent::__construct($id);
	}
	
	protected function setSort() {
		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
			$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
			$sort = $this->getDb()->escapeStr($_REQUEST['sort']);
			switch ($sort) {
				case 'country_title':
					$this->sortTable = 'countries';
					$this->sortField = 'title';
					break;
				default:
					parent::setSort();
					break;
			}
		}
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', countries.title AS country_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN countries ON ('.$this->getTable().'.country_id = countries.id)';
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
		$select .= ', countries.title AS country_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN countries ON ('.$this->getTable().'.country_id = countries.id)';
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
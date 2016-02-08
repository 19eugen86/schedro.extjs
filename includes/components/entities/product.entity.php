<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class ProductEntity extends AbstractEntity
{
	protected $dbTable = 'products';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'group_id'
		);
		$this->dbUniqueValues = array(
			'title' => 'Такой продукт уже существует'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'group_title') {
					$this->filterTable = 'product_groups';
					$field = 'title';
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
				case 'group_title':
					$this->sortTable = 'product_groups';
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
		$select .= ', product_groups.title AS group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN product_groups ON ('.$this->getTable().'.group_id = product_groups.id)'; 
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
	
	public function getGroupedBy($key, $value, $filterTable = '') {
		$value = "'".$this->getDb()->escapeStr($value)."'";
		if (empty($filterTable)) {
			$filterTable = $this->getTable();
		}
		$select = $this->getTable().'.*';
		$select .= ', product_groups.title AS group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN product_groups ON ('.$this->getTable().'.group_id = product_groups.id)';
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
		$select .= ', product_groups.title AS group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN product_groups ON ('.$this->getTable().'.group_id = product_groups.id)';
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
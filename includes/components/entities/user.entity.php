<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class UserEntity extends AbstractEntity
{
	protected $dbTable = 'users';
	
	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'login',
			'password',
			'email',
			'fullname',
			'cphone',
			'wphone',
			'hphone',
			'type',
			'address',
			'is_blocked',
			'dob',
			'user_group_id'
		);
		$this->dbUniqueValues = array(
			'login' => 'Пользователь с таким логином уже существует',
			'email' => 'Пользователь с таким электронным ящиком уже существует'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'user_group_title') {
					$this->filterTable = 'user_groups';
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
				case 'user_group_title':
					$this->sortTable = 'user_groups';
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
		$select .= ', user_groups.title AS user_group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN user_groups ON ('.$this->getTable().'.user_group_id = user_groups.id)'; 
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
		$sql = 'SELECT '.$this->getTable().'.*, user_groups.title AS user_group_title FROM '.$this->getTable();
		$sql .= ' INNER JOIN user_groups ON ('.$this->getTable().'.user_group_id = user_groups.id)';
		$sql .= ' WHERE '.$this->getTable().'.'.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		$result = $this->getDb()->getAllAssoc($sql);
		if (is_array($result) && !empty($result)) {
			unset($result[0]['password']);
			return $result[0];	
		}
	}
	
	public function edit($request) {
		unset($request['user_group']);
		if (!empty($request['id'])) {
			$id = $request['id'];
			unset($request['id']);
		}
		
		if (empty($request['password'])) {
			unset($request['password']);
		} else {
			$request['password'] = md5($request['password']);
		}
		
		if (!empty($id)) {
			return parent::update($request, $id); 
		}
	}
	
	public function add($request) {
		unset($request['id']);
		$request['password'] = md5($request['password']);
		return parent::insert($request);
	}
	
	public function block($id) {
		return parent::update(
			array('is_blocked' => 'yes'),
			$id
		);
	}

	public function unblock($id) {
		return parent::update(
			array('is_blocked' => 'no'),
			$id
		);
	}
}
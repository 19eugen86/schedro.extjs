<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class ProductGroupEntity extends AbstractEntity
{
	protected $dbTable = 'product_groups';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title'
		);
		$this->dbUniqueValues = array(
			'title' => 'Такая группа уже существует'
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
}
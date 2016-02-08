<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class CarrierEntity extends AbstractEntity
{
	protected $dbTable = 'carriers';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'description'
		);
		$this->dbUniqueValues = array(
			'title' => 'Такой перевозчик уже существует'
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
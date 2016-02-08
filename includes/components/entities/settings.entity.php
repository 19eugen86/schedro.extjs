<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class SettingsEntity extends AbstractEntity
{
	protected $dbTable = 'settings';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'description',
			'sys_key',
			'sys_value',
			'is_modifiable'
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
			unset($request['sys_key']);
			return parent::update($request, $id);
		}
	}

	public function add($request) {
		unset($request['id']);
		return parent::insert($request);
	}

	public function getSetting($key) {
		$this->setPrimaryKey('sys_key');
		$setting = $this->getOne('sys_value', "'".$key."'");
		$this->setPrimaryKey('id');
		
		return $setting;
	}
}
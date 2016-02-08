<?php
require_once ENTITIES_COMPONENTS_DIR.'factory.entity.php';
class DcEntity extends FactoryEntity
{
	protected $dbTable = 'dc_s';

	public function __construct($id = null) {
		parent::__construct($id);
		$this->dbUniqueValues = array(
			'title' => 'Такой РЦ уже существует'
		);
	}
}
<?php
require_once ENTITIES_COMPONENTS_DIR.'factory.entity.php';
class ClientEntity extends FactoryEntity
{
	protected $dbTable = 'clients';

	public function __construct($id = null) {
		parent::__construct($id);
		$this->dbUniqueValues = array(
			'title' => 'Такой клиент уже существует'
		);
	}
}
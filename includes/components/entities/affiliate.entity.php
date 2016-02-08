<?php
require_once ENTITIES_COMPONENTS_DIR.'factory.entity.php';
class AffiliateEntity extends FactoryEntity
{
	protected $dbTable = 'affiliates';

	public function __construct($id = null) {
		parent::__construct($id);
		$this->dbUniqueValues = array(
			'title' => 'Такой филиал уже существует'
		);
	}
}
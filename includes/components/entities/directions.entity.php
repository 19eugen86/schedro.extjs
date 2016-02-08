<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class DirectionsEntity extends AbstractEntity
{
	protected $dbTable = 'products_movement_directions';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'direction_key',
			'type'
		);
		parent::__construct($id);
	}
	
	public function getAllFiltered($start) {
		$possibleValues = array('f', 'd', 'a', 'c');
		if (in_array($start, $possibleValues)) {
			$sql = 'SELECT * FROM '.$this->getTable();
			$sql .= ' WHERE direction_key LIKE \''.$start.'%\'';
			$all = $this->getDb()->getAllAssoc($sql);
			return array(
				'data' => $all,
				'total' => count($all)
			);
		}
	}
	
	public function getOneItem($id = null) {
		return parent::getRow($id);
	}
}
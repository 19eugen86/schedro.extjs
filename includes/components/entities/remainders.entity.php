<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class RemindersEntity extends AbstractEntity
{
	private $_recipientsField = '';
	private $_recipientsTable = '';
	
	public function __construct($id = null, $type = '') {
		$this->dbColumns = array(
			'id',
			'product_factored_id',
			'remainder',
			'datetime_modified'
		);
		switch ($type) {
			case 'factory':
				$this->dbTable = 'factories_remainders';
				$this->_recipientsField = 'factory_id';
				$this->_recipientsTable = 'factories';
				break;

			case 'dcCells':
				$this->dbTable = 'dc_s_stores_cells_remainders';
				$this->_recipientsField = 'dc_cell_id';
				$this->_recipientsTable = 'dc_s_stores_cells';
				$this->dbColumns[] = 'dc_store_id';
				$this->dbColumns[] = 'user_id';
				break;
				
			case 'dc':
				$this->dbTable = 'dc_s_remainders';
				$this->_recipientsField = 'dc_id';
				$this->_recipientsTable = 'dc_s';
				break;

			case 'cells':
				$this->dbTable = 'aff_stores_cells_remainders';
				$this->_recipientsField = 'aff_cell_id';
				$this->_recipientsTable = 'aff_stores_cells';
				$this->dbColumns[] = 'aff_store_id';
				$this->dbColumns[] = 'user_id';
				break;
				
			case 'affiliate':
			default:
				$this->dbTable = 'aff_remainders';
				$this->_recipientsField = 'aff_id';
				$this->_recipientsTable = 'affiliates';
				break;
		}
		$this->dbColumns[] = $this->_recipientsField;
		parent::__construct($id);
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
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', products_factored.products_part AS products_part';
		$select .= ', products.title AS product_title';
		$select .= ', '.$this->_recipientsTable.'.title AS place_title';
		$select .= ', product_groups.title AS group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products_factored.product_id = products.id)';
		$sql .= ' INNER JOIN '.$this->_recipientsTable.' ON ('.$this->getTable().'.'.$this->_recipientsField.' = '.$this->_recipientsTable.'.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' WHERE '.$this->getTable().'.remainder > 0';
		if ($filter = $this->getFilter()) {
			$sql .= ' AND '.$filter;
		}
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		if (!empty($all)) {
			foreach ($all as $key => $product) {
				$all[$key]['date_formated'] = $this->formatDate($all[$key]['datetime_modified']);
			}  
		}
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getCellsRemainders($cellsType = 'aff') {
		$select = $this->getTable().'.*';
		$select .= ', products_factored.products_part AS products_part';
		$select .= ', products.title AS product_title';
		$select .= ', product_groups.title AS group_title';
		
		if ($cellsType == 'aff') {
			$select .= ', affiliates.title AS aff_title';
			$select .= ', aff_stores.title AS aff_store_title';
			$select .= ', aff_stores_cells.title AS aff_cell_title';
		} elseif ($cellsType == 'dc') {
			$select .= ', dc_s.title AS dc_title';
			$select .= ', dc_s_stores.title AS dc_store_title';
			$select .= ', dc_s_stores_cells.title AS dc_cell_title';
		}
		
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products_factored.product_id = products.id)';
		$sql .= ' INNER JOIN '.$this->_recipientsTable.' ON ('.$this->getTable().'.'.$this->_recipientsField.' = '.$this->_recipientsTable.'.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		
		if ($cellsType == 'aff') {
			$sql .= ' INNER JOIN aff_stores ON ('.$this->getTable().'.aff_store_id = aff_stores.id)';
			$sql .= ' INNER JOIN affiliates ON (aff_stores.aff_id = affiliates.id)';
		} elseif ($cellsType == 'dc') {
			$sql .= ' INNER JOIN dc_s_stores ON ('.$this->getTable().'.dc_store_id = dc_s_stores.id)';
			$sql .= ' INNER JOIN dc_s ON (dc_s_stores.dc_id = dc_s.id)';
		}
		
		$sql .= ' WHERE '.$this->getTable().'.remainder > 0';
		if ($filter = $this->getFilter()) {
			$sql .= ' AND '.$filter;
		}
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		if (!empty($all)) {
			foreach ($all as $key => $product) {
				$all[$key]['date_formated'] = $this->formatDate($all[$key]['datetime_modified']);
			}  
		}
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getCurrentRemainder($factoredProductId, $placeId) {
		$sql = 'SELECT remainder'.
				' FROM '.$this->getTable().
				' WHERE product_factored_id='.intval($factoredProductId).
				' AND '.$this->_recipientsField.'='.intval($placeId);
		return $this->getDb()->getOne($sql);
	}
	
	protected function updateRemainders($request, $operation) {
		if (is_numeric($request['quantity'])) {
			$request['remainder'] = $request['quantity'];
			$request['datetime_modified'] = strtotime('now');

			// Пересчитываем кол-во в килограммы. Все остатки хранятся в кг. 
			if ($request['measure_id'] != KG_MEASURE) {
				if ($request['measure_id'] == GM_MEASURE || $request['measure_id'] == TN_MEASURE) {
					$product = 0;
				} else {
					$product = $request['product_id'];
				}
				$entity = EntityFactory::loadEntity('MeasureRates');
				$request['remainder'] = $entity->getRatedValue(
					$request['measure_id'],
					KG_MEASURE,
					$product,
					$request['quantity']
				);
			}
			
			// Проверяем наличие текущего остатка
			$current = $this->getCurrentRemainder($request['product_factored_id'], $request[$this->_recipientsField]);
			if ($current === null) { // Нет записи в БД. Добавляем новый остаток.
				if ($this->add($request)) {
					return true;
				}
			} else { // Обновляем текущий остаток. (Текущий остаток может быть >= 0)
				$action = ($operation == 'add') ? '+' : '-';
				$sql = 'UPDATE '.$this->getTable().' SET remainder=remainder'.$action.$request['remainder'];
				$sql .= ', datetime_modified='.$request['datetime_modified'];
				$sql .= ' WHERE product_factored_id='.intval($request['product_factored_id']);
				$sql .= ' AND '.$this->_recipientsField.'='.intval($request[$this->_recipientsField]);
				if ($this->getDb()->query($sql)) {
					return true;
				}
			}
		}
	}
	
	public function increaseReminder($request) {
		return $this->updateRemainders($request, 'add');
	}
	
	public function decreaseReminder($request) {
		return $this->updateRemainders($request, 'ship');
	}

	public function getAvailableGroups($place) {
		$sql = 'SELECT DISTINCT product_groups.id, product_groups.title FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products_factored.product_id = products.id)';
		$sql .= ' INNER JOIN '.$this->_recipientsTable.' ON ('.$this->getTable().'.'.$this->_recipientsField.'='.$this->_recipientsTable.'.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' WHERE '.$this->_recipientsTable.'.id='.intval($place);
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getAvailableProducts($place, $group) {
		$sql = 'SELECT DISTINCT products.id, products.title FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products_factored.product_id = products.id)';
		$sql .= ' INNER JOIN '.$this->_recipientsTable.' ON ('.$this->getTable().'.'.$this->_recipientsField.'='.$this->_recipientsTable.'.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' WHERE '.$this->_recipientsTable.'.id='.intval($place);
		$sql .= ' AND product_groups.id='.intval($group);
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getAvailableParts($place, $product) {
		$sql = 'SELECT products_factored.products_part, '.$this->getTable().'.remainder FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' WHERE products_factored.product_id='.intval($product);
		$sql .= ' AND '.$this->getTable().'.'.$this->_recipientsField.'='.intval($place);
		$all = $this->getDb()->getAllAssoc($sql);
		$availableParts = array();
		if (!empty($all) && is_array($all)) {
			foreach ($all as $row) {
				if ($row['remainder'] > 0) {
					$row['products_part'] = $row['products_part'].' (Остаток: '.$row['remainder'].'кг)';
					$availableParts[] = $row;
				}
			}
		}
		return array(
			'data' => $availableParts,
			'total' => count($availableParts)
		);
	}
}
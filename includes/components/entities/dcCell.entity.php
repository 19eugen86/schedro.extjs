<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class DcCellEntity extends AbstractEntity
{
	protected $dbTable = 'dc_s_stores_cells';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'title',
			'dc_store_id',
			'product_group_id',
			'area',
			'volume'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'store') {
					$this->filterTable = 'dc_s_stores';
					$field = 'title';
				} elseif ($field == 'product_group') {
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
				case 'product_group':
					$this->sortTable = 'product_groups';
					$this->sortField = 'title';
					break;
				case 'store':
					$this->sortTable = 'dc_s_stores';
					$this->sortField = 'title';
					break;
				default:
					parent::setSort();
					break;
			}
		}
	}
	
	public function getGroupedBy($key, $value, $filterTable = '') {
		$value = "'".$this->getDb()->escapeStr($value)."'";
		if (empty($filterTable)) {
			$filterTable = $this->getTable();
		}
		$select = $this->getTable().'.*';
		$select .= ', dc_s_stores.title AS dc_store_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN dc_s_stores ON ('.$this->getTable().'.dc_store_id = dc_s_stores.id)';
		$sql .= ' WHERE '.$filterTable.'.'.$key.' = '.$value;
		
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getCellProducts($cell) {
		$select = 'dc_s_stores_cells_remainders.*';
		$select .= ', products_factored.product_id AS product_id';
		$sql = 'SELECT '.$select.' FROM dc_s_stores_cells_remainders';
		$sql .= ' INNER JOIN products_factored ON (dc_s_stores_cells_remainders.product_factored_id = products_factored.id)';
		$sql .= ' WHERE dc_s_stores_cells_remainders.dc_cell_id = '.intval($cell);
		$all = $this->getDb()->getAllAssoc($sql);
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getCellFreeArea($cell) {
		$cellInfo = $this->getOneItem($cell);
		$freeArea = $cellInfo['area'];

		$cellProducts = $this->getCellProducts($cell);
		if ($cellProducts['total'] > 0) {
			$entity = EntityFactory::loadEntity('MeasureRates');
			foreach ($cellProducts['data'] as $product) {
				if ($product['remainder'] > 0) {
					// Получаем кол-во поддонов на основании остатков. Остаток всегда в кг
					$panNum = ceil(
						$entity->getRatedValue(
							KG_MEASURE,
							P_MEASURE,
							$product['product_id'],
							$product['remainder']
						)
					);
					// Получаем текущую занимаемую площадь
					$usedArea = ceil($entity->getRatedValue(P_MEASURE, M2_MEASURE, 0, $panNum));
					$freeArea -= $usedArea;
				}
			}
		}
		return $freeArea;
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', product_groups.title AS product_group';
		$select .= ', dc_s_stores.title AS dc_store_title';
		$select .= ', dc_s.title AS dc_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN product_groups ON ('.$this->getTable().'.product_group_id = product_groups.id)';
		$sql .= ' INNER JOIN dc_s_stores ON ('.$this->getTable().'.dc_store_id = dc_s_stores.id)';
		$sql .= ' INNER JOIN dc_s ON (dc_s.id = dc_s_stores.dc_id)';
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
		$select = $this->getTable().'.*';
		$select .= ', product_groups.title AS product_group';
		$select .= ', dc_s_stores.title AS dc_store_title';
		$select .= ', dc_s.title AS ds_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN product_groups ON ('.$this->getTable().'.product_group_id = product_groups.id)';
		$sql .= ' INNER JOIN dc_s_stores ON ('.$this->getTable().'.dc_store_id = dc_s_stores.id)';
		$sql .= ' INNER JOIN dc_s ON (dc_s.id = dc_s_stores.dc_id)';
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
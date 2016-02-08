<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class MeasureRateEntity extends AbstractEntity
{
	protected $dbTable = 'measures_rates';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'measure1_id',
			'measure2_id',
			'rate',
			'product_id',
			'is_modifiable'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$field = $this->getDb()->escapeStr($filter['field']);
				switch ($field) {
					case 'measure1_title':
						$this->filterTable = 'm1';
						$field = 'title';
						break;
					case 'measure2_title':
						$this->filterTable = 'm2';
						$field = 'title';
						break;
					case 'product_title':
						$this->filterTable = 'p';
						$field = 'title';
						break;
					default:
						$this->filterTable = 'mr';
						break;
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
				case 'measure1_title':
					$this->sortTable = 'm1';
					$this->sortField = 'title';
					break;
				case 'measure2_title':
					$this->sortTable = 'm2';
					$this->sortField = 'title';
					break;
				case 'product_title':
					$this->sortTable = 'p';
					$this->sortField = 'title';
					break;
				default:
					$this->sortTable = 'mr';
					$this->sortField = $this->getDb()->escapeStr($_REQUEST['sort']);
					break;
			}
		}
	}
	
	public function getAll() {
		$select = 'mr.*';
		$select .= ', m1.title AS measure1_title';
		$select .= ', m2.title AS measure2_title';
		$select .= ', p.title AS product_title';
		$select .= ', pg.title AS group_title';
		
		$sql = 'SELECT '.$select.' FROM '.$this->getTable().' mr';
		$sql .= ' INNER JOIN measures m1 ON (mr.measure1_id = m1.id)';
		$sql .= ' INNER JOIN measures m2 ON (mr.measure2_id = m2.id)';
		$sql .= ' INNER JOIN products p ON (mr.product_id = p.id)';
		$sql .= ' INNER JOIN product_groups pg ON (p.group_id = pg.id)';
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
		$select = 'mr.*';
		$select .= ', m1.title AS measure1_title';
		$select .= ', m2.title AS measure2_title';
		$select .= ', p.title AS product_title';
		$select .= ', pg.title AS group_title';
		
		$sql = 'SELECT '.$select.' FROM '.$this->getTable().' mr';
		$sql .= ' INNER JOIN measures m1 ON (mr.measure1_id = m1.id)';
		$sql .= ' INNER JOIN measures m2 ON (mr.measure2_id = m2.id)';
		$sql .= ' INNER JOIN products p ON (mr.product_id = p.id)';
		$sql .= ' INNER JOIN product_groups pg ON (p.group_id = pg.id)';
		$sql .= ' WHERE mr.'.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		$result = $this->getDb()->getAllAssoc($sql);
		if (is_array($result) && !empty($result)) {
			return $result[0];	
		}
	}

	public function getLinkedMeasures($originalId, $quantity, $excluded = null) {
		$select = 'mr.*';
		$select .= ', m1.short_title AS measure1_title';
		$select .= ', m2.short_title AS measure2_title';
		$select .= ', p.title AS product_title';
		$select .= ', pg.title AS group_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable().' mr';
		$sql .= ' INNER JOIN measures m1 ON (mr.measure1_id = m1.id)'; 
		$sql .= ' INNER JOIN measures m2 ON (mr.measure2_id = m2.id)'; 
		$sql .= ' INNER JOIN products p ON (mr.product_id = p.id)';
		$sql .= ' INNER JOIN product_groups pg ON (p.group_id = pg.id)';
		$sql .= ' WHERE mr.measure1_id = '.$originalId.' OR mr.measure2_id = '.$originalId;
		if (!empty($excluded)) {
			$sql .= ' AND mr.measure1_id != '.$excluded.' AND mr.measure2_id != '.$excluded;
			die($sql);
		}
		$linked = $this->getDb()->getAllAssoc($sql);
		if (!empty($linked)) {
			foreach ($linked as $key => $linkedMeasure) {
				if ($originalId == $linkedMeasure['measure1_id']) {
					$linkedId = $linkedMeasure['measure2_id'];
					$linkedName = $linkedMeasure['measure2_title'];
					$linkedValue = number_format($quantity*$linkedMeasure['rate'], EntityFactory::getSetting('decimal_digits_num'));
				} elseif ($originalId == $linkedMeasure['measure2_id']) {
					$linkedId = $linkedMeasure['measure1_id'];
					$linkedName = $linkedMeasure['measure1_title'];
					$linkedValue = number_format($quantity/$linkedMeasure['rate'], EntityFactory::getSetting('decimal_digits_num'));
				}
				$linked[$key]['linked_id'] = $linkedId;
				$linked[$key]['linked_name'] = $linkedName;
				$linked[$key]['linked_value'] = $linkedValue;
			}
		}
		return $linked;
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
	
	public function getRatedValue($originM, $rateM, $product = 0, $value) {
		$sql = 'SELECT rate FROM '.$this->getTable().' WHERE measure1_id='.intval($originM).' AND measure2_id='.intval($rateM);
		if ($product > 0) {
			$sql .= ' AND product_id='.intval($product);
		}
		$rate = $this->getDb()->getOne($sql);
		if (!empty($rate)) {
			return round($value*$rate, EntityFactory::getSetting('decimal_digits_num'));
		} else {
			$sql = 'SELECT rate FROM '.$this->getTable().' WHERE measure2_id='.intval($originM).' AND measure1_id='.intval($rateM);
			if ($product > 0) {
				$sql .= ' AND product_id='.intval($product);
			}
			$rate = $this->getDb()->getOne($sql);
			if (!empty($rate)) {
				return round($value/$rate, EntityFactory::getSetting('decimal_digits_num'));
			}
		}
	}
	
	public function getAllLinkedToOne($originM, $product = 0) {
		$sql = 'SELECT * FROM '.$this->getTable().' WHERE measure1_id='.intval($originM).' OR measure2_id='.intval($originM);
		if ($product > 0) {
			$sql .= ' AND product_id='.intval($product);
		}
		$result = $this->getDb()->getAllAssoc($sql);
		if (is_array($result) && !empty($result)) {
			return $result;	
		}
	}
}
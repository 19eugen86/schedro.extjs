<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class ProductsFactoredEntity extends AbstractEntity
{
	protected $dbTable = 'products_factored';

	public function __construct($id = null) {
		$this->dbColumns = array(
			'id',
			'products_part',
			'factored_date',
			'product_id',
			'measure_id',
			'quantity',
			'factory_id',
			'dc_id',
			'datetime',
			'user_id'
		);
		parent::__construct($id);
	}
	
	protected function setFilter() {
		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
			foreach ($_REQUEST['filter'] as $filter) {
				$this->filterTable = $this->getTable();
				$field = $this->getDb()->escapeStr($filter['field']);
				if ($field == 'date_formated') {
					$field = 'factored_date';
					if (!empty($filter['data']['comparison'])) {
						if ($filter['data']['comparison'] == 'lt') {
							$filter['data']['value'] .= '23:59:59';
							$this->filter[] = $this->filterTable.".".$field.">".strtotime($filter['data']['value']);
						} elseif ($filter['data']['comparison'] == 'gt') {
							$filter['data']['value'] .= '00:00:00';
							$this->filter[] = $this->filterTable.".".$field."<".strtotime($filter['data']['value']);
						} elseif ($filter['data']['comparison'] == 'eq') {
							$start = strtotime($filter['data']['value'].' 00:00:00');
							$finish = strtotime($filter['data']['value'].' 23:59:59');
							$this->filter[] = $this->filterTable.".".$field.">=".$start." AND ".
												$this->filterTable.".".$field."<=".$finish;
						}
					}
				} else {
					if ($field == 'factory_title') {
						$this->filterTable = 'factories';
						$field = 'title';
					} elseif ($field == 'product_title') {
						$this->filterTable = 'products';
						$field = 'title';
					} elseif ($field == 'measure_title') {
						$this->filterTable = 'measures';
						$field = 'title';
					} elseif ($field == 'group_title') {
						$this->filterTable = 'product_groups';
						$field = 'title';
					} elseif ($field == 'user') {
						$this->filterTable = 'users';
						$field = 'fullname';
					}
					$value = $this->getDb()->escapeStr($filter['data']['value']);
					$this->filter[] = $this->filterTable.".".$field." LIKE '%".$value."%'";	
				}
			}
			$this->filter = implode(' AND ', $this->filter);
		}
	}
	
	protected function setSort() {
		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
			$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
			$sort = $this->getDb()->escapeStr($_REQUEST['sort']);
			switch ($sort) {
				case 'date_formated':
					$this->sortTable = $this->getTable();
					$this->sortField = 'factored_date';
					break;
				case 'product_title':
					$this->sortTable = 'products';
					$this->sortField = 'title';
					break;
				case 'group_title':
					$this->sortTable = 'product_groups';
					$this->sortField = 'title';
					break;
				case 'measure_title':
					$this->sortTable = 'measures';
					$this->sortField = 'title';
					break;
				case 'factory_title':
					$this->sortTable = 'factories';
					$this->sortField = 'title';
					break;
				case 'user':
					$this->sortTable = 'users';
					$this->sortField = 'fullname';
					break;
				default:
					parent::setSort();
					break;
			}
		}
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', products.title AS product_title';
		$select .= ', measures.title AS measure_title';
		$select .= ', factories.title AS factory_title';
		$select .= ', measures.short_title AS measure_short_title';
		$select .= ', users.fullname AS user';
		$select .= ', product_groups.title AS group_title';
		$select .= ', products.title AS product_title';
		$select .= ', factories_remainders.remainder AS remainder';
				
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products ON ('.$this->getTable().'.product_id = products.id)'; 
		$sql .= ' INNER JOIN measures ON ('.$this->getTable().'.measure_id = measures.id)';
		$sql .= ' INNER JOIN factories ON ('.$this->getTable().'.factory_id = factories.id)';
		$sql .= ' INNER JOIN users ON ('.$this->getTable().'.user_id = users.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' INNER JOIN factories_remainders ON ('.$this->getTable().'.id = factories_remainders.product_factored_id)';
		if ($filter = $this->getFilter()) {
			$sql .= ' WHERE '.$filter;
		}
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		if (!empty($all)) {
			$entity = EntityFactory::loadEntity('Remainders', 'factory');
			foreach ($all as $key => $product) {
//				$all[$key]['date_formated'] = $this->formatDate($all[$key]['datetime']);
				$all[$key]['date_formated'] = str_replace(' 00:00', '', $this->formatDate($all[$key]['factored_date']));
				$all[$key]['remainder'] = $entity->getCurrentRemainder($product['id'], $product['factory_id']);
			}  
		}
		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
	public function getAllAvailable() {
		$select = $this->getTable().'.*';
		$select .= ', products.title AS product_title';
		$select .= ', measures.title AS measure_title';
		$select .= ', factories.title AS factory_title';
		$select .= ', measures.short_title AS measure_short_title';
		$select .= ', users.fullname AS user';
		$select .= ', product_groups.title AS group_title';
		$select .= ', products.title AS product_title';
		$select .= ', factories_remainders.remainder AS remainder';
				
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products ON ('.$this->getTable().'.product_id = products.id)'; 
		$sql .= ' INNER JOIN measures ON ('.$this->getTable().'.measure_id = measures.id)';
		$sql .= ' INNER JOIN factories ON ('.$this->getTable().'.factory_id = factories.id)';
		$sql .= ' INNER JOIN users ON ('.$this->getTable().'.user_id = users.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' INNER JOIN factories_remainders ON ('.$this->getTable().'.id = factories_remainders.product_factored_id)';
		$sql .= ' WHERE factories_remainders.remainder > 0';
		if ($filter = $this->getFilter()) {
			$sql .= ' AND '.$filter;
		}
		$sql .= $this->getSort();
		$all = $this->getDb()->getAllAssoc($sql);
		if (!empty($all)) {
			$entity = EntityFactory::loadEntity('Remainders', 'factory');
			foreach ($all as $key => $product) {
				$all[$key]['date_formated'] = str_replace(' 00:00', '', $this->formatDate($all[$key]['factored_date']));
				$all[$key]['remainder'] = $entity->getCurrentRemainder($product['id'], $product['factory_id']);
			}
		}
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
		$select .= ', products.title AS product_title';
		$select .= ', measures.short_title AS measure_title';
		$select .= ', product_groups.title AS group_title';
		$select .= ', factories.title AS factory_title';
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products ON ('.$this->getTable().'.product_id = products.id)';
		$sql .= ' INNER JOIN measures ON ('.$this->getTable().'.measure_id = measures.id)';
		$sql .= ' INNER JOIN factories ON ('.$this->getTable().'.factory_id = factories.id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
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
	
	public function getFactoredProduct($product, $productPart) {
		$productPart = substr($productPart, 0, strpos($productPart, ' (Остаток:'));
		$productPart = "'".$this->getDb()->escapeStr($productPart)."'";
		$sql = 'SELECT id FROM '.$this->getTable();
		$sql .= ' WHERE product_id='.intval($product);
		$sql .= ' AND products_part LIKE '.$productPart;
		$result = $this->getDb()->getOne($sql);
		if (!empty($result)) {
			return intval($result);	
		}
	}
}
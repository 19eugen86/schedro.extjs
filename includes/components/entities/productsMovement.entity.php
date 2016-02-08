<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';
class ProductsMovementEntity extends AbstractEntity
{
	private $_directions = array('ac');
	protected $dbTable = 'products_movement';

	public function __construct($id = null, $directions = '') {
		$this->dbColumns = array(
			'id',
			'product_factored_id',
			'measure_id',
			'quantity',
			'from_id',
			'from_cell_id',
			'to_id',
			'direction',
			'carrier_id',
			'carrier_driver_id',
			'carrier_vehicle_id',
			'datetime',
			'user_id',
			'status',
		);
		
		if (!empty($directions)) {
			$this->_directions = $directions;
		}
		
		parent::__construct($id);
	}
	
	public function getAll() {
		$select = $this->getTable().'.*';
		$select .= ', products_factored.products_part AS products_part';
		$select .= ', product_groups.id AS group_id';
		$select .= ', product_groups.title AS group_title';
		$select .= ', measures.title AS measure_title';
		$select .= ', measures.short_title AS measure_short_title';
		$select .= ', products.id AS product_id';
		$select .= ', products.title AS product_title';
		$select .= ', factories.title AS factory_title';
		$select .= ', users.fullname AS user';
		$select .= ', carriers.title AS carrier_title';
		$select .= ', carriers_drivers.fullname AS carrier_driver_fullname';
		$select .= ', CONCAT(carriers_vehicles.make, \' \', carriers_vehicles.type, \' [\', carriers_vehicles.reg_number, \']\') AS carrier_vehicle_title';
		$select .= ', CASE status 
						WHEN \'in_progress\' THEN \'В обработке\'
						WHEN \'shipped\' THEN \'Отправлено\'
						WHEN \'arrived\' THEN \'Получено\'
					  END as status_ru';
		
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products.id = products_factored.product_id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' LEFT JOIN factories ON (factories.id = products_factored.factory_id)';
		$sql .= ' INNER JOIN measures ON ('.$this->getTable().'.measure_id = measures.id)';
		$sql .= ' INNER JOIN users ON ('.$this->getTable().'.user_id = users.id)';
		$sql .= ' LEFT JOIN carriers ON ('.$this->getTable().'.carrier_id = carriers.id)';
		$sql .= ' LEFT JOIN carriers_drivers ON ('.$this->getTable().'.carrier_driver_id = carriers_drivers.id)';
		$sql .= ' LEFT JOIN carriers_vehicles ON ('.$this->getTable().'.carrier_vehicle_id = carriers_vehicles.id)';
		$sql .= ' WHERE '.$this->getTable().'.direction IN ('.$this->getDirections().')';
//		if ($filter = $this->getFilter()) {
//			$sql .= ' AND '.$filter;
//		}
//		$sql .= $this->getSort();
		
		$all = $this->getDb()->getAllAssoc($sql);
		
		if (!empty($all) && is_array($all)) {
			foreach ($all as $key => $shipped) {
				// Форматируем дату
				$all[$key]['date_formated'] = $this->formatDate($all[$key]['datetime']);
				
				$directionFrom = substr($shipped['direction'], 0, 1);
				$directionTo = substr($shipped['direction'], 1);
				
				// Получаем название отправителя
				if (!empty($shipped['from_id'])) {
					switch ($directionFrom) {
						case 'f':
							$entity = EntityFactory::loadEntity('Factories');
							break;
						
						case 'd':
							$entity = EntityFactory::loadEntity('DC');
							break;
						
						case 'c':
							$entity = EntityFactory::loadEntity('Clients');
							break;
						
						case 'a':
						default:
							$entity = EntityFactory::loadEntity('Affiliates');
							break;
					}
					$all[$key]['from_title'] = $entity->getOne('title', $shipped['from_id']);
				}
				
				// Получаем название получителя
				if (!empty($shipped['to_id'])) {
					switch ($directionTo) {
						case 'f':
							$entity = EntityFactory::loadEntity('Factories');
							break;
						
						case 'd':
							$entity = EntityFactory::loadEntity('DC');
							break;
						
						case 'c':
							$entity = EntityFactory::loadEntity('Clients');
							break;
						
						case 'a':
						default:
							$entity = EntityFactory::loadEntity('Affiliates');
							break;
					}
					$all[$key]['to_title'] = $entity->getOne('title', $shipped['to_id']);
				}
			}
		}

		return array(
			'data' => $all,
			'total' => count($all)
		);
	}
	
//	protected function setFilter() {
//		if (!empty($_REQUEST['filter']) && is_array($_REQUEST['filter'])) {
//			foreach ($_REQUEST['filter'] as $filter) {
//				$this->filterTable = $this->getTable();
//				$field = $this->getDb()->escapeStr($filter['field']);
//				if ($field == 'date_formated') {
//					$field = 'datetime';
//					if (!empty($filter['data']['comparison'])) {
//						if ($filter['data']['comparison'] == 'lt') {
//							$filter['data']['value'] .= '23:59:59';
//							$this->filter[] = $this->filterTable.".".$field.">".strtotime($filter['data']['value']);
//						} elseif ($filter['data']['comparison'] == 'gt') {
//							$filter['data']['value'] .= '00:00:00';
//							$this->filter[] = $this->filterTable.".".$field."<".strtotime($filter['data']['value']);
//						} elseif ($filter['data']['comparison'] == 'eq') {
//							$start = strtotime($filter['data']['value'].' 00:00:00');
//							$finish = strtotime($filter['data']['value'].' 23:59:59');
//							$this->filter[] = $this->filterTable.".".$field.">=".$start." AND ".
//												$this->filterTable.".".$field."<=".$finish;
//						}
//					}
//				} else {
//					if ($field == 'store_title') {
//						$this->filterTable = 'stores';
//						$field = 'title';
//					} elseif ($field == 'cell_title') {
//						$this->filterTable = 'cells';
//						$field = 'title';
//					} elseif ($field == 'product_title') {
//						$this->filterTable = 'products';
//						$field = 'title';
//					} elseif ($field == 'products_part') {
//						$this->filterTable = 'products_stored';
//						$field = 'products_part';
//					} elseif ($field == 'measure_title') {
//						$this->filterTable = 'measures';
//						$field = 'title';
//					} elseif ($field == 'group_title') {
//						$this->filterTable = 'product_groups';
//						$field = 'title';
//					} elseif ($field == 'user') {
//						$this->filterTable = 'users';
//						$field = 'fullname';
//					}
//					$value = $this->getDb()->escapeStr($filter['data']['value']);
//					$this->filter[] = $this->filterTable.".".$field." LIKE '%".$value."%'";	
//				}
//			}
//			$this->filter = implode(' AND ', $this->filter);
//		}
//	}
	
//	protected function setSort() {
//		if (!empty($_REQUEST['sort']) && !empty($_REQUEST['dir'])) {
//			$this->sortDirection = $this->getDb()->escapeStr($_REQUEST['dir']);
//			$sort = $this->getDb()->escapeStr($_REQUEST['sort']);
//			switch ($sort) {
//				case 'date_formated':
//					$this->sortTable = $this->getTable();
//					$this->sortField = 'datetime';
//					break;
//				case 'product_title':
//					$this->sortTable = 'products';
//					$this->sortField = 'title';
//					break;
//				case 'products_part':
//					$this->sortTable = 'products_stored';
//					$this->sortField = 'products_part';
//					break;
//				case 'group_title':
//					$this->sortTable = 'product_groups';
//					$this->sortField = 'title';
//					break;
//				case 'measure_title':
//					$this->sortTable = 'measures';
//					$this->sortField = 'title';
//					break;
//				case 'store_title':
//					$this->sortTable = 'stores';
//					$this->sortField = 'title';
//					break;
//				case 'cell_title':
//					$this->sortTable = 'cells';
//					$this->sortField = 'title';
//					break;
//				case 'user':
//					$this->sortTable = 'users';
//					$this->sortField = 'fullname';
//					break;
//				default:
//					parent::setSort();
//					break;
//			}
//		}
//	}
	
	public function getOneItem($id = null) {
		if ($id) {
			$this->setPrimaryKeyValue($id);
		}
		
		$select = $this->getTable().'.*';
		$select .= ', products_factored.products_part AS products_part';
		$select .= ', product_groups.id AS group_id';
		$select .= ', product_groups.title AS group_title';
		$select .= ', measures.title AS measure_title';
		$select .= ', measures.short_title AS measure_short_title';
		$select .= ', products.id AS product_id';
		$select .= ', products.title AS product_title';
		$select .= ', factories.title AS factory_title';
		$select .= ', users.fullname AS user';
		$select .= ', products_movement_directions.title AS direction_title';
		$select .= ', carriers.title AS carrier_title';
		$select .= ', carriers_drivers.fullname AS carrier_driver_fullname';
		$select .= ', CONCAT(carriers_vehicles.make, \' \', carriers_vehicles.type, \' [\', carriers_vehicles.reg_number, \']\') AS carrier_vehicle_title';
		$select .= ', CASE status 
						WHEN \'in_progress\' THEN \'В обработке\'
						WHEN \'shipped\' THEN \'Отправлено\'
						WHEN \'arrived\' THEN \'Получено\'
					  END as status_ru';
		
		$sql = 'SELECT '.$select.' FROM '.$this->getTable();
		$sql .= ' INNER JOIN products_factored ON ('.$this->getTable().'.product_factored_id = products_factored.id)';
		$sql .= ' INNER JOIN products ON (products.id = products_factored.product_id)';
		$sql .= ' INNER JOIN product_groups ON (products.group_id = product_groups.id)';
		$sql .= ' LEFT JOIN factories ON (factories.id = products_factored.factory_id)';
		$sql .= ' INNER JOIN measures ON ('.$this->getTable().'.measure_id = measures.id)';
		$sql .= ' INNER JOIN users ON ('.$this->getTable().'.user_id = users.id)';
		$sql .= ' INNER JOIN products_movement_directions ON ('.$this->getTable().'.direction = products_movement_directions.direction_key)';
		$sql .= ' LEFT JOIN carriers ON ('.$this->getTable().'.carrier_id = carriers.id)';
		$sql .= ' LEFT JOIN carriers_drivers ON ('.$this->getTable().'.carrier_driver_id = carriers_drivers.id)';
		$sql .= ' LEFT JOIN carriers_vehicles ON ('.$this->getTable().'.carrier_vehicle_id = carriers_vehicles.id)';
		$sql .= ' WHERE '.$this->getTable().'.'.$this->getPrimaryKey().' = '.$this->getPrimaryKeyValue();
		
		$result = $this->getDb()->getAllAssoc($sql);
		
		$productTrack = null;
		if (is_array($result) && !empty($result)) {
			$productTrack = $result[0];	
		}
				
		if (!empty($productTrack)) {
			// Форматируем дату
			$productTrack['date_formated'] = $this->formatDate($productTrack['datetime']);
			
			$directionFrom = substr($productTrack['direction'], 0, 1);
			$directionTo = substr($productTrack['direction'], 1);
			
			// Получаем название отправителя
			if (!empty($productTrack['from_id'])) {
				switch ($directionFrom) {
					case 'f':
						$entity = EntityFactory::loadEntity('Factories');
						break;
					
					case 'd':
						$entity = EntityFactory::loadEntity('DC');
						break;
					
					case 'c':
						$entity = EntityFactory::loadEntity('Clients');
						break;
					
					case 'a':
					default:
						$entity = EntityFactory::loadEntity('Affiliates');
						break;
				}
				$productTrack['from_title'] = $entity->getOne('title', $productTrack['from_id']);
			}
			
			// Получаем название получителя
			if (!empty($productTrack['to_id'])) {
				switch ($directionTo) {
					case 'f':
						$entity = EntityFactory::loadEntity('Factories');
						break;
					
					case 'd':
						$entity = EntityFactory::loadEntity('DC');
						break;
					
					case 'c':
						$entity = EntityFactory::loadEntity('Clients');
						break;
					
					case 'a':
					default:
						$entity = EntityFactory::loadEntity('Affiliates');
						break;
				}
				$productTrack['to_title'] = $entity->getOne('title', $productTrack['to_id']);
			}
		}
		return $productTrack;
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
	
	public function shipProduct($request, $remindersType, $remindersPlace) {
		// Пересчитываем кол-во в килограммы. Все остатки хранятся в кг. 
		$entity = EntityFactory::loadEntity('MeasureRates');

		$quantityKg = $request['quantity'];
		if ($request['measure_id'] != KG_MEASURE) {
			if ($request['measure_id'] == GM_MEASURE || $request['measure_id'] == TN_MEASURE) {
				$product = 0;
			} else {
				$product = $request['product_id'];
			}
			$quantityKg = $entity->getRatedValue(
				$request['measure_id'],
				KG_MEASURE,
				$product,
				$request['quantity']
			);
		}
		
		$entity = EntityFactory::loadEntity('Remainders', $remindersType);
		$currentRemainder = $entity->getCurrentRemainder($request['product_factored_id'], $remindersPlace);
		if ($currentRemainder < $quantityKg) {
			return 'Доступный остаток: '.$currentRemainder.'кг';
		} else {
			return $this->add($request);
		}
	}

	public function shipProducts($request, $forcedRemindersType = '', $forcedRemindersPlace = '') {
		$data = array();
		$errors = 0;
		foreach ($request['products'] as $shipProduct) {
			$f = $shipProduct;
			
			$directionFrom = substr($f['direction'], 0, 1);
			switch ($directionFrom) {
				case 'f':
					$from = 'factory_id';
					$remindersType = 'factory';
					break;
				
				case 'd':
					$from = 'dc_id';
					$remindersType = 'dc';
					break;
				
				case 'a':
				default:
					$remindersType = 'affiliate';
					$from = 'aff_id';
					break;
			}
			
			$fromReminders = $from;
			if (!empty($forcedRemindersType) && !empty($forcedRemindersPlace)) {
				$remindersType = $forcedRemindersType;
				$fromReminders = $forcedRemindersPlace;
			}
			
			$f['from_id'] = $shipProduct[$from];
			$f['to_id'] = $shipProduct['recipient_id'];
			$f['user_id'] = Auth::isLoggedIn();
			$f['datetime'] = strtotime('now');
			
			$entity = EntityFactory::loadEntity('ProductsFactored');
			$f['product_factored_id'] = $entity->getFactoredProduct(
				$shipProduct['product_id'],
				$shipProduct['products_part']
			);

			if (!empty($f['from_id']) && !empty($f['to_id']) && !empty($f['quantity']) && !empty($f['measure_id']) && !empty($f['product_factored_id']) && !empty($f['direction'])) {
				$result = $this->shipProduct($f, $remindersType, $f[$fromReminders]);
				if (!$result || is_string($result)) {
					$errors++;
					$msg = 'Ошибка отправки';
					if (is_string($result)) {
						$msg .= ': '.$result;
					}
					$msg .= '.';
				} else {
					$msg = 'Отправлено успешно.';
				}
		
				if ($errors > 0) {
					$data['is_error'] = true;
				} else {
					$data['is_error'] = false;
				}
				$data['messages'][] = $msg;
			}
		}
		return $data;
	}
	
	public function moveToCells($request) {
		$data = array();
		foreach ($request['products'] as $moveProduct) {
			$errors = 0;
			$moveProduct['user_id'] = Auth::isLoggedIn();
			
			$entity = EntityFactory::loadEntity('ProductsFactored');
			$moveProduct['product_factored_id'] = $entity->getFactoredProduct(
				$moveProduct['product_id'],
				$moveProduct['products_part']
			);

			// Пересчитываем кол-во в килограммы. Все остатки хранятся в кг. 
			$entity = EntityFactory::loadEntity('MeasureRates');

			$quantityKg = $moveProduct['quantity'];
			if ($moveProduct['measure_id'] != KG_MEASURE) {
				if ($moveProduct['measure_id'] == GM_MEASURE || $moveProduct['measure_id'] == TN_MEASURE) {
					$product = 0;
				} else {
					$product = $moveProduct['product_id'];
				}
				$quantityKg = $entity->getRatedValue(
					$moveProduct['measure_id'],
					KG_MEASURE,
					$product,
					$moveProduct['quantity']
				);
			}
			
			$entity = EntityFactory::loadEntity('Remainders', 'affiliate');
			$currentRemainder = $entity->getCurrentRemainder($moveProduct['product_factored_id'], $moveProduct['aff_id']);
			if ($currentRemainder < $quantityKg) {
				$errors++;
				$msg = 'Ошибка перемещения. Доступный остаток: '.$currentRemainder.'кг.';
			}
			
			if ($errors == 0) {
				$entity = EntityFactory::loadEntity('Cells');
				$freeArea = $entity->getCellFreeArea($moveProduct['aff_cell_id']);

				// Получаем кол-во поддонов на основании остатков. Остаток всегда в кг
				$entity = EntityFactory::loadEntity('MeasureRates');
				$m2 = ceil(
					$entity->getRatedValue(
						KG_MEASURE,
						P_MEASURE,
						$moveProduct['product_id'],
						$quantityKg
					)
				);
				
				if ($freeArea < $m2) {
					$errors++;
					$msg = 'Ошибка перемещения. Недостаточно свободного места. (Свободно: '.$freeArea.'м²)';
				}
			}

			if ($errors == 0) {
				$entity = EntityFactory::loadEntity('Remainders', 'affiliate');
				$result = $entity->decreaseReminder($moveProduct);
				if (!$result) {
					$errors++;
					$msg = 'Ошибка перемещения.';
				} else {
					$entity = EntityFactory::loadEntity('Remainders', 'cells');
					$result = $entity->increaseReminder($moveProduct);
					if (!$result) {
						$errors++;
						$msg = 'Ошибка перемещения.';
					} else {
						$msg = $moveProduct['quantity'].' ';
						$msg .= $moveProduct['measure_short_title'].' ';
						$msg .= $moveProduct['product_title'].' ['.$moveProduct['group_title'].'] ';
						$msg .= 'успешно перемещено в ';
						
						$cellTitle = substr($moveProduct['aff_cell_title'], 0, strpos($moveProduct['aff_cell_title'], ' ('));
						$msg .= $cellTitle.' ['.$moveProduct['aff_store_title'].'] ';
					}
				}
			}
			
			if ($errors > 0) {
				$data['is_error'] = true;
			} else {
				$data['is_error'] = false;
			}
			$data['messages'][] = $msg;
		}
		return $data;
	}
	
	public function moveToDcCells($request) {
		$data = array();
		foreach ($request['products'] as $moveProduct) {
			$errors = 0;
			$moveProduct['user_id'] = Auth::isLoggedIn();
			
			$entity = EntityFactory::loadEntity('ProductsFactored');
			$moveProduct['product_factored_id'] = $entity->getFactoredProduct(
				$moveProduct['product_id'],
				$moveProduct['products_part']
			);

			// Пересчитываем кол-во в килограммы. Все остатки хранятся в кг. 
			$entity = EntityFactory::loadEntity('MeasureRates');

			$quantityKg = $moveProduct['quantity'];
			if ($moveProduct['measure_id'] != KG_MEASURE) {
				if ($moveProduct['measure_id'] == GM_MEASURE || $moveProduct['measure_id'] == TN_MEASURE) {
					$product = 0;
				} else {
					$product = $moveProduct['product_id'];
				}
				$quantityKg = $entity->getRatedValue(
					$moveProduct['measure_id'],
					KG_MEASURE,
					$product,
					$moveProduct['quantity']
				);
			}
			
			$entity = EntityFactory::loadEntity('Remainders', 'dc');
			$currentRemainder = $entity->getCurrentRemainder($moveProduct['product_factored_id'], $moveProduct['dc_id']);
			if ($currentRemainder < $quantityKg) {
				$errors++;
				$msg = 'Ошибка перемещения. Доступный остаток: '.$currentRemainder.'кг.';
			}
			
			if ($errors == 0) {
				$entity = EntityFactory::loadEntity('DcCells');
				$freeArea = $entity->getCellFreeArea($moveProduct['dc_cell_id']);

				// Получаем кол-во поддонов на основании остатков. Остаток всегда в кг
				$entity = EntityFactory::loadEntity('MeasureRates');
				$m2 = ceil(
					$entity->getRatedValue(
						KG_MEASURE,
						P_MEASURE,
						$moveProduct['product_id'],
						$quantityKg
					)
				);
				
				if ($freeArea < $m2) {
					$errors++;
					$msg = 'Ошибка перемещения. Недостаточно свободного места. (Свободно: '.$freeArea.'м²)';
				}
			}

			if ($errors == 0) {
				$entity = EntityFactory::loadEntity('Remainders', 'dc');
				$result = $entity->decreaseReminder($moveProduct);
				if (!$result) {
					$errors++;
					$msg = 'Ошибка перемещения.';
				} else {
					$entity = EntityFactory::loadEntity('Remainders', 'dcCells');
					$result = $entity->increaseReminder($moveProduct);
					if (!$result) {
						$errors++;
						$msg = 'Ошибка перемещения.';
					} else {
						$msg = $moveProduct['quantity'].' ';
						$msg .= $moveProduct['measure_short_title'].' ';
						$msg .= $moveProduct['product_title'].' ['.$moveProduct['group_title'].'] ';
						$msg .= 'успешно перемещено в ';
						
						$cellTitle = substr($moveProduct['dc_cell_title'], 0, strpos($moveProduct['dc_cell_title'], ' ('));
						$msg .= $cellTitle.' ['.$moveProduct['dc_store_title'].'] ';
					}
				}
			}
			
			if ($errors > 0) {
				$data['is_error'] = true;
			} else {
				$data['is_error'] = false;
			}
			$data['messages'][] = $msg;
		}
		return $data;
	}

	protected function getDirections() {
		$result = array();
		foreach ($this->_directions as $direction) {
			$result[] = "'".$direction."'";
		}
		return implode(',', $result);
	}

	public function updateStatus($status, $id) {
		if (in_array($status, array('in_progress', 'shipped', 'arrived'))) {
			return parent::update(
				array('status' => $status),
				$id
			);
		}
	}
}
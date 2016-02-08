<?php
require_once ENTITIES_COMPONENTS_DIR.'abstract.entity.php';

class EntityFactory
{
	private static $entity;
	private static $sysEntity;

	public static function loadEntity($entity, $type = '') {
		require_once ENTITIES_COMPONENTS_DIR.'settings.entity.php';
		self::$sysEntity = new SettingsEntity();
		$dateFormat = self::getSetting('date_format');

		switch ($entity) {
			case 'Users':
				require_once ENTITIES_COMPONENTS_DIR.'user.entity.php';
				self::$entity = new UserEntity();
				break;
			case 'UserGroups':
				require_once ENTITIES_COMPONENTS_DIR.'userGroup.entity.php';
				self::$entity = new UserGroupEntity();
				break;
			case 'Cells':
				require_once ENTITIES_COMPONENTS_DIR.'cell.entity.php';
				self::$entity = new CellEntity();
				break;
			case 'Stores':
				require_once ENTITIES_COMPONENTS_DIR.'store.entity.php';
				self::$entity = new StoreEntity();
				break;
			case 'Products':
				require_once ENTITIES_COMPONENTS_DIR.'product.entity.php';
				self::$entity = new ProductEntity();
				break;
			case 'ProductsFactored':
				require_once ENTITIES_COMPONENTS_DIR.'productsFactored.entity.php';
				self::$entity = new ProductsFactoredEntity();
				break;
			case 'ProductsMovement':
				require_once ENTITIES_COMPONENTS_DIR.'productsMovement.entity.php';
				self::$entity = new ProductsMovementEntity(null, $type);
				break;
			case 'Remainders':
				require_once ENTITIES_COMPONENTS_DIR.'remainders.entity.php';
				self::$entity = new RemindersEntity(null, $type);
				break;
			case 'ProductGroups':
				require_once ENTITIES_COMPONENTS_DIR.'productGroup.entity.php';
				self::$entity = new ProductGroupEntity();
				break;
			case 'Measures':
				require_once ENTITIES_COMPONENTS_DIR.'measure.entity.php';
				self::$entity = new MeasureEntity();
				break;
			case 'MeasureRates':
				require_once ENTITIES_COMPONENTS_DIR.'measureRate.entity.php';
				self::$entity = new MeasureRateEntity();
				break;
			case 'Cities':
				require_once ENTITIES_COMPONENTS_DIR.'city.entity.php';
				self::$entity = new CityEntity();
				break;
			case 'Countries':
				require_once ENTITIES_COMPONENTS_DIR.'country.entity.php';
				self::$entity = new CountryEntity();
				break;
			case 'Factories':
				require_once ENTITIES_COMPONENTS_DIR.'factory.entity.php';
				self::$entity = new FactoryEntity();
				break;
			case 'DC':
				require_once ENTITIES_COMPONENTS_DIR.'dc.entity.php';
				self::$entity = new DcEntity();
				break;
			case 'DcStores':
				require_once ENTITIES_COMPONENTS_DIR.'dcStore.entity.php';
				self::$entity = new DcStoreEntity();
				break;
			case 'DcCells':
				require_once ENTITIES_COMPONENTS_DIR.'dcCell.entity.php';
				self::$entity = new DcCellEntity();
				break;
			case 'Affiliates':
				require_once ENTITIES_COMPONENTS_DIR.'affiliate.entity.php';
				self::$entity = new AffiliateEntity();
				break;
			case 'Clients':
				require_once ENTITIES_COMPONENTS_DIR.'client.entity.php';
				self::$entity = new ClientEntity();
				break;
			case 'Directions':
				require_once ENTITIES_COMPONENTS_DIR.'directions.entity.php';
				self::$entity = new DirectionsEntity();
				break;
			case 'Carriers':
				require_once ENTITIES_COMPONENTS_DIR.'carrier.entity.php';
				self::$entity = new CarrierEntity();
				break;
			case 'CarriersVehicles':
				require_once ENTITIES_COMPONENTS_DIR.'carrierVehicle.entity.php';
				self::$entity = new CarrierVehicleEntity();
				break;
			case 'CarriersDrivers':
				require_once ENTITIES_COMPONENTS_DIR.'carrierDriver.entity.php';
				self::$entity = new CarrierDriverEntity();
				break;
			case 'Settings':
			default:
				self::$entity = self::$sysEntity;
				break;
		}
		self::$entity->setDateFormat($dateFormat);
		return self::$entity;
	}

	public static function processRequest($cmd) {
		$data = array();
		$errors = 0;
		switch ($cmd) {
			case 'get':
				$id = (!empty($_REQUEST['id'])) ? $_REQUEST['id'] : null;
				if ($id) {
					$data = self::$entity->getOneItem($id);
				}
				break;
		
			case 'add':
				$requestData = $_REQUEST['f'];
				$result = self::$entity->add($requestData);
				if (!$result || is_string($result)) {
					$errors++;
					$msg = 'Ошибка добавления';
					if (is_string($result)) {
						$msg .= ': '.$result;
					}
					$msg .= '.';
				} else {
					$msg = 'Запись успешно добавлена.';
				}
		
				if ($errors > 0) {
					$data['is_error'] = true;
				} else {
					$data['is_error'] = false;
				}
				$data['messages'][] = $msg;
				break;
				
			case 'edit':
				$requestData = $_REQUEST['f'];
				$result = self::$entity->edit($requestData);
				if (!$result || is_string($result)) {
					$errors++;
					$msg = 'Ошибка редактирования';
					if (is_string($result)) {
						$msg .= ': '.$result;
					}
					$msg .= '.';
				} else {
					$msg = 'Запись успешно изменена.';
				}
		
				if ($errors > 0) {
					$data['is_error'] = true;
				} else {
					$data['is_error'] = false;
				}
				$data['messages'][] = $msg;
				break;
		
			case 'delete':
				$ids = (!empty($_REQUEST['ids'])) ? json_decode($_REQUEST['ids']) : null;
				if (is_array($ids) && !empty($ids)) {
					foreach ($ids as $id) {
						$result = self::$entity->delete($id);
						if (!$result) {
							$errors++;
							$msg = 'Ошибка удаления.';
						} else {
							$msg = 'Записи успешно удалены.';
						}
					}			
				} else {
					$errors++;
					$msg = 'Записи не выбраны.';
				}
		
				if ($errors > 0) {
					$data['is_error'] = true;
				} else {
					$data['is_error'] = false;
				}
				$data['messages'][] = $msg;
				break;
			
			case 'getGrid':
			default:
				$data = self::$entity->getAll();
				break;
		}
		return $data;
	}
	
	public static function getSetting($settingKey) {
		return self::$sysEntity->getSetting($settingKey);
	}
}
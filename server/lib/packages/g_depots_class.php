<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des dépôts
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class depotsGestion {

	/**
	 * Adresse (répertoire) concaténée des packages installés
	 *
	 * @var string
	 */
	private $_depots = null;

	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		$this->config = new g_configPackages();
	}

	/**
	* Chargement de la liste des dépôts
	*
	* @return array
	*/
	public function loadDepots(){
		// chargement du tableau des dépôts
		if($this->_depots==null){
			$this->_depots = $this->config->loadDepots();
			return $this->_depots;
		} else {
			return $this->_depots;
		}
	}

	/**
	* Lecture de la liste des dépôts pour l'affichage
	*
	* @return array
	*/
	public function loadShowDepots(){
		$depots = $this->loadDepots();
		return array('content' => $depots);
	}

	/**
	* Sauvegarde de la liste des dépôts
	*
	* @param array $depots tableau des dépôts
	* @return array
	*/
	protected function saveDepots($depots){
		$this->config->saveDepots($depots);
		return $depots;
	}

	/**
	* Préparation à la sauvegarde de la liste des dépôts
	*
	* @param string $depots dépôts en JSON
	* @return array
	*/
	public function preSaveDepots($depots){
		// transformation du tableau json
		$_depots = json_decode(stripcslashes($depots));
		$errorJSON = json_last_error();

		// erreur json
		if($errorJSON==JSON_ERROR_NONE) {
			$dpts = array();
			$error = false;

			// reconstruction des clés=>valeurs
			foreach($_depots as $_depot){
				if(count($_depot)>=4){
						$_dpts = array();
						foreach($_depot as $attributAndval){
							$attributAndval = explode('=',$attributAndval);
							if(count($attributAndval)==2){
									$_dpts[trim($attributAndval[0])] = trim($attributAndval[1]);
							} else {
								$error = true;
								break;
							}
						}
						$dpts[] = $_dpts;

				} else {
					$error = true;
						break;
				}
			}
			if($error){
				// Erreur de définition d’un dépôt
				return ajax::error(array('content' => 'Error, definition of a repository'),'Err-g-16');
			} else {
				$this->saveDepots($dpts);
				return ajax::ok();
			}
		}
		// Erreur JSON de lecture des dépôts
		return ajax::error(array('content' => 'JSON error reading repository'),'Err-g-17',$errorJSON);
	}

	/**
	* Copie un package depuis un dépôt
	*
	* @param string $depotTarget identifiant du dépôt
	* @param string $packageTarget nom du package
	* @param string $dirCopy dossier ou sera copié le package
	* @return array
	*/
	public function copyPackageFromDepot($depotTarget,$packageTarget,$dirCopy){

		// liste des dépôts
		$depots = $this->loadDepots();
		$propertiesDepotTarget = null;
		foreach($depots as $depot){
			if($depot['id']==$depotTarget)
				$propertiesDepotTarget = $depot;
		}

		// le dépot existe
		if($propertiesDepotTarget!=null){
			// on copy dans le dossier temporaire
			$filePlugin = adr::getAdr($propertiesDepotTarget['type'].'~extendFunction',null,array('packages','loadPackage'));
			require_once($filePlugin);
			$package = $propertiesDepotTarget['type']($propertiesDepotTarget,$packageTarget,$dirCopy);
		} else {
			// Erreur pour accéder aux dépôts
			$package = errors::inner('Error to access repository','Err-g-13',$depotTarget);
		}
		return $package;
	}

	/**
	* Chargement des packages depuis l'ensemble des dépôts
	*
	* @return array
	*/
	public function loadPackagesDepots(){
		// liste des dépôts
		$depots = $this->loadDepots();

		// tableau des packages lus
		$loadPackages = array();

		// parcourt des dépôts pour récupération des packages
		foreach($depots as $depot){
			// lecture d'un dépot selon sont type
			// le renvoie est fait sous forme de tableau contenant
			// errorStatus => false si pas d'erreur ou true en cas d'erreur
			// error => tableau du dépot qui a généré une erreur
			// packages => contient tout les items du dépot

			$filePlugin = adr::getAdr($depot['type'].'~extendFunction',null,array('packages','loadDepot'));
			if(!function_exists($depot['type'])){
				require_once($filePlugin);
				$loadPackages[$depot['id']] = $depot['type']($depot);
			} else {
				$loadPackages[$depot['id']] = $depot['type']($depot);
			}
		}

		// parcourt des dépôts pour la fusion de ceux-ci et gestion des erreurs
		$errorDepots = array();
		$allPackages = array();
		foreach($loadPackages as $uidDepot => $packages){
			if($packages['errorStatus']==false){// pas d'erreur
				foreach($packages['packages'] as $item){
						// création du tableau 'stable et 'other' si le package n'esixte pas
						if(!isset($allPackages[$item['uid']])){
							$allPackages[$item['uid']] = array('stable'=>null,'other'=>null,'install'=>null);
							$saveItem = true;
						} else {
							// vérification pour ne pas écraser une version plus récente
							$saveItem = true;
							if($item['phase_dev']=='stable'){
								if(isset($allPackages[$item['uid']]['stable']['version'])){
									$_versionSave = $allPackages[$item['uid']]['stable']['version'];
									$saveItem = $this->recentVersion($item['version'],$_versionSave);
								}
							} else {
								if(isset($allPackages[$item['uid']]['other']['version'])){
									$_versionSave = $allPackages[$item['uid']]['other']['version'];
									$saveItem = $this->recentVersion($item['version'],$_versionSave);
								}
							}
						}

						if($saveItem){
							// on enregistre le dépot dans l'item
							$item['depot'] = $uidDepot;
							if($item['phase_dev']=='stable')
								$allPackages[$item['uid']]['stable'] = $item;
							else
								$allPackages[$item['uid']]['other'] = $item;
						}
				}
			} else {
				$errorDepots[$uidDepot] = $packages;
			}
		}

		return array('errorDepots'=>$errorDepots,'allPackages'=>$allPackages);
	}

	/**
	* Compare deux versions sous la forme est-que $v1 est plus récente que $v2 ?
	*
	* @param string $v1 version 1
	* @param string $v2 version 2
	* @param boolean $supEgal supérieur ou égal
	* @return boolean
	*/
	public function recentVersion($v1,$v2,$supEgal=false){
		list($majeur1, $mineur1, $micro1) = explode('.',$v1);
		list($majeur2, $mineur2, $micro2) = explode('.',$v2);
		$v1 = ($majeur1*1000000)+($mineur1*1000)+$micro1;
		$v2 = ($majeur2*1000000)+($mineur2*1000)+$micro2;
		if($supEgal){
			if($v1>=$v2)
				return true;
			else
				return false;
		} else {
			if($v1>$v2)
				return true;
			else
				return false;
		}
	}
}
?>
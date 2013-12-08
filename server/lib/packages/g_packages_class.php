<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des packages
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class packagesGestion {

	/**
	 * Nom de class sans le namespace appartenant au package pour
	 * l'installation, la mise à jour et la suppression du package
	 *
	 * @var string
	 */
	private $_classInstall = 'install';

	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		$this->config = new g_configPackages();
	}

	/**
	* Lecture des packages depuis l'ensemble des dépôts
	*
	* @return array
	*/
	public function loadPackagesFromDepots(){
		$_depots = new depotsGestion();
		return $_depots->loadPackagesDepots();
	}

	/**
	* liste des packages installés
	*
	* @return array
	*/
	public function loadInstallPackages(){
		return $this->config->loadInstallPackages();
	}

	/**
	 * Fonction d'enregistrement de la liste des packages installés
	 *
	 * @param array $packages liste des packages
	 * @return array
	 */
	protected function savePackagesInstalled($packages){
		$this->config->savePackagesInstalled($packages);
		return $packages;
	}

	/**
	* Ajout d'un nouveau package à la liste des packages installés
	*
	* @param string $uid identifiant du package
	 * @param array $package défintion du package
	*/
	public function addInstallPackages($uid,$package){
		$packagesInstalled = $this->loadInstallPackages();
		$packagesInstalled[$uid] = $package;
		$this->savePackagesInstalled($packagesInstalled);
	}

	/**
	* Suppression d'un package à la liste des packages installés
	*
	* @param string $uid identifiant du package
	*/
	public function removeInstallPackages($uid){
		$packagesInstalled = $this->loadInstallPackages();
		if(isset($packagesInstalled[$uid])){
			unset($packagesInstalled[$uid]);
			$this->savePackagesInstalled($packagesInstalled);
		}
	}

	/**
	* Mise à jour et lecture de la liste des packages trouvée sur les dépôts
	*
	* @return array
	*/
	public function majLoadPackages(){
		// tous les packages des différents dépots
		$_allPackages = $this->loadPackagesFromDepots();

		// packages actuellement installés
		$_installPackages = $this->loadInstallPackages();

		// tableau des packages installés mais non trouvé dans les dépots
		$instalNotFound = array();
		foreach($_installPackages as $key => $item){
			if(isset($_allPackages['allPackages'][$key])){
				$_allPackages['allPackages'][$key]['install'] = $item;
			} else {
				$instalNotFound[] = $item;
			}
		}
		$depotAndPackages = array('instalNotFound'=>$instalNotFound,'errorDepots'=>$_allPackages['errorDepots'],'allPackages'=>$_allPackages['allPackages']);

		// sauvegarde
		$this->savePackages($depotAndPackages);

		return $depotAndPackages;
	}

	/**
	 * Lecture de la liste des packages trouvée sur les dépôts
	 *
	 * @return array
	 */
	public function loadPackages(){
		if($this->config->filePackages())
			return $this->config->loadPackages();
		else
			return $this->majLoadPackages();
	}

	/**
	 * Fonction d'enregistrement de la liste des packages trouvée sur les dépôts
	 *
	 * @param array $packages liste des packages
	 * @return array
	 */
	protected function savePackages($packages){
		$this->config->savePackages($packages);
		return $packages;
	}

	/**
	 * Construit le nom du fichier du package
	 *
	 * @param array $package défintion du package
	 * @return string
	 */
	public function nameFilePackage($package){
		return $package['namespace'].'_'.$package['version'].'.zip';
	}

	/**
	 * Lit les informations d'un package
	 *
	 * @param array $package défintion du package
	 * @return array
	 */
	public function loadPackageInfo($package){
		$_depots = new depotsGestion();
		$nameFilePackage = $this->nameFilePackage($package);

		// package installé et pas une version de mise à jour
		if($package['installed'] && !$package['update']){
			$dirInstalledP = $this->config->dirInstalledPackages();

			$file = $dirInstalledP.DS.$nameFilePackage;
			if(!file_exists($file)){
				// Le package installé n’existe pas
				$_package = errors::inner('The installed package does not exist','Err-g-14',$file);
			} else {
				$_package = errors::inner();
				$_package['file'] = $file;
			}
		} else {
			// package non installé
			$dirTmpCopy = $this->config->dirTempPackages();
			$_package = $_depots->copyPackageFromDepot($package['depot'],$nameFilePackage,$dirTmpCopy);
		}

		// erreur de copie ?
		if(!$_package['errorStatus']){
			$xml = $this->readContentPackage($_package['file']);
			if(is_object($xml)) {

				$dependency = '<ul>';
				foreach ($xml->depends->depend as $depend) {
					$dependency .= '<li>'.$depend['name'].' &gt;= '.$depend['version'].'</li>';
				}
				if($dependency=='<ul>')
					$dependency = 'none';
				else
					$dependency .= '</ul>';

				return array('content'=>
					'<p> <b>Namespace : </b>'.$xml->namespace.'</p>
					 <p> <b>Name : </b>'.$xml->name.'</p>
					 <p> <b>Type : </b>'.$xml->type.'</p>
					 <p> <b>Date : </b>'.$xml->date.'</p>
					 <p> <b>Version : </b>'.$xml->version.'</p>
					 <p> <b>Type update : </b>'.$xml->type_maj.'</p>
					 <p> <b>Phase dev : </b>'.$xml->phase_dev.'</p>
					 <p> <b>Descripition : </b>
					 <textarea class="Gpack-info-box">'.$xml->description.'</textarea></p>
					 <p> <b>Change log : </b>
					 <textarea class="Gpack-info-box">'.$xml->changelog.'</textarea></p>
					 <p> <b>Dependency : </b>'.$dependency.'</p>
					 <p> <b>Licence : </b>'.$xml->licence.'</p>'
					);
			} else {
				return ajax::error($xml,'Err-g-18');
			}
		} else {
			return ajax::error($_package,'Err-g-19');
		}
	}

	/**
	 * Lit le contenu d'un package
	 *
	 * @param array $filePackage adresse du package
	 * @return array
	 */
	public function readContentPackage($filePackage){
		$package = new ZipArchive();
		if($package->open($filePackage) !== true){
				return array('error'=> 'Error to read package : '.$filePackage);
		} else {
			$xml = simplexml_load_string($package->getFromName('content.xml'));
			$package->close();
			return $xml;
		}
	}

	/**
	 * Copie d'un package
	 *
	 * @param array $package défintion du package
	 * @return array
	 */
	public function copyPackage($package){
		$_depots = new depotsGestion();
		$nameFilePackage = $this->nameFilePackage($package);
		$dirInstalledP = $this->config->dirInstalledPackages();
		$file = $dirInstalledP.DS.$nameFilePackage;
		$_package = array();
		if(!file_exists($file)){
			$_package = $_depots->copyPackageFromDepot($package['depot'],$nameFilePackage,$dirInstalledP);
		} else {
			// Le package est déjà installé
			$_package = errors::inner('The package is already installed','Err-g-15',$file);
		}
		return $_package;
	}

	/**
	 * Installation ou mise à jour d'un package
	 *
	 * @param array $package défintion du package
	 * @param string $action mise à jour ou installation (update,install)
	 * @return array
	 */
	public function installOrUpdatePackage($package,$action){
		$_package = $this->copyPackage($package);
		// erreur de copie ?
		if(!$_package['errorStatus']){
			$file = $_package['file'];
			$zip = new ZipArchive();
			if($zip->open($file) !== true){
				// Erreur de lecture d’un package
				return ajax::error(array('content' => 'Error reading a package'),'Err-g-20',$file);
			} else {
				$xml = simplexml_load_string($zip->getFromName('content.xml'));
				$extractFile = array();

				$uid = $xml['uid'].'';

				// dépendance
				$depends = array();
				$dependsTxt = array();
				foreach ($xml->depends->depend as $depend) {
					$depends[] = array(
							'namespace' => $depend['namespace'].'',
							'name' => $depend['name'].'',
							'version' => $depend['version'].''
						);
					// namespace,name,version|namespace(n),name(n),version(n)
					$dependsTxt[] = $depend['namespace'].','.$depend['name'].','.$depend['version'];
				}

				$newPackage = array(
						'uid' => $uid,
						 'namespace' => $xml->namespace.'',
						 'name'=> $xml->name.'',
						 'phase_dev' => $xml->phase_dev.'',
						 'version' => $xml->version.'',
						 'dependArray' => $depends,
						 'depend' => implode('|',$dependsTxt)
				);

				// dépendances satisfaites ?
				$dependsValid = $this->depend($newPackage['depend']);
				if($dependsValid['valid']){

					// copy des fichiers
					foreach ($xml->files->file as $f) {
						$extractFile[] = $f.'';
					}
					foreach ($xml->filesadd->fileadd as $f) {
						$extractFile[] = $f.'';
					}
					// extraction
					$zip->extractTo(GALLINA_ROOT, $extractFile);

					// suppression des fichiers
					foreach ($xml->filesdelete->file as $f) {
						dirs::deleteFile($f);
					}
					$zip->close();

					// on regènère la liste des class
					g_autoloader::instance(GALLINA_DIR_CACHE)->regenerate();

					// on supprime les templates du cache
					if(method_exists('g_tpl','clearAll'))
						g_tpl::clearAll();

					// si update supprimer ancien package
					if($action=='update'){
						$packagesInstalled = $this->loadInstallPackages();
						if(isset($packagesInstalled[$uid])){
							$nameOldpackage = $this->nameFilePackage(array(
								'namespace' => $packagesInstalled[$uid]['namespace'],
								'version' => $packagesInstalled[$uid]['version']
								));
							$dirInstalledP = $this->config->dirInstalledPackages();
							unlink($dirInstalledP.DS.$nameOldpackage);
						}
					}
					// maj package installé
					$this->addInstallPackages($uid,$newPackage);

					// finalisation de l'installation
					$classInstall = $package['namespace'].'_'.$this->_classInstall;

					if(g_autoloader::classExit($classInstall)){
							$install = new $classInstall();
							if(method_exists($install,$action))
								$install->$action($newPackage);
					}
					return ajax::ok();
				} else {
					// dépendences non satisafites
					// ne devrait jamais être affiché (test préalable en js)
					$unmetHTML = "Install this package before : \n";
					foreach($dependsValid['unmet'] as $unmet)
						$unmetHTML .= $unmet['name'].' >= '.$unmet['version']."\n";
					// suppression du fichier copié
					unlink($file);
					return ajax::error(array('content'=>$unmetHTML),'Err-g-21');
				}
			}
		} else {
			return ajax::error($_package,'Err-g-22');
		}
	}

	/**
	 * Suppression d'un package
	 *
	 * @param array $package défintion du package
	 * @return array
	 */
	public function removePackage($package){
		$dependsValid = $this->dependDown($package['namespace']);
		if($dependsValid['valid']){
			$_depots = new depotsGestion();
			$nameFilePackage = $this->nameFilePackage($package);
			$dirInstalledP = $this->config->dirInstalledPackages();
			$file = $dirInstalledP.DS.$nameFilePackage;
			$zip = new ZipArchive();
			if($zip->open($file) !== true){
				// Erreur de lecture d’un package
				return ajax::error(array('content' => 'Error reading a package'),'Err-g-23',$file);
			} else {
				// préparation à la suppression
				$classInstall = $package['namespace'].'_'.$this->_classInstall;
				if(g_autoloader::classExit($classInstall)){
					$install = new $classInstall();
					if(method_exists($install,'remove'))
						$install->remove();
				}
				$xml = simplexml_load_string($zip->getFromName('content.xml'));

				$zip->close();

				$uid = $xml['uid'].'';

				// copy des fichiers
				foreach ($xml->files->file as $f) {
					dirs::deleteFile($f);
				}
				foreach ($xml->filesadd->fileadd as $f) {
					dirs::deleteFile($f);
				}

				// on regènère la liste des class
				g_autoloader::instance(GALLINA_DIR_CACHE)->regenerate();

				// supprimer l'ancien package
				unlink($file);

				$this->removeInstallPackages($uid);

				return ajax::ok();
			}
		} else {
			// ne devrait jamais être affiché (test préalable en js)
			$unmetHTML = "Remove this package before : \n";
			foreach($dependsValid['unmet'] as $unmet)
				$unmetHTML .= $unmet['name']."\n";
			// suppression du fichier copié
			unlink($file);
			return ajax::error(array('content'=>$unmetHTML),'Err-g-24');
		}
	}

	/**
	 * Test de dépendance
	 *
	 * @param array $depends dépendance du package testé
	 * @return array
	 */
	public function depend($depends){
		// test de dépendance
		$packagesInstalled = $this->loadInstallPackages();
		$dependsValid = array('valid'=>true,'unmet'=>array());
		if($depends!=''){

			$dependArray = $this->dependtoArray($depends);
			foreach($dependArray as $_depend){
				// tester si c'est installé !
				$dep = false;
				foreach($packagesInstalled as $key => $_package){
					// tester si c'est installé et la version est sup ou égal à la dépendance
					if($_depend['namespace']==$_package['namespace'])
						if($this->recentVersion($_package['version'],$_depend['version'],true))
							$dep = true;
				}
				if(!$dep){
					$dependsValid['valid'] = false;
					$dependsValid['unmet'][] = $_depend;
				}
			}
		}
		return $dependsValid;
	}

	/**
	 * Test de dépendance descendante
	 *
	 * @param string $namespace namespace du package testé
	 * @return array
	 */
	public function dependDown($namespace){
		$packagesInstalled = $this->loadInstallPackages();
		$dependsValid = array('valid'=>true,'unmet'=>array());
		// scan des packages installés
		foreach($packagesInstalled as $key => $_package){
			// dépendance du package installé
			foreach($_package['dependArray'] as $_depend){
				// recherche si les namespaces sont équivalent
				if($_depend['namespace']==$namespace){
					$dependsValid['valid'] = false;
					$dependsValid['unmet'][] = $_depend;
				}
			}
		}
		return $dependsValid;
	}

	/**
	 * Tranforme en tableau les dépendances d'un package
	 *
	 * @param string $depend chaine des dépendances
	 * @return array
	 */
	protected function dependtoArray($depend){
		$dependA = explode('|',$depend);
		$dependArray = array();
		foreach($dependA as $_depend){
			$_depend = explode(',',$_depend);
			$dependArray[] = array(
				'namespace' => $_depend[0],
				'name' => $_depend[1],
				'version' => $_depend[2]
			);
		}
		return $dependArray;
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
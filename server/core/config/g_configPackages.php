<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de la configuration des packages
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configPackages extends g_config {

	/**
	 * Nom du fichier des packages installés
	 *
	 * @var string
	 */
	private $_packagesInstall = 'g-packagesInstall.php';

	/**
	 * Nom du fichier de tous les packages
	 *
	 * @var string
	 */
	private $_depotAndPackages = 'g-depotAndPackages.php';

	/**
	 * Nom du dossier temporaire de copie des packages
	 *
	 * @var string
	 */
	public $_dirTempPackages = 'packagesTmp';

	/**
	 * Nom du dossier ou sont copiés les packages installés
	 *
	 * @var string
	 */
	private $_dirInstalledPackages = 'packagesInstalled';

	/**
	 * Nom du fichier des dépôts
	 *
	 * @var string
	 */
	private $_depots = 'g-depots.php';

	/**
	 * Chargement des packages installés
	 *
	 * @return array
	 */
	public function loadInstallPackages(){
		$packagesInstall = GALLINA_DIR_CACHE.$this->_packagesInstall;
		if(file_exists($packagesInstall))
				return $this->_readVars($packagesInstall);
		else
			return array();
	}

	/**
	 * Enregistrement de la liste des packages installés
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function savePackagesInstalled($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.$this->_packagesInstall,$vars,'Packages installés');
	}

	/**
	 * Lecture de la liste des packages trouvée sur les dépôts
	 *
	 * @return array
	 */
	public function loadPackages(){
		$depotAndPackages = GALLINA_DIR_CACHE.$this->_depotAndPackages;
		if(file_exists($depotAndPackages))
				return $this->_readVars($depotAndPackages);
		else
			return array();
	}

	/**
	 * Lecture de la liste des packages trouvée sur les dépôts
	 *
	 * @return array
	 */
	public function filePackages(){
		$GallinaPackages = GALLINA_DIR_CACHE.$this->_depotAndPackages;
		if(file_exists($GallinaPackages))
			return true;
		else
			return false;
	}

	/**
	 * Enregistrement de la liste des packages trouvée sur les dépôts
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function savePackages($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.$this->_depotAndPackages,$vars,'Dépots et packages');
	}

	/**
	 * Dossier des packages installés
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function dirInstalledPackages(){
		$dir = GALLINA_DIR_CACHE.$this->_dirInstalledPackages;
		if(!file_exists($dir))
			mkdir($dir, 0777,true);
		return $dir;
	}

	/**
	 * Dossier temporaire des packages
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function dirTempPackages(){
		$dir = GALLINA_DIR_CACHE.$this->_dirTempPackages;
		if(!file_exists($dir))
			mkdir($dir, 0777,true);
		return $dir;
	}

	/**
	 * Lecture de la liste des dépôts
	 *
	 * @return array
	 */
	public function loadDepots(){
		$depots = GALLINA_DIR_CACHE.$this->_depots;
		if(!file_exists($depots)) {
			// Dépot officiel
			$officialRepository = GALLINA_DIR_CONFIG.'g_officialRepository.php';
			if(file_exists($officialRepository)) {
				require_once($officialRepository);
				$this->saveDepots($VARS);
			} else {
				return array();
			}
		}
		return $this->_readVars($depots);
	}

	/**
	 * Ajouter un dépôt à la liste des dépôts
	 *
	 * @param array
	 */
	public function addRepository($item){
		$depots = GALLINA_DIR_CACHE.$this->_depots;
		$VARS = $this->_readVars($depots);
		array_push($VARS, $item);
		$this->saveDepots($VARS);
	}

	/**
	 * Supprimer un dépôt à la liste des dépôts
	 *
	 * @param array
	 */
	public function removeRepository($repositoryID){
		$depots = GALLINA_DIR_CACHE.$this->_depots;
		$VARS = $this->_readVars($depots);
		$_VARS = array();
		foreach ($VARS as $repository) {
			if($repository['id']!=$repositoryID)
				array_push($_VARS, $repository);
		}
		$this->saveDepots($_VARS);
	}

	/**
	 * Enregistrement de la liste des dépots
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function saveDepots($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.$this->_depots,$vars,'Liste des dépots');
	}
}
?>
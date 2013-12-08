<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des models d'ePub
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configEpubModels extends g_config {

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tableau des variables à enregistrer
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-configEpubModels.php',$vars,'Models ePub List');
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function read(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-configEpubModels.php');
	}

	/**
	* Ajout d'un item
	*
	* @param array $items
	*/
	public function add($name,$file) {
		$VARS = $this->get();
		$VARS[$name] = $file;
		$this->saveVars($VARS);
	}


	/**
	* Suppression d'un item
	*
	* @param array $items
	*/
	public function remove($name) {
		$VARS = $this->get();
		if(isset($VARS[$name])){
			unset($VARS[$name]);
			$this->saveVars($VARS);
		}
	}

	/**
	 * Chargement du fichier de configuration
	 *
	 */
	public function get(){
		$file = GALLINA_DIR_CACHE.'g-configEpubModels.php';
		if(file_exists($file)) {
			return $this->read();
		} else {
			$a = array('Hibouk epub 2.0.1'=>'ap_epub2');
			$this->saveVars($a);
			return $a;
		}
	}
}
?>
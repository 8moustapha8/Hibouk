<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de la configuration de l'appli
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configAPPLI extends g_config {

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tableau des variables à enregistrer
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-conf-T-APPLI.php',$vars,'Configuration Appli T');
		$this->_saveMultiplestoPHP(GALLINA_DIR_CACHE.'g-confAPPLI.php',$vars,'Configuration Appli');
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function read(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-conf-T-APPLI.php');
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function readVars(){
		$VARS = $this->read();
		$r = array();
		foreach ($VARS as $key => $value)
			$r[$key] = $value['val'];
		return $r;
	}

	/**
	* Ajout de variable
	*
	* @param array $items
	*/
	public function add($items) {
		$VARS = $this->read();
		foreach ($items as $key => $value)
			$VARS[$key] = $value;
		$this->saveVars($VARS);
	}

	/**
	* Mise à jour
	*
	* @param array $items
	*/
	public function update($items) {
		$VARS = $this->read();
		foreach ($items as $key => $value)
			$VARS[$key]['val'] = $value;
		$this->saveVars($VARS);
	}

	/**
	* Suppression d'adresse
	*
	* @param array $items
	*/
	public function remove($items) {
		$VARS = $this->read();
		foreach ($items as $value)
			unset($VARS[$value]);
		$this->saveVars($VARS);
	}

	/**
	 * Chargement du fichier de configuration
	 *
	 */
	public static function load(){
		if(file_exists(GALLINA_DIR_CACHE.'g-confAPPLI.php')) {
			require_once(GALLINA_DIR_CACHE.'g-confAPPLI.php');
		} else {
			$self = new g_configAPPLI();
			$self->saveVars(array());
		}
	}
}
?>
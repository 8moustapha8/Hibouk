<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des abonnements
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configSUB extends g_config {

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tableau des variables à enregistrer
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-confSUB.php',$vars,'Configuration SUB');
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function read(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-confSUB.php');
	}


	/**
	* Nom d'un channel
	*
	* @param string $moduleName nom du module
	* @param string $actionName nom de l'action
	* @param string $position position (before/after)
	* @return string
	*/
	public function channelName($moduleName,$actionName,$position) {
		return $moduleName.'/'.$actionName.'/'.$position;
	}

	/**
	* Ajout d'un item
	*
	* @param array $items
	*/
	public function add($channelName,$item) {
		$VARS = $this->read();
		if(!isset($VARS[$channelName]))
			$VARS[$channelName] = array();
		array_push($VARS[$channelName], $item);
		$this->saveVars($VARS);
	}


	/**
	* Suppression d'un item
	*
	* @param array $items
	*/
	public function remove($channelName,$item) {
		$VARS = $this->read();
		if(isset($VARS[$channelName])){
			$tmpChannel = array();
			foreach ($VARS[$channelName] as $value)
				if($value[0]!=$item[0] || $value[1]!=$item[1])
					array_push($tmpChannel, $value);
			$VARS[$channelName] = $tmpChannel;
		}
		$this->saveVars($VARS);
	}

	/**
	 * Chargement du fichier de configuration
	 *
	 */
	public static function load(){
		$file = GALLINA_DIR_CACHE.'g-confSUB.php';
		if(file_exists($file)) {
			require($file);
			return $VARS;
		} else {
			$self = new g_configSUB();
			$a = array();
			$self->saveVars($a);
			return $a;
		}
	}
}
?>
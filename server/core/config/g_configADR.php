<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de la configuration Adresse
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configADR extends g_config {

	/**
	 * Compile le fichier des adresse
	 *
	 * @param vars
	 */
	private function _compil($vars){
		$php = "<?php\n\$VARS = array(\n";
		foreach($vars as $k => $v){
			$php .= "'".$k."' => array(\n"
				."'dirAdr' => ".$v['dirAdr'].",\n"
				."'dirUrl' => ".$v['dirUrl'].",\n"
				."'ext' => '".$v['ext']."'\n"
				."),\n";
		}
		$php .= ");\n?>";
		file_put_contents(GALLINA_DIR_CACHE.'g-confADR.php', $php);
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function load(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-confADR.php');
	}

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function readVars(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-conf-T-ADR.php');
	}

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-conf-T-ADR.php',$vars);
		$this->_compil($vars);
	}

	/**
	* Ajout d'adresse
	*
	* @param array $items
	*/
	public function add($items) {
		$VARS = $this->readVars();
		foreach ($items as $key => $value)
			$VARS[$key] = $value;
		$this->saveVars($VARS);
	}

	/**
	* Suppression d'adresse
	*
	* @param array $items
	*/
	public function remove($items) {
		$VARS = $this->readVars();
		foreach ($items as $value)
			unset($VARS[$value]);
		$this->saveVars($VARS);
	}

	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		// création du fichier si il n'existe pas
		if(!file_exists(GALLINA_DIR_CACHE.'g-confADR.php')) {
  			require_once(GALLINA_DIR_CONFIG.'g_conf-start-ADR.php');
			$this->saveVars($VARS);
		}
	}
}
?>
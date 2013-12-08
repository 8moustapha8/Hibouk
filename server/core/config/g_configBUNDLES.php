<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des bundles
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
/*
Type de bundles

appli : pour l'appli elle-même
extend : extension sur l'appli
...

 */
class g_configBUNDLES extends g_config {

	/**
	 * Prefix des fichiers
	 *
	 * @var string
	 */
	private $_prefix = 'g';

	/**
	 * Nom du fichier du tableau des bundles PHP
	 *
	 * @var string
	 */
	private function _bundlesPHP() {
		return GALLINA_DIR_CACHE.$this->_prefix.'-bundles.php';
	}

	/**
	 * Nom du fichier du tableau des bundles JS
	 *
	 * @var string
	 */
	private function _bundlesJS() {
	 	return GALLINA_DIR_CACHE.$this->_prefix.'-bundles.txt';
	}

	/**
	 * Nom du fichier par défaut
	 *
	 * @var string
	 */
	private function _defaultFile() {
	 	return GALLINA_DIR_CONFIG.$this->_prefix.'_bundles.php';
	}

	/**
	* Valeurs par défaut
	*
	* @return array
	*/
	private function _getDefault() {
		return $this->_readVars($this->_defaultFile());
	}

	/**
	 * Constructeur
	 *
	 */
	public function __construct($prefix='g'){
		$this->_prefix = $prefix;
	}

	/**
	* Récupération de la liste sous forme JS
	*
	* @return string
	*/
	public function get() {
		$file = $this->_bundlesJS();
		if(!file_exists($file))
			$this->save($this->_getDefault());
		return file_get_contents($file);
	}

	/**
	* Ajout de bundle
	*
	* @param array $items
	*/
	public function add($items) {
		$VARS = $this->_readVars($this->_bundlesPHP());
		foreach ($items as $key => $value)
			$VARS[$key] = $value;
		$this->save($VARS);
	}

	/**
	* Suppression de bundle
	*
	* @param array $items
	*/
	public function remove($items) {
		$VARS = $this->_readVars($this->_bundlesPHP());
		foreach ($items as $value)
			unset($VARS[$value]);
		$this->save($VARS);
	}

	/**
	* Sauvegarde
	*
	* @param array $vars
	*/
	public function save($vars) {
		$this->_saveVars($this->_bundlesPHP(),$vars,'Bundles JS');
		// sauvegarde JS
		$string = '';
		if(count($vars)>0) {
			$js = array();
			foreach ($vars as $key => $value)
				$js[] = $key.':{type:"'.$value['type'].'",file:"'.$value['file'].'"}';
			$string = implode(','.PHP_EOL, $js);
		}
		file_put_contents($this->_bundlesJS(), "\nvar BUNDLESFILES = {\n".$string."\n};\n");
	}
}
?>
<?php
/**
 * @package  Gallina
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des fichiers de langue
 *
 * @package  Gallina
 * @subpackage core (g_)
 */
class g_configLang extends g_config {

	public function _getCacheFile(){
		return GALLINA_DIR_CACHE.'g-langs.php';
	}

	/**
	 * Efface le fichier des fichiers de langue du cache
	 *
	 */
	public function delCacheFile(){
		unlink($this->_getCacheFile());
	}

	// scan des dossiers
	protected function displayTree($iterator = false) {
		// récupère recursiveDirectoryIterator
		if(!is_object($iterator))
			$iterator = $this->iterator;

		while($iterator->valid()) {
			// dossier
			if($iterator->isDir() AND !$iterator->isDot()) {
				if($iterator->hasChildren())
					$this->displayTree($iterator->getChildren());
			} else {
				// savoir si le dossier est exclu
				$val = true;
				if(@in_array($iterator->getPath(),$excludeDir))
					$val = false;

				// un fichier
				if($iterator->isFile() && $val) {
					$pathname = $iterator->getPathname();
					$_file = pathinfo($pathname);
					if($_file['extension']=='json') {
						$_dir = explode(DS,dirname($pathname));
						$langDIr = array_pop($_dir);
						$_dir = implode(DS, $_dir);
						if (preg_match("/^[a-z]{2}-[A-Z]{2}$/i", $langDIr)) {echo $langDIr;
							// on enregistre le fichier
							if($langDIr=='fr-FR')
								if(!isset($this->files[$_file['filename']]))
									$this->files[$_file['filename']] = array();
								$this->files[$_file['filename']][$langDIr] = $pathname;
						}
					}
				}
			}
			$iterator->next();
		}
		return $this->files;
	}
	/**
	 * Charge un fichier de langue
	 *
	 * @param string $name Nom du fichier sans l'extension
	 * @param string $lang La langue (eg en-EN)
	 * @return boolean
	 */
	public function load($name,$lang){
		$langFiles = $this->_getCacheFile();

		if(!file_exists($langFiles)) {
			$dirRoot = substr(GALLINA_ROOT, 0, -1);
			$excludeDir = array(GALLINA_ROOT.'epubs');
			$_files = $this->displayTree(new recursiveDirectoryIterator($dirRoot));
			$this->_saveVars($langFiles,$_files);
		}
		$this->_files = $this->_readVars($langFiles);
		if(isset($this->_files[$name]) && isset($this->_files[$name][$lang])){
			$this->_file = $this->_files[$name][$lang];
			$this->_obj = $this->_objectToArray(json_decode(file_get_contents($this->_file)));
			return true;
		} else {
			return false;
		}
	}

	/**
	* Ajout
	*
	* @param array $items
	*/
	public function add($items){
		foreach ($items as $key => $value)
			$this->_obj[$key] = $value;
		$this->_save();
	}

	/**
	* Suppression
	*
	* @param array $items
	*/
	public function remove($items) {
		foreach ($items as $value)
			unset($this->_obj[$value]);
		$this->_save();
	}

	/**
	* Sauvegarde
	*
	*/
	private function _save() {
		$jsonFile = "{\n";
		$counter = -1;
		$size = count($this->_obj)-1;
		foreach ($this->_obj as $key => $_v) {
			$counter++;
			$s = ',';
			if($counter==$size)
				$s = '';
			$jsonFile .= "\t\"".$key.'" : "'.$this->_obj[$key].'"'.$s."\n";
		}
		$jsonFile .= '}';
		file_put_contents($this->_file, $jsonFile);
	}

	private function _objectToArray($d){
		if (is_object($d))
			$d = get_object_vars($d);

		if (is_array($d))
			return array_map($this->_objectToArray, $d);
		else
			return $d;
	}
}
?>
<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Décorateur pour la recherche de fichiers php
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_filterAutoloader extends FilterIterator{

	/**
	 * Extension pour les fichiers PHP
	 *
	 * @var string
	 */
	private $_ext = '.php';

	/**
	 * Connaitre si c'est un bien un fichier PHP lisible
	 *
	 */
	public function accept(){
		if (substr($this->current(), -1 * strlen($this->_ext)) === $this->_ext)
			return is_readable($this->current());
		return false;
	}
}

/**
 *
 * Autoloader
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_autoloader {

	/**
	 * Instance du singleton
	 *
	 * @var object g_autoloader
	 */
	private static $_instance = false;

	/**
	 * Regénération du fichier des class trouvées
	 *
	 * @var boolean
	 */
	private $_regenerate = true;

	/**
	 * Adresse du répertoire d'enregistrementdu fichier des class trouvées
	 *
	 * @var string
	 */
	private $_cachePath;

	/**
	 * Tableau des class trouvées
	 *
	 * @var string
	 */
	private $_classes = array();

	/**
	 * Répertoire scanné
	 *
	 * @var string
	 */
	private $_directory = '';

	/**
	 * Constructeur
	 *
	 */
	private function __construct(){}

	/**
	 * Création de l'instance du singleton de l'autoloader
	 *
	 * @param string $cachePath adresse du répertoire d'enregistrement
	 * du fichier des class trouvées
	 */
	public static function instance($cachePath){
		if(self::$_instance === false){
			 self::$_instance = new g_autoloader();
			 self::$_instance->_cachePath = $cachePath.'autoloader.php';
		}
		return self::$_instance;
	}

	/**
	* Enregistrement de la fonction d'autoload
	*
	*/
	public function register(){
		spl_autoload_register(array($this, 'autoload'));
	}

	/**
	* Autoload
	*
	* @param string $className nom de la class
	* @return mixed
	*/
	public function autoload($className){
		// la classe existe ?
		if ($this->_loadClass($className))
			 return true;

		// regénération du fichier d'autoload (une fois)
		if ($this->_regenerate){
			 $this->_regenerate = false;
			 $this->_includesAll();
			 $this->_saveInCache();
			 return $this->autoload($className);
		}
		// pas de class
		return false;
	}

	/**
	* regénère la liste des class
	*
	*
	*/
	public function regenerate(){
		$this->_includesAll();
		$this->_saveInCache();
	}

	/**
	* Recherche de toutes les classes
	*
	*/
	private function _includesAll(){
		 $dir = new AppendIterator();
		 $dir->append(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->_directory)));

		 // Recherche des fichiers php
		 $files = new g_filterAutoloader($dir);

		 foreach($files as $fileName){
			$classes = $this->find((string) $fileName);
			foreach($classes as $className=>$fileName){
				 $this->_classes[strtolower($className)] = $fileName;
			}
		 }
	}

	/**
	*  Recherche dans le fichier si il existe des class
	*
	* @param string adresse du fichier php
	* @return array
	*/
	public function find($fileName){
		$toReturn = array();
		$tokens = token_get_all(file_get_contents($fileName, false));
		$tokens = array_filter($tokens, 'is_array');

		$classHunt = false;
		foreach($tokens as $token){
			 if($token[0] === T_INTERFACE || $token[0] === T_CLASS){
					$classHunt = true;
					continue;
			 }

			 if ($classHunt && $token[0] === T_STRING){
					$toReturn[$token[1]] = $fileName;
					$classHunt = false;
			 }
		}
		return $toReturn;
	}

	/**
	* Sauvegarde du cache des classes
	*
	*/
	private function _saveIncache(){
		$save = '<?php $classes = '.var_export ($this->_classes, true).'; ?>';
		file_put_contents($this->_cachePath, $save);
	}

	/**
	* Charge une classe
	*
	* @param string nom de la class
	* @return boolean
	*/
	private function _loadClass($className){
		$className = strtolower($className);
		if(count($this->_classes) === 0){
			 if (is_readable($this->_cachePath)){
					require($this->_cachePath);
					$this->_classes = $classes;
			 }
		}
		if (isset($this->_classes[$className])){
			 require_once($this->_classes[$className]);
			 return true;
		}
		return false;
	}

	/**
	* Répertoire à autoloader
	*
	* @param string répertoire
	* @return object g_autoloader
	*/
	public function addDirectory($directory){
		$this->_directory = $directory;
		return $this;
	}

	/**
	* Test si une class exite
	*
	* @param string nom de la class
	* @return boolean
	*/
	public static function classExit($className){
		return array_key_exists(strtolower($className), self::$_instance->_classes);
	}

	/**
	* Renvoie l'adresse d'une classe
	*
	* @param string nom de la class
	* @return string
	*/
	public static function classFile($className){
		return self::$_instance->_classes[strtolower($className)];
	}
}
?>
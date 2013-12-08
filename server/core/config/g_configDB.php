<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * gestion de la configuration db
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configDB extends g_config {

	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function readVars(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-conf-T-DB.php');
	}

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-conf-T-DB.php',$vars);
		$this->baseDB($vars);
	}

	/**
	 * Lecture, préparation de la configuration db
	 *
	 */
	public function baseDB($conf){
		$txt = "<?php\n
		ORM::configure('".$conf['dbDNS']."');
		ORM::configure('username', '".$conf['dbUsername']."');
		ORM::configure('password', '".$conf['dbPassword']."');";

		if(trim($conf['dbOptions'])!='')
			$txt .= "
		ORM::configure('driver_options', ".$conf['dbOptions'].");";
		$txt .= "\n?>";
		file_put_contents(GALLINA_DIR_CACHE.'g-confDB.php',$txt);
	}

	/**
	 * Chargement du fichier de configuration
	 *
	 */
	public static function load(){
		if(!file_exists(GALLINA_DIR_CACHE.'g-confDB.php')) {
			if(!file_exists(GALLINA_DIR_CACHE.'g-conf-T-DB.php')) {
				$self = new g_configDB();
				$vars = array(
					'dbHost' => 'localhost',
					'dbName' => 'dbName',
					'dbDNS' => 'mysql:host=localhost;dbname=dbName',
					'dbUsername' => 'username',
					'dbPassword' => 'password',
					'dbOptions' => ''
				);
				$self->_saveVars(GALLINA_DIR_CACHE.'g-conf-T-DB.php',$vars);
			}
		} else {
			require_once(GALLINA_DIR_CACHE.'g-confDB.php');
		}
	}
}
?>
<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de la configuration User
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configUSER extends g_config {


	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function readVars(){
		$data = array();
		/* Mode débuggage */
		if(GALLINA_DEBUG)
			$data['GALLINA_DEBUG'] = "true";
		else
			$data['GALLINA_DEBUG'] = "false";

		/* langue (ISO 639 ; ex : en) */
		$data['GALLINA_CONFIG_LANG'] = GALLINA_CONFIG_LANG;

		/* Délai d'une session */
		$data['GALLINA_SESSION_TIMEOUT'] = GALLINA_SESSION_TIMEOUT;
		return $data;
	}

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tableau des variables à enregistrer
	 */
	public function saveVars($data){

		$confVars = array(
			 'GALLINA_DEBUG' => array(
				 'type' => 'const',
				 'comment'=> 'Mode débuggage',
				 'val' => $data['debug']
				 ),

			 'GALLINA_SESSION_TIMEOUT' => array(
				 'type' => 'const',
				 'comment'=> 'Délai d\'une session',
				 'val' => $data['timeout']
				 ),

			 'GALLINA_CONFIG_LANG' => array(
				 'type' => 'const',
				 'comment'=> 'Langue (ISO 639 ; ex : en)',
				 'val' => $data['lang']
				 ),
		);
		$this->_saveMultiplestoPHP(GALLINA_DIR_CACHE.'g-confUSER.php',$confVars,'Configuration user');
	}

	/**
	 * Chargement du fichier de configuration
	 *
	 */
	public static function load(){
		if(!file_exists(GALLINA_DIR_CACHE.'g-confUSER.php')) {
			$self = new g_configUSER();
			$self->saveVars(array(
				'debug' => false,
				'timeout' => 1200,
				'lang' => 'en-EN'
			));
		}
		require_once(GALLINA_DIR_CACHE.'g-confUSER.php');
	}
}
?>
<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Sous-controller project
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_controller_project extends g_controller implements Icontroller {

	/**
	 * Controller object
	 *
	 * @var object Pl_controller_admin
	 */
	private static $_instance = null;

	/**
	 *
	 * Retourne l'instance du sous-controler
	 *
	 */
	public static function getInstance(){
        if (is_null(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
	}
	/**
	 *
	 * Initialisation et Routage
	 *
	 */
	public function dispatch(){

		// initialisation de la session
		session::creat();

		// pour la requète
		$class = GALLINA_CONFIG_REQUEST;
		$this->request = new $class;

		$this->channel = g_configSUB::load();

		// on charge le module
		$this->route();
	}
}
?>
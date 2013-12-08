<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de la configuration administration
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_configAdmin extends g_config {


	/**
	 * Retourne les variables de configuration
	 *
	 * @return array
	 */
	public function readVars(){
		return $this->_readVars(GALLINA_DIR_CACHE.'g-authUSER.php');
	}

	/**
	 * Enregistre le fichier de configuration
	 *
	 * @param array $vars Tabaleau des variables à enregistrées
	 */
	public function saveVars($vars){
		$this->_saveVars(GALLINA_DIR_CACHE.'g-authUSER.php',$vars);
	}

	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		// création du fichier si il n'existe pas
		if(!file_exists(GALLINA_DIR_CACHE.'g-authUSER.php')) {
			$this->saveVars(array(
				'password' => md5('password'),
  				'login' => 'login'
  			));
		}
	}

	/**
	 * Sauvegarde d'un nouveau login
	 *
	 * @param string $login
	 */
	public function changeLogin($login){
		if($login!=''){
			$vars = $this->readVars();
			$vars['login'] = trim($login);
			$this->saveVars($vars);
		}
	}

	/**
	 * Sauvegarde d'un nouveau password
	 *
	 * @param string $login
	 */
	public function changePassword($password){
		if($password!=''){
			$vars = $this->readVars();
			$vars['password'] = md5(trim($password));
			$this->saveVars($vars);
		}
	}

	/**
	 * Vérification du login/password
	 *
	 * @param string $login
	 * @param string $password
	 */
	public function verifyLoginPassword($login,$password){
		$password = md5(trim($password));
		$login = trim($login);
		$user = $this->readVars();
		if($user['login']==$login && $user['password']== $password)
			return true;
		else
			return false;
	}

}
?>
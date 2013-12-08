<?php
/**
 * @package	Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

 /**
 * Gestionnaire des sessions
 *
 *
 * @package	Gallina °)>
 * @subpackage core (g_)
 */
class session {

	/**
	 * Instance du singleton
	 *
	 * @var Pl_core_sessions
	 */
	private static $_instance = null;

	private static $_GID = '__GA_UID__';

	/**
	 * Constructeur
	 *
	 */
	final private function __construct(){ }

	/**
	 * Clonage interdit
	 *
	 */
	final public function __clone(){// Interdiction de dupliquer session
		throw new Exception('[14] Prohibition to duplicate session');// E[14]
	}

	/**
	 * Création de l'instance et démarrage de la session
	 *
	 */
	final public static function creat(){

		// une seule instance
		if (is_null(self::$_instance)){

			self::$_instance = new self();

			ini_set('session.use_cookies',1);

			ini_set('session.auto_start',0);

			session_start();

			self::_generateID();
			/*
			// !!!! attention la regénération de id peux géner pour les actions ajax succesives !!!!
			session_regenerate_id(true);
			*/

			return self::$_instance;

		} else {
			// E[15]
			throw new Exception('[15] Instance de session déjà réalisée');
		}
	}

	/**
	 * Renvoie l'instance de la session
	 *
	 */
	public static function getInstance(){
		if (is_null(self::$_instance)){// Instance de session non réalisée
			throw new Exception('[16] Session instance unrealized');// E[16]
		}
		return self::$_instance;
	}

	private static function _generateID(){
		if(!isset($_SESSION[self::$_GID]))
			$_SESSION[self::$_GID] = uniqid();
	}

	/**
	 * ID de la session Gallina
	 *
	 */
	public static function getID(){
		return $_SESSION[self::$_GID];
	}

	/**
	 * Détruit de la session
	 *
	 * @param	bool $start Redémarre la session
	 */
	public static function destroy($start=true){
		$_SESSION = array();
		if (isset($_COOKIE[session_name()]))
				@setcookie(session_name(), '', time()-42000, '/');

		session_destroy();

		if($start){
			session_start();

			self::_generateID();
			/*
			// !!!! attention la regénération de id peux géner pour les actions ajax succesives !!!!
			session_regenerate_id(true);
			*/
		}
	}

	/**
	 * Écrit une valeur dans la session
	 *
	 * @param	mixed $path Chemin. Si c'est un tableau la clé est le chemin et la valeur la valeur à assigner
	 * @param	mixed $value Valeur à assigner
	 */
	public static function write($path,$value=null){
		if(is_array($path)) {
			foreach($path as $p => $v)
				$_SESSION[$p] = $v;
		} else {
			$_SESSION[$path] = $value;
		}
	}

	/**
	 * Lit une valeur dans la session
	 *
	 * @param	string $path Chemin ou chaques clés du tableau de session sont séparées par un point
	 * @return mixed
	 */
	public static function read($path){
		return isset($_SESSION[$path]) ? $_SESSION[$path] : null;
	}

	/**
	 * Supprime une valeur dans la session
	 *
	 * @param	string $path Chemin ou chaques clés du tableau de session sont séparées par un point
	 */
	public static function remove($path){
		if(isset($_SESSION[$path]))
			unset($_SESSION[$path]);
	}

	/**
	 * Vérifie l'éxistence d'une variable de session
	 *
	 * @param	string $path Chemin ou chaques clés du tableau de session sont séparées par un point
	 * @return bool
	 */
	public static function exist($path){
		if(isset($_SESSION[$path]))
			return true;
		else
			return false;
	}
}
?>
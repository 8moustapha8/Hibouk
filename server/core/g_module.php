<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Classe abstraite pour les modules
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
abstract class g_abs_module {

  	/**
	 * Nom des plugins attaché les uns aux autres
	 *
	 * @var string
	 */
	protected $_fullName = '';

  	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		$this->_fullName = get_class($this);
	}

	/**
	 * Fonction magique __call
	 *
	 * @param string $method Nom de la méthode
	 * @param array $args Arguments
	 * @return mixed
	 */
	public function __call($method, $args) {
		return call_user_func_array(array(&$this, $method), $args);
	}
}
/**
 * Classe principale des modules
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
abstract class g_module extends g_abs_module {

	/**
	 * Controller object
	 *
	 * @var object g_controller
	 */
	protected $c;

	/**
	 * Constructeur
	 *
	 * @param string $controller Controller object
	 */
	public function __construct($controller){
		$this->c = $controller;
  		parent::__construct();
	}

	// ---------------------------------------------------------------------------
	// variables stockées

	/**
	 *
	 * Ajoute une donnée stockée
	 *
	 * @param string $key clé de la donnée
	 * @param mixed $value Valeur de la donnée
	 */
	public function MaddVarC($key,$value){
			$this->c->$key = $value;
	}

	/**
	 *
	 * Retourne une donnée stockée
	 *
	 * @param string $key clé de la donnée
	 * @return mixed
	 */
	public function MgetVarC($key){
			return $this->c->$key;
	}

	// ---------------------------------------------------------------------------
	// response

	/**
	 *
	 * Envoie et enregistre dans le controller l'objet de réponse
	 *
	 * @param string $type type de réponse (html, json...)
	 * @return object response_X
	 */
	public function MgetResponse($type){
		// nom de la class
		$class = 'response_'.strtoupper($type);
		// instanciation de la class
		$response = new $class();
		// on enregistre dans le controller
		$this->c->response = $response;
		// et on retourne l'objet
		return $response;
	}

	// ---------------------------------------------------------------------------
	// request


	/**
	 * Envoie l'instance Request
	 *
	 * @return object g_request
	 */
	public function MgetRequest(){
		return $this->c->request;
	}

	/**
	 * Assigne une valeur à un paramètre de requète
	 *
	 * @param string $name Nom du paramètre
	 * @return mixed
	 */
	public function MsetParam($name, $value){
		$this->c->request->params[$name] = $value;
	}

	/**
	 * Envoie d'un paramètre de la requète
	 *
	 * @param string $name Nom du paramètre
	 * @param boolean $filter Filtrer & et +
	 * @return mixed
	 */
	public function MgetBrutParam($name,$filter=false){
		$r = $this->c->request->params[$name];
		if($filter)
			$r = preg_replace(array('#§eper§#s','#§plus§#s'), array('&','+'), $r);
		return $r;
	}

	/**
	 * Détermine si un paramètre de la requète est définie
	 * et est différente de NULL
	 *
	 * @param string $name Nom du paramètre
	 * @return bool
	 */
	public function MissetParam($name){
		return isset($this->c->request->params[$name]);
	}

	/**
	 *  Efface un paramètre de la requète
	 *
	 * @param string $name Nom du paramètre
	 */
	public function MunsetParam($name){
		unset($this->c->request->params[$name]);
	}

	/**
	 * Envoie d'un paramètre de la requète selon son type de valeur
	 * Si le type de valeur n'est pas valide la valeur
	 * par défaut est retourné (alias)
	 *
	 * @param string $name Nom du paramètre
	 * @param string $default Valeur par défaut
	 * @param string $type Type de valeur
	 * @return mixed
	 */
	public function MgetParam($name,$default,$type){
		return $this->c->request->getParam($name,$default,$type);
	}

	/**
	 * Envoie d'un paramètre de la requète si il est valide selon
	 * son type de valeur sinon renvoie false (alias)
	 *
	 * @param string $name Nom du paramètre
	 * @param string $type Type de valeur
	 * @return mixed
	 */
	public function MgetValidParam($name,$type){
		return $this->c->request->getValidParam($name,$type);
	}
	// ---------------------------------------------------------------------------
	// re-direction

	/**
	 *
	 * Redirection vers un autre module
	 *
	 * @param string $module Nom du module
	 * @param string $action Nom de l'action
	 */
	public function Mdirection($module,$action){
		return array(
			'__redirection__' => true,
			'module' => $module,
			'act' => $action
		);
	}
	// ---------------------------------------------------------------------------
	// service rest
	public function Mservice($code) {
		$text = 'I’m a teapot';// code insolite
		switch ($code) {
			case 100: $text = 'Continue'; break;
			case 101: $text = 'Switching Protocols'; break;
			case 200: $text = 'OK'; break;
			case 201: $text = 'Created'; break;
			case 202: $text = 'Accepted'; break;
			case 203: $text = 'Non-Authoritative Information'; break;
			case 204: $text = 'No Content'; break;
			case 205: $text = 'Reset Content'; break;
			case 206: $text = 'Partial Content'; break;
			case 300: $text = 'Multiple Choices'; break;
			case 301: $text = 'Moved Permanently'; break;
			case 302: $text = 'Moved Temporarily'; break;
			case 303: $text = 'See Other'; break;
			case 304: $text = 'Not Modified'; break;
			case 305: $text = 'Use Proxy'; break;
			case 400: $text = 'Bad Request'; break;
			case 401: $text = 'Unauthorized'; break;
			case 402: $text = 'Payment Required'; break;
			case 403: $text = 'Forbidden'; break;
			case 404: $text = 'Not Found'; break;
			case 405: $text = 'Method Not Allowed'; break;
			case 406: $text = 'Not Acceptable'; break;
			case 407: $text = 'Proxy Authentication Required'; break;
			case 408: $text = 'Request Time-out'; break;
			case 409: $text = 'Conflict'; break;
			case 410: $text = 'Gone'; break;
			case 411: $text = 'Length Required'; break;
			case 412: $text = 'Precondition Failed'; break;
			case 413: $text = 'Request Entity Too Large'; break;
			case 414: $text = 'Request-URI Too Large'; break;
			case 415: $text = 'Unsupported Media Type'; break;
			default: $code = 418; break;
		}
		$this->MaddVarC('error_title',$text);
		$this->MaddVarC('error_content',"<h1>HTTP Code $code - $text</h1>");
		$this->MaddVarC('error_code',$code);
		return $this->Mdirection('g_noroute','errorHTTP');
	}
	// ---------------------------------------------------------------------------
	// debug

	/**
	 *
	 * Envoie une variable à la class de débuggage
	 *
	 * @param string $vname Nom de la variable
	 * @param mixed $var la variable
	 * @param string $info Info/commentaire
	 */
	public function Mdump($vname,$var,$info=null){
		if($this->c->debug!=null) {
			$GLOBALS['DEBUG']->dump($vname,$var,$info);
		}
	}
}
?>
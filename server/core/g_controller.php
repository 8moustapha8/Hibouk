<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Interface des controllers
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
interface Icontroller {
	public static function getInstance();
	public function dispatch();
}

/**
 * Controller principal
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
abstract class g_controller {
	/**
	 * Request object
	 *
	 * @var object g_request
	 */
	public $request = null;

	/**
	 * Nom du module
	 *
	 * @var string
	 */
	public $moduleName = '';

	/**
	 * Response object
	 *
	 * @var object Pl_response_X
	 */
	public $response = null;

	/**
	 * Stockage de données
	 *
	 * @var array
	 */
	private $vars = array();

	/**
	 * Debug
	 *
	 * @var boolean
	 */
	public $debug = null;

	/**
	 * Cannal d'abonnement
	 *
	 * @var array
	 */
	public $channel = array();

	/**
	 * Constructeur
	 *
	 */
	public function __construct(){
		// si on est en mode debug
		if(GALLINA_DEBUG) {
			$class = GALLINA_CONFIG_DEBUG;
			$GLOBALS['DEBUG'] = new $class;
			$this->debug = true;
		}
	}

	/**
	 * Chargement de données stockées
	 *
	 * @param string $index l'index
	 * @param mixed $value données à stocker
	 */
	public function __set($index, $value){
		$this->vars[$index] = $value;
	}

	/**
	 *
	 * Envoie d'une donnée stockée
	 *
	 * @param string $index l'index de la donnée
	 * @return mixed
	 */
	public function __get($index){
		if (array_key_exists($index, $this->vars)) {
            return $this->vars[$index];
        }
        return null;
	}

	/**
	 *
	 * Détermine si une donnée stockée est définie
	 *
	 * @param string $index l'index de la donnée
	 * @return bool
	 */
	public function __isset($index) {
		return isset($this->vars[$index]);
	}

	/**
	 *
	 * Détruit une donnée stockée
	 *
	 * @param string $index l'index de la donnée
	 * @return mixed
	 */
	public function __unset($index) {
		unset($this->vars[$index]);
	}

	/**
	 *
	 * Routage
	 *
	 */
	public function route(){
		$this->request->initParams();
		$this->redirection();
	}

	/**
	 *
	 * Choix de la bonne route
	 *
	 */
	public function redirection(){

		if( ($this->request->params['act']=='sessionDestroy' || $this->request->params['act']=='emptyGallinaCache' || $this->request->params['act']=='emptyGallinaCache') && GALLINA_DEBUG){
			$_f = $this->request->params['act'];
			if($_f == 'sessionDestroy')
				session::destroy(true);
			else
				dirs::$_f();

		} else {
			if(isset($this->request->params['module'])){
				if(g_autoloader::classExit($this->request->params['module'])){
					// action par défaut si non valide
					if(isset($this->request->params['act'])){
						// [5] L'action n'existe pas ou est invalide
						if((method_exists($this->request->params['module'],$this->request->params['act']) == false) || (!$this->request->getValidParam('act','string')))
							$this->_noRoute('noAction');
										} else {// [4] Action indéfini
						$this->_noRoute('noAction');
					}
				} else {// [3] Module n'existe pas
					$this->_noRoute('noModule');
				}
			} else {// [2] Route vide
				$this->_noRoute('noModule');
			}
			$this->getModule();
		}
	}

	/**
	 *
	 * Pas de route trouvée
	 *
	 * @param string $error type d'erreur de routage
	 */
	private function _noRoute($error){
		$this->request->params['module'] = GALLINA_CONFIG_MODULE_NO_ROUTE;
		$this->request->params['act'] = $error;
	}

	public function newDirection($module,$action){
		$this->request->params['module'] = $module;
		$this->request->params['act'] = $action;
		$this->redirection();
	}

	private function _subscriptions($moduleName,$actionName,$position) {
		$channelAll = '*/'.$position;
		$channelModuleAll = $moduleName.'/*/'.$position;
		$channelModuleAction = $moduleName.'/'.$actionName.'/'.$position;
		$_r = array();
		if(isset($this->channel[$channelAll])){
			foreach ($this->channel[$channelAll] as $plug) {
				$_command = new $plug[0]($this);
				$_r = $_command->$plug[1]($moduleName,$actionName);
				if(isset($_r['__redirection__']))
					break;
			}
		}
		if(!isset($_r['__redirection__'])) {
			if(isset($this->channel[$channelModuleAll])){
				foreach ($this->channel[$channelModuleAll] as $plug) {
					$_command = new $plug[0]($this);
					$_r = $_command->$plug[1]($moduleName,$actionName);
					if(isset($_r['__redirection__']))
						break;
				}
			}
			if(!isset($_r['__redirection__'])) {
				if(isset($this->channel[$channelModuleAction])){
					foreach ($this->channel[$channelModuleAction] as $plug) {
						$_command = new $plug[0]($this);
						$_r = $_command->$plug[1]($moduleName,$actionName);
						if(isset($_r['__redirection__']))
							break;
					}
				}
			}
		}
		return $_r;
	}

	protected function before($moduleName,$actionName) {
		return $this->_subscriptions($moduleName,$actionName,'before');
	}

	protected function after($moduleName,$actionName) {
		return $this->_subscriptions($moduleName,$actionName,'after');
	}

	/**
	 *
	 * Charge le module
	 *
	 */
	public function getModule(){
		// module
		$module = $this->request->params['module'];

		// action
		$action = $this->request->params['act'];

		// abonnements before
		$_before = $this->before($module,$action);

		if(isset($_before['__redirection__'])) {
			$this->newDirection($_before['module'],$_before['act']);
		} else {
			// instanciation de la class du module
			$command = new $module($this);

			if(isset($command->auth)){
				if(session::exist('GALLINA_LAST_ACCESS')){
					if(@time()-@session::read('GALLINA_LAST_ACCESS')>GALLINA_SESSION_TIMEOUT)
						session::destroy(true);
				}
				session::write('GALLINA_LAST_ACCESS',time());

				$sessionName = $command->auth['session'];
				$actionConnexion = $command->auth['action'];

				if($actionConnexion!=$action && session::exist($sessionName)==null)
					$action = $actionConnexion;
			}

			// on lance l'action
			$this->response = $command->$action();

			// la réponse du module qu'on affiche si elle existe ou nouvelle direction
			if(!is_object($this->response)) {
				if(isset($this->response['__redirection__']))
					$this->newDirection($this->response['module'],$this->response['act']);
				else
					throw new Exception('[31] indefinite result');// E[31]
			} else {
				// abonnements afters
				$_after = $this->after($module,$action);
				if(isset($_after['__redirection__'])) {
					$this->newDirection($_after['module'],$_after['act']);
				} else {
					// la réponse
					if(!$this->response->printOut())
						$this->response->errorOut('');
				}
			}
		}
	}
}
?>
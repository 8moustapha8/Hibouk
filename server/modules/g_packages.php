<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module de gestion des packages
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class packages extends g_module {

	public $auth = array('action'=>'connexion','session'=>'CONNEXION_PACKAGES');

	// connexion
	protected function connexion() {

		$sessionName = $this->auth['session'];

		$redirection = false;
		if(session::exist($sessionName)==null) {
			$admin = new g_configAdmin();
			if($admin->verifyLoginPassword($this->MgetBrutParam('login'),$this->MgetBrutParam('password'))) {
				$redirection = true;
				session::write($sessionName,true);
			}
		} else {
			$redirection = true;
		}

		if(!$redirection) {
			// chargement de la réponse html
			$rep = $this->MgetResponse('html');
			$rep->content = g_tpl::get('g_connexion',array());
			return $rep;
		} else {
			return $this->_startPackages();
		}
	}

	protected function logout() {
		session::remove($this->auth['session']);
		return $this->Mdirection(GALLINA_CONFIG_DEFAULT_MODULE,GALLINA_CONFIG_DEFAULT_ACT);
	}

	private function _startPackages() {
		// chargement de la réponse html
		$rep = $this->MgetResponse('html');

		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		$BUNDLESFILES = new g_configBUNDLES();
		$debugMode = (GALLINA_DEBUG) ? 'true' : 'false';

		$js = g_tpl::get('g_start',array(
				'BOOTSTRAP_BUNDLES' =>$BOOTSTRAP_BUNDLES->get(),
				'BUNDLESFILES' =>$BUNDLESFILES->get(),
				'debugMode' => $debugMode
			)
		);

		$rep->addJS($js,false);
		$rep->addJS('lib/g_req~js');
		$rep->addJS('lib/g_browserDetect~js');
		$rep->addJS('g_init~js');

		$rep->content = '';

		return $rep;
	}

	// démarage
	protected function start(){

		// chargement de la réponse html
		$rep = $this->MgetResponse('json');

		$data = array("ajaxMsg"=>"ok");

		/* ----------------------------- DB ----------------------------*/
		$DB = new g_configDB();
		$data = array_merge($data, $DB->readVars());

		/* ----------------------------- CONF ----------------------------*/
		$user = new g_configUSER();
		$data = array_merge($data, $user->readVars());

		// assignement du contenu de la réponse
		$rep->content = $data;

		return $rep;
	}

	// enregistrement pour les variables de conf
	protected function confUpdate(){
		$confVars = array(
			'debug' => $this->MgetParam('GALLINA_DEBUG','false','bool'),
			'timeout' => $this->MgetParam('GALLINA_SESSION_TIMEOUT',1200,'integer'),
			'lang' => $this->MgetParam('GALLINA_CONFIG_LANG','fr-FR','string')
		);
		$user = new g_configUSER();
		$user->saveVars($confVars);

		$rep = $this->MgetResponse('json');
		$rep->content = ajax::ok();
		return $rep;
	}

	// enregistrement DB
	protected function saveDB(){
		$rep = $this->MgetResponse('json');
		$dbVars = array(
			 'dbHost' => $this->MgetBrutParam('dbHost'),
			 'dbName' => $this->MgetBrutParam('dbName'),
			 'dbDNS' => $this->MgetParam('dbDNS','','DNS'),
			 'dbUsername' => $this->MgetParam('dbUsername','','stringISP'),
			 'dbPassword' => $this->MgetParam('dbPassword','','stringISP'),
			 'dbOptions' => $this->MgetBrutParam('dbOptions')
		);

		// test de connexion
		try{
			$dbh = new PDO($dbVars['dbDNS'],$dbVars['dbUsername'],$dbVars['dbPassword']);
			$DB = new g_configDB();
			$DB->saveVars($dbVars);
			$rep->content = array('content' => 'Connexion ok !');
		} catch (PDOException $e) {
			$rep->content = array('content' => 'Error connexion !');
		}
		return $rep;
	}

	// changement de login
	protected function changeLoginAdmin(){
		$rep = $this->MgetResponse('json');
		$login = $this->MgetBrutParam('newlogin');
		if($login==''){
			$rep->content = array('content' => 'Invalid login');
		} else {
			$admin = new g_configAdmin();
			$admin->changeLogin($login);
			$rep->content = ajax::ok();
		}
		return $rep;
	}

	// changement de mot de passe
	protected function changePasswordAdmin(){
		$rep = $this->MgetResponse('json');
		$pasword = $this->MgetBrutParam('newPassword');
		if($pasword==''){
			$rep->content = array('content' => 'Invalid password');
		} else {
			$admin = new g_configAdmin();
			$admin->changePassword($pasword);
			$rep->content = ajax::ok();
		}
		return $rep;
	}
	/* ------------------------------------------------------------------------ */

	// lecture des packages sur l'ensemble des dépots
	protected function loadPackages(){
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->loadPackages();
		return $rep;
	}

	// Mise à jour et lecture des packages sur l'ensemble des dépots
	protected function updatePackages(){
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->majLoadPackages();
		return $rep;
	}

	// lecture d'info
	protected function loadInfoPackage(){
		$package = array(
				'uid' => $this->MgetParam('uid','','string'),
				'version' => $this->MgetParam('version','','file'),
				'depot' => $this->MgetParam('depot','','string'),
				'namespace' => $this->MgetParam('namespace','','string'),
				'installed' => $this->MgetParam('installed','false','bool'),
				'update' => $this->MgetParam('update','false','bool')
		);
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->loadPackageInfo($package);
		return $rep;
	}

	// installation d'un package
	protected function installPackage(){
		$package = array(
				'uid' => $this->MgetParam('uid','','string'),
				'version' => $this->MgetParam('version','','file'),
				'namespace' => $this->MgetParam('namespace','','string'),
				'depot' => $this->MgetParam('depot','','string')
		);
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->installOrUpdatePackage($package,'install');
		return $rep;
	}

	// update d'un package
	protected function updatePackage(){
		$package = array(
				'uid' => $this->MgetParam('uid','','string'),
				'version' => $this->MgetParam('version','','file'),
				'namespace' => $this->MgetParam('namespace','','string'),
				'depot' => $this->MgetParam('depot','','string')
		);
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->installOrUpdatePackage($package,'update');
		return $rep;
	}

	// suppression d'un package
	protected function removePackage(){
		$package = array(
				'uid' => $this->MgetParam('uid','','string'),
				'version' => $this->MgetParam('version','','file'),
				'namespace' => $this->MgetParam('namespace','','string'),
				'depot' => $this->MgetParam('depot','','string')
		);
		$packagesGestion = new packagesGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $packagesGestion->removePackage($package);
		return $rep;
	}

	// ----------------------- REPOSITORY --------------------------------

	// affichage de la liste des dépôts
	protected function loadShowDepots(){
		$depotsGestion = new depotsGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $depotsGestion->loadShowDepots();
		return $rep;
	}

	// enregistrement de la liste des dépôts
	protected function saveDepots(){
		$depotsGestion = new depotsGestion();
		$rep = $this->MgetResponse('json');
		$rep->content = $depotsGestion->preSaveDepots($this->MgetBrutParam('depots'));
		return $rep;
	}

}
?>
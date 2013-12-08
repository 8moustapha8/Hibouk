<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module de gestion de l'application
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_packagesAppli extends g_module {

	public $auth = array('action'=>'connexion','session'=>'CONNEXION_PACKAGES');

	// Connexion
	protected function connexion() {
		// redirection vers le module package
		return $this->Mdirection('packages','connexion');
	}

	protected function start(){

		// chargement de la réponse html
		$rep = $this->MgetResponse('json');

		$data = array("ajaxMsg"=>"ok");

		$appli = new g_configAPPLI();
		$data = array_merge($data, $appli->readVars());

		// assignement du contenu de la réponse
		$rep->content = $data;

		return $rep;
	}

	// Sauvegarde de la configuration de l'appli
	protected function saveconfig() {
		$configAppli = new g_configAPPLI();
		$confVars = $configAppli->read();

		$confSave = array();
		foreach ($confVars as $key => $value)
			$confSave[$key] = $this->MgetParam($key,$value['default'],$value['filter']);

		$configAppli->update($confSave);

		$rep = $this->MgetResponse('json');
		$rep->content = ajax::ok();
		return $rep;
	}

	// Création de la Table
	protected function tableCreat() {
		$table = "
CREATE TABLE IF NOT EXISTS `".APPLI_TABLE."` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `editor` varchar(20) NOT NULL,
  `title` varchar(256) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'ap_progr',
  UNIQUE KEY `id` (`id`),
  KEY `editor` (`editor`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
";
		g_configDB::load();
		$db = ORM::get_db();
		$db->exec($table);
		$rep = $this->MgetResponse('json');
		$rep->content = ajax::ok();
		return $rep;
	}
}
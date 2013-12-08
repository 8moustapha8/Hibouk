<?php
// Hibouk  version
define('HIBOUK_VERSION','0.1BETA');
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Module d'action démarage
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_start extends g_module {

	//
	protected function start(){

		// éditeur
		$editor = $this->MgetParam('editor','hibouk','string');
		session::write('APPLI_EDITOR',$editor);

		// chargement de la réponse html
		$rep = $this->MgetResponse('html');

		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		$BUNDLESFILES = new g_configBUNDLES('ap');
		$debugMode = (GALLINA_DEBUG) ? 'true' : 'false';

		$js = g_tpl::get('ap_start',array(
				'BOOTSTRAP_BUNDLES' =>$BOOTSTRAP_BUNDLES->get(),
				'BUNDLESFILES' =>$BUNDLESFILES->get(),
				'debugMode' => $debugMode,
				'HIBOUK_VERSION' => HIBOUK_VERSION
			)
		);

		$rep->addJS($js,false);
		$rep->addJS('lib/g_req~js');
		$rep->addJS('lib/g_browserDetect~js');
		$rep->addJS('g_init~js');

		$rep->content = '';
		return $rep;
	}
}
?>
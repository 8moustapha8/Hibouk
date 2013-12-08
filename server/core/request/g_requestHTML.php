<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Requète HTML
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_requestHTML extends g_request implements Irequest {

	/**
	 * Initialisation des paramètres de la requète
	 *
	 */
  	public function initParams() {
		$this->params = array_merge($_GET, $_POST);
		if(!isset($this->params['module']) && !isset($this->request->params['act']) ) {
			$this->params['module'] = GALLINA_CONFIG_DEFAULT_MODULE;
			$this->params['act'] = GALLINA_CONFIG_DEFAULT_ACT;
		}
	}
}
?>
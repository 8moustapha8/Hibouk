<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Réponse JSON
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
Class response_JSON extends g_response {

	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'JSON';

	/**
	 * Contenu pour la sortie
	 *
	 * @var string
	 */
	public $content = '';

	/**
	 * Sortie
	 *
	 */
	public function printOut(){
		$this->_headers['Content-Type'] = 'application/json';
		$json = json_encode($this->content);
		$this->_httpHeaders['Content-length'] = strlen($json);
		$this->sendHeaders();
		echo $json;
		return true;
	}

	/**
	 * Sortie pour une erreur interne
	 *
	 * @param string $msg message d'erreur
	 */
	public function errorOut($msg){
		$this->_statutCode = '500';
		$this->_statutMess = 'Internal Server Error';
		$this->_headers['Content-Type'] = 'text/plain;charset=UTF-8';
		$json = json_encode(array('ajaxMsg' => 'error', 'content' => $msg));
		$this->_httpHeaders['Content-length'] = strlen($json);
		$this->sendHeaders();
		echo $json;
	}
}
?>
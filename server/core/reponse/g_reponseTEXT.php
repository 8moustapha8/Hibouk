<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Réponse HTML
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
Class response_TEXT extends g_response {

	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'TEXT';

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
		$this->_headers['Content-Type'] = 'text/plain;charset=UTF-8';
		$this->_httpHeaders['Content-length']=strlen($this->content);
		$this->sendHeaders();
		echo $this->content;
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
		$this->_httpHeaders['Content-length'] = strlen($msg);
		$this->sendHeaders();
		echo $msg;
	}
}
?>
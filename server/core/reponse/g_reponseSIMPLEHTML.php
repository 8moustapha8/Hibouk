<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Réponse simple HTML
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
Class response_SIMPLEHTML extends g_response {
	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'SIMPLEHTML';

	/**
	 * Contenu pour la sortie
	 *
	 * @var string
	 */
	public $content = '';

	/**
	 * Titre
	 *
	 * @var string
	 */
	private $_title = '';

	/**
	 * Titre
	 *
	 * @param string $title Titre de la page
	 */
	public function title($title){
		$this->_title = "\n<title>".$title."</title>\n";
	}

	/**
	 *
	 * Création de l'entête http
	 *
	 */
	private function _sendHeadersHTML(){
		$this->_headers['Content-Type'] = 'text/html;charset=UTF-8';
		$this->_headers['Vary'] = 'Accept';
		$this->sendHeaders();
	}

	/**
	 * Sortie
	 *
	 * @return boolean
	 */
	public function printOut(){

		// Entête http
		$this->_sendHeadersHTML();

		// doctype
		echo "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n<html>\n<head>".$this->_title."</head>\n<body>\n".$this->content."\n</body>\n</html>";

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
		$this->_headers['Content-Type'] = 'text/html;charset=UTF-8';
		$this->sendHeaders();
		echo $msg;
	}
}
?>
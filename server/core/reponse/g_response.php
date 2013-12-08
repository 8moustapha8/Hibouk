<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Classe principale des réponses
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
abstract Class g_response {

	/**
	 * Tableau des en-tête HTTP
	 *
	 * @var array
	 */
	protected $_headers = array();

	/**
	 * Code du statut
	 *
	 * @var string
	 */
	protected $_statutCode = '200';

	/**
	 * Message du statut
	 *
	 * @var string
	 */
	protected $_statutMess = 'OK';

	/**
	 * Envoie la réponse selon le format
	 *
	 */
	abstract public function printOut();

	/**
	 * Envoie d'une erreur interne
	 *
	 */
	abstract public function errorOut($msg);

	/**
	 * Envoie des en-têtes HTTP
	 *
	 */
	protected function sendHeaders(){
		header("HTTP/1.0 ".$this->_statutCode.' '.$this->_statutMess);
		foreach($this->_headers as $k => $v){
				header($k.': '.$v);
		}
	}

	public function setHeader($k,$v) {
		$this->_headers[$k] = $v;
	}

	public function statutCode($code=NULL) {
		if ($code !== NULL) {
			$ext = '';
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
				case 500: $text = 'Internal Server Error'; break;
				case 501: $text = 'Not Implemented'; break;
				case 502: $text = 'Bad Gateway'; break;
				case 503: $text = 'Service Unavailable'; break;
				case 504: $text = 'Gateway Time-out'; break;
				case 505: $text = 'HTTP Version not supported'; break;
			}
			if($text!='') {
				$this->_statutCode = $code;
				$this->_statutMess = $text;
			}
		}

	}
}
?>
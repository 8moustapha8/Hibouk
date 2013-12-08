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
Class response_XML extends g_response {

		/**
		 * Type de réponse
		 *
		 * @var string
		 */
		public $type = 'XML';

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
			$this->_headers['Content-Type'] = 'text/xml';
			$xml = $this->content;
			$this->_httpHeaders['Content-length'] = strlen($xml);
			$this->sendHeaders();
			echo $xml;
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
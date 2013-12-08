<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Réponse binaire
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
Class response_BINARY extends g_response {

	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'BINARY';

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
		$fsize = filesize($this->content);
		$ext = strtolower(pathinfo($this->content,PATHINFO_EXTENSION));
		// Determine Content Type
		switch ($ext) {
			case 'pdf': $ctype = 'application/pdf'; break;
			case 'exe': $ctype = 'application/octet-stream'; break;
			case 'zip': $ctype = 'application/zip'; break;
			case 'epub': $ctype = 'application/epub+zip'; break;
			case 'doc': $ctype = 'application/msword'; break;
			case 'xls': $ctype = 'application/vnd.ms-excel'; break;
			case 'ppt': $ctype = 'application/vnd.ms-powerpoint'; break;
			case 'gif': $ctype = 'image/gif'; break;
			case 'png': $ctype = 'image/png'; break;
			case 'jpeg':
			case 'jpg': $ctype = 'image/jpg'; break;
			default: $ctype = 'application/force-download'; break;
		}

		$this->_headers['Content-Type'] = $ctype;
		$this->_headers['Content-Disposition'] = 'attachment; filename="'.basename($this->content).'"';
		$this->_headers['Content-Transfer-Encoding'] = 'binary';
		$this->_headers['Content-Length'] = $fsize;
		$this->sendHeaders();

		readfile($this->content);
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
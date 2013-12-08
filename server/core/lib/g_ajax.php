<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */
 
/**
 * Échange Ajax
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class ajax {

	/**
	 *
	 * Message d'erreur pour un dialogue Ajax
	 *
	 * @param mixed $key Si c'est un object alors il s'agit d'un retour de error::inner(...);
	 * @param string $errorCode
	 * @param string $dataLog
	 * @return array
	 */
	public static function error($key,$errorCode){
		return array('ajaxMsg' => 'error', 'content' => '['.$errorCode.'] '.$key['content']);
	}

	/**
	 *
	 * Message OK pour un dialogue Ajax
	 *
	 * @param string $content
	 * @return array
	 */
	public static function ok(){
		return array('content' => 'ok');
	}
}
?>
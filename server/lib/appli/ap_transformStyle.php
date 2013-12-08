<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de style de transformation
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_transformStyle {

	/**
	* récupèration d'un tableau de transformation
	*
	* @param : $name nom du tableau
	* @return : array
	*/
	public static function get ($name) {
		$transformFile = adr::getAdr($name.'~transform');
		if(!is_file($transformFile))
			$transformFile = adr::getAdr('ap_default~transform');
		require($transformFile);
		return $styleSheets_transform;
	}
}
?>
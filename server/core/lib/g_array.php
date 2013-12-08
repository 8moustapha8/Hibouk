<?php
/**
 * @package  Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Outils pour les array
 *
 *
 * @package  Gallina °)>
 * @subpackage core (g_)
 */
class g_array {

	/**
	 * Methode pour transformer un objet en array (utile avec json)
	 *
	 * @param object $object objet à transformer
	 * @return array
	 */
	public static function objectToArray($object) {
		if(!is_object( $object ) && !is_array( $object ))
			return $object;

		if(is_object($object) )
			$object = get_object_vars( $object );

		return array_map(array('g_array', __FUNCTION__), $object );
	}
}
?>
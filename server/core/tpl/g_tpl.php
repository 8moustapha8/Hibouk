<?php
/**
 * @package  Gallina °)>
 * @subpackage lib
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Moteur de template
 *
 *
 * @package  Gallina °)>
 * @subpackage core (g_)
 */
class g_tpl {
	public static function get($nameTpl,$vars,$const=true){
		$file = GALLINA_DIR_CACHE.'tpl-'.$nameTpl.'.php';
		if(!file_exists($file)) {
			// compilation
			$c = new g_tplC(array('tpl'=>GALLINA_DIR_TPL.$nameTpl.'.tpl','compil'=>$file));
			$c->compil($const);
		}
		//chargement de la fonction
		require_once($file);

		// démarrage d'une tamporisation de sortie
		ob_start ();

		// on execute la function du template
		$nameFile = 'tpl_'.md5($file);
		$nameFile($vars);

		// on éteint la tamporisation de sortie
		return ob_get_clean();
	}

	public static function clearAll(){
		foreach (dirs::glob_recursive(GALLINA_DIR_CACHE.'tpl-*') as $file)
			unlink($file);
	}
}
?>
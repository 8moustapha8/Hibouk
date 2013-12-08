<?php
/**
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Installation du package
 *
 * Le nom de class doit être "prefix"_install
 * Actions : install, update and remove
 *
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 */
class bdlcreat_install {

	/**
	* Installation
	*
	* @param array $package défintion du package
	*/
	public function install($package) {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on s'assure que le fichier source est créé
		$BOOTSTRAP_BUNDLES->get();
		// on ajoute l'entrée
		$BOOTSTRAP_BUNDLES->add(array(
				'bundlecreat' => 'bdl/bundlecreat/bdlcreat_bundlecreat_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'bundlecreat' => array('type'=>'package','file'=>'js/bundlelist/bdlcreat_bundlesList')
			)
		);
	}

	/**
	* Suppression
	*
	*/
	public function remove($package) {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('bundlecreat'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('bundlecreat'));
	}
}
?>
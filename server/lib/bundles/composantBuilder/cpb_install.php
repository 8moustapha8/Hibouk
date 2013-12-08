<?php
/**
 * @package  composantBuilder
 * @subpackage composantBuilder (cpb_)
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
 * @package  composantBuilder
 * @subpackage composantBuilder (cpb_)
 */
class cpb_install {

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
				'composantBuilder' => 'bdl/composantBuilder/cpb_composantBuilder_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'composantBuilder' => array('type'=>'package','file'=>"js/bundlelist/cpb_bundlesList")
			)
		);
	}

	/**
	* Suppression
	*
	*/
	public function remove() {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('composantBuilder'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('composantBuilder'));
	}
}
?>
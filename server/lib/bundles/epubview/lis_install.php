<?php
/**
 * @package  epubview
 * @subpackage application (lis_)
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
 * @package  epubview
 * @subpackage application (lis_)
 */
class lis_install {

	/**
	* Installation
	*
	* @param array $package défintion du package
	*/
	public function install($package) {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BOOTSTRAP_BUNDLES->get();
		// on ajoute l'entrée
		$BOOTSTRAP_BUNDLES->add(array(
				'Visualization' => 'bdl/epubview/lis_bookEpubview_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'Visualization' => array('type'=>'extend','file'=>'js/bundlelist/lis_bundlesList')
			)
		);
	}

	/**
	* Suppression
	*
	*/
	public function remove() {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('Visualization'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('Visualization'));
	}
}
?>
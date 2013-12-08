<?php
/**
 * @package  --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 * @author --AUTHOR--
 * @licence --LICENCE--
 */

/**
 *
 * Installation du package
 *
 * Le nom de class doit être "prefix"_install
 * Actions : install, update and remove
 *
 * @package  --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 */
class --NSP--_install {

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
				'--NAMEBDL--' => 'bdl/--NBDL--/--NSP--_--NBDL--_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'--NAMEBDL--' => array('type'=>'--TYPE--','file'=>"js/bundlelist/--NSP--_bundlesList")
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
		$BOOTSTRAP_BUNDLES->remove(array('--NAMEBDL--'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('--NAMEBDL--'));
	}
}
?>
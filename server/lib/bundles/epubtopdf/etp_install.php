<?php
/**
 * @package  epubtopdf
 * @subpackage application (etp_)
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
 * @package  epubtopdf
 * @subpackage application (etp_)
 */
class etp_install {

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
				'ePubToPDF' => 'bdl/epubtopdf/etp_epubtopdf_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'ePubToPDF' => array('type'=>'extend','file'=>"js/bundlelist/etp_bundlesList")
			)
		);

		// bootstap (config)
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on s'assure que le fichier source est créé
		$BOOTSTRAP_BUNDLES->get();
		// on ajoute l'entrée
		$BOOTSTRAP_BUNDLES->add(array(
				'pkepubtotpdf' => 'bdl/epubtopdf/etp_pkepubtotpdf_bdl.js'
			)
		);

		// bundle (config)
		$BUNDLESFILES = new g_configBUNDLES();
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'pkepubtotpdf' => array('type'=>'extend','file'=>'js/bundlelist/etp_pk_bundlesList')
			)
		);

		// configuration du bundle
		$confVars = array(
			'ETP_HOST' => array(
				'type' => 'const',
				'comment'=> 'Host',
				'val' => 'localhost',
				'filter' => 'filex',
				'default' => 'localhost'
			),
			'ETP_ZOOMFACTOR' => array(
				'type' => 'const',
				'comment'=> 'Zoom factor',
				'val' => '125',
				'filter' => 'file',
				'default' => '125'
			)
		);

		$confAppli = new g_configAPPLI();
		$confAppli->add($confVars);
	}

	/**
	* Suppression
	*
	*/
	public function remove() {

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('ePubToPDF'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('ePubToPDF'));

		// bootstap (config)
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('pkepubtotpdf'));

		// bundle (config)
		$BUNDLESFILES = new g_configBUNDLES();
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('pkepubtotpdf'));

		// configuration du bundle
		$confAppli = new g_configAPPLI();
		$confAppli->remove(array('ETP_HOST'));
	}
}
?>
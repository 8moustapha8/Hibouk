<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
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
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_install {

	/**
	* Installation
	*
	* @param array $package défintion du package
	*/
	public function install($package) {

		// création des dossiers pour l'appli
		$epubs = GALLINA_ROOT.'epubs';
		if(!file_exists($epubs))
			mkdir($epubs, 0777,true);

		$resources = GALLINA_ROOT.'resources';
		if(!file_exists($resources))
			mkdir($resources, 0777,true);

		$thumbnail = $resources.DS.'thumbnail';
		if(!file_exists($thumbnail))
			mkdir($thumbnail, 0777,true);

		// Repository
/*
		$Repository = new g_configPackages();
		$Repository->addRepository(array(
			'id' => 'ab707c45-ba7c-41db-8b5a-9ac25b9c7586',
			'name' => 'Hibouk official repository',
			'url' => 'http://repository.hibouk.org/hibouk/',
			'type' => 'g_httpFree'
		));
*/
		// adresse
		$adr = new g_configADR();
		$adr->add(array(
			'libXSLT' => array(
				'dirAdr' => "GALLINA_DIR_SERVER.'lib/appli'",
				'dirUrl' => "GALLINA_DIRNAME_SERVER.'/lib/appli'",
				'ext' => 'xsl',
			),
			'epubMODELS' => array(
				'dirAdr' => "GALLINA_DIR_SERVER.'lib/appli/models'",
				'dirUrl' => "GALLINA_DIRNAME_SERVER.'/lib/appli/models'",
				'ext' => 'zip',
			),
			'epubs' => array(
				'dirAdr' => "GALLINA_ROOT.'epubs'",
				'dirUrl' => "'epubs'",
				'ext' => 'xxx',
			),
			'thumbnail' => array(
				'dirAdr' => "GALLINA_ROOT.'resources/thumbnail'",
				'dirUrl' => "'resources/thumbnail'",
				'ext' => 'jpg',
			),
			'transform' => array(
				'dirAdr' => "GALLINA_DIR_SERVER.'lib/appli/transform'",
				'dirUrl' => "GALLINA_DIRNAME_SERVER.'/lib/appli/transform'",
				'ext' => 'php',
			)
		));

		// configuration de l'appli
		$confVars = array(
			'APPLI_BOOK_NUMBER' => array(
				'type' => 'const',
				'comment'=> 'Nombre de livre par page affiché dans la biblio',
				'val' => 500,
				'filter' => 'integer',
				'default' => 50
			),
			'APPLI_TABLE' => array(
				'type' => 'const',
				'comment'=> 'Table de la BD',
				'val' => 'hibouk',
				'filter' => 'string',
				'default' => 'hibouk'
			)
		);

		$confAppli = new g_configAPPLI();
		$confAppli->add($confVars);


		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on s'assure que le fichier source est créé
		$BOOTSTRAP_BUNDLES->get();
		// on ajoute l'entrée
		$BOOTSTRAP_BUNDLES->add(array(
				'packagesAplli' => 'bdl/packagesAppli/ap_packagesAppli_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'packagesAplli' => array('type'=>'extend','file'=>'js/bundlelist/ap_pk_bundlesList')
			)
		);
	}

	/**
	* Suppression
	*
	*/
	public function remove($package) {
		// Repository
		/*
		$Repository = new g_configPackages();
		$Repository->removeRepository('ab707c45-ba7c-41db-8b5a-9ac25b9c7586');
		*/
		// adresse
		$adr = new g_configADR();
		$adr->remove(array('libXSLT','epubMODELS','epubs','thumbnail','transform'));
		// configuration de l'appli
		$confAppli = new g_configAPPLI();
		$confAppli->remove(array('APPLI_BOOK_NUMBER','APPLI_TABLE'));

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES();
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('packagesAplli'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES();
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('packagesAplli'));
	}
}
?>
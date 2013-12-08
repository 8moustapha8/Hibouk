<?php

class sophia_install {

	/**
	* Installation
	*
	* @param array $package défintion du package
	*/
	public function install($package) {

		// adresse
		$adr = new g_configADR();
		$adr->add(array(
			'sophiaXSLT' => array(
				'dirAdr' => "GALLINA_DIR_SERVER.'lib/bundles/sophia'",
				'dirUrl' => "GALLINA_DIRNAME_SERVER.'/lib/bundles/sophia'",
				'ext' => 'xsl',
			)
		));

		// models
		$epubModels = new g_configEpubModels();
		$epubModels->add('Sophia epub 2.0.1','sophia_epub2');

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BOOTSTRAP_BUNDLES->get();
		// on ajoute l'entrée
		$BOOTSTRAP_BUNDLES->add(array(
				'sophia' => 'bdl/sophia/sophia_find_bdl.js'
			)
		);

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on s'assure que le fichier source est créé
		$BUNDLESFILES->get();
		// on ajoute l'entrée
		$BUNDLESFILES->add(array(
				'sophia' => array('type'=>'appli','file'=>'js/bundlelist/sophia_bundlesList')
			)
		);
	}

	/**
	* Suppression
	*
	*/
	public function remove() {

		// adresse
		$adr = new g_configADR();
		$adr->remove(array('sophiaXSLT'));

		// models
		$epubModels = new g_configEpubModels();
		$epubModels->remove('Sophia epub 2.0.1');

		// bootstap
		$BOOTSTRAP_BUNDLES = new g_configBOOTSTRAP_BUNDLES('ap');
		// on supprime l'entrée
		$BOOTSTRAP_BUNDLES->remove(array('sophia'));

		// bundle
		$BUNDLESFILES = new g_configBUNDLES('ap');
		// on supprime l'entrée
		$BUNDLESFILES->remove(array('sophia'));
	}
}
?>
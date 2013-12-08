<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Lecture du contenu d'un dépôt locale
 *
 * @param array $depot url, nom du dépot
 * @return array
 */
function g_locale($depot){

	// fichier de packages dans le dépot
	$file = $depot['url'].'packages.xml';

	// le renvoie est fait sous forme de tableau contenant
	// errorStatus => false si pas d'erreur ou true en cas d'erreur
	// error => tableau du dépot qui a génré une erreur
	// packages => contient tout les items du dépot

	if(!file_exists($file)){
		// Le fichier des packages sur le dépôt n’existe pas
		$packages = errors::inner('The file of packages on repository does not exist','Err-g-7',$depot['name']);
	} else {
		$packages = errors::inner();
		try {
			// chargement du fichier XML
			$packages_xml = simplexml_load_file($file);

			// parse le fichier pour construire un tableau
			$_packages = array();
			foreach ($packages_xml as $i) {
				$_packages[] = array(
					'uid' => (string) $i['uid'],
					'namespace' => (string) $i['namespace'],
					'name' => (string) $i['name'],
					'phase_dev' => (string) $i['phase_dev'],
					'version' => (string) $i['version'],
					'depend' => (string) $i['depend']
				);
			}

			$packages['packages'] = $_packages;

		} catch (Exception $e) {
			// Impossible d’ouvrir le fichier des packages sur le dépôt
			$packages = errors::inner('Unable to open file of packages on repository','Err-g-8',$depot['name']);
    	}
	}
	return $packages;
}
?>
<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Copie d'un package depuis un dépot locale
 *
 * @param array $depot url, nom du dépot
 * @param array $packageFile nom du fichier du package
 * @param array $dirCopy dossier ou effectuer la copie
 * @return array
 */
function g_locale($depot,$packageFile,$dirCopy){

	// fichier package dans le dépot
	$file = $depot['url'].$packageFile;

	// errorStatus => false si pas d'erreur ou true en cas d'erreur
	// package => contient les infos sur le package

	if(!file_exists($file)){
		// Le package n’existe pas dans le dépôt
		$package = errors::inner('The package does not exist in the repository','Err-g-11',$file);
	} else {
		$package = errors::inner();
		try{
			// dossier temporaire de copy
			if(!file_exists($dirCopy))
				mkdir($dirCopy, 0777,true);
			$fileLocal = $dirCopy.DS.$packageFile;
			copy($file, $fileLocal);
			$package['file'] = $fileLocal;

		} catch (Exception $e) {
			 // Erreur de copie du package depuis le dépôt
			$package = errors::inner('Error to copy the package from the repository','Err-g-12',$fileLocal);
		}
	}
	return $package;
}
?>
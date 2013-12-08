<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Outils pour les dossiers
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class dirs {

	/**
	* Suppression d'un dossier et ce qu'il contient
	*
	* @param string $f dossier à effacer
	*/
	public static function deleteDirectory($f){
		if(is_dir($f)){
			foreach(scandir($f) as $item ){
				if( !strcmp($item,'.') || !strcmp($item,'..') )
						continue;
					self::deleteDirectory($f.DS.$item );
			}
			rmdir($f);
		} else {
			if(is_file($f))
				unlink($f);
		}
	}

	/**
	* Suppression du contenu d'un dossier
	*
	* @param string $dir dossier à effacer
	*/
	public static function deleteContentDirectory($dir,$mode=0777){
		self::deleteDirectory($dir);
		mkdir ($dir,$mode);
	}

	/**
	* Suppression d'un fichier
	*
	* @param string $file fichier à effacer
	*/
	public static function deleteFile($file){
		$file = str_replace('/', DS, $file);
		unlink(GALLINA_ROOT.$file);
	}

	/**
	 * Vide les caches de gallina
	 *
	 */
	public static function emptyGallinaCache(){
		self::_emptyCache(GALLINA_DIR_CACHE);
	}

	/**
	* Vide les caches
	*
	* @param string $path chemin à chercher les dossiers de cache
	*/
	private static function _emptyCache($path){
		$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::CHILD_FIRST);
		foreach($iterator as $_path){
			if($_path->isDir() && $_path->getFilename()==GALLINA_DIRNAME_CACHE)
				self::deleteContentDirectory($_path->__toString(),$mode=0777);
		}
	}

	/**
	 * Création d'un répertoire
	 *
	 * @param string $path le chemin
	 * @param boolean $recursive création de répertoires imbriqués
	 */
	public static function creatDir($path,$recursive=false){
		if(!is_dir($path)){
			if (!mkdir($path, 0777,$recursive)) // Echec lors de création de répertoires
				trigger_error("[36] Failed to create directory : ".$path, E_USER_ERROR);// E[36]
		}
	}

	public static function glob_recursive ($pattern, $flags = 0) {
		$files = glob($pattern, $flags);
		foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
			$files = array_merge($files, self::glob_recursive($dir.'/'.basename($pattern), $flags));
		return $files;
	}

	static public function copyDir($source, $dest) {
    if(is_dir($source)) {
        $dir_handle = opendir($source);
        $sourcefolder = basename($source);
        mkdir($dest.DS.$sourcefolder);
        while($file = readdir($dir_handle)){
            if($file!="." && $file!=".."){
                if(is_dir($source.DS.$file))
                    self::copyDir($source.DS.$file, $dest.DS.$sourcefolder);
                else
                    copy($source.DS.$file, $dest.DS.$sourcefolder.DS.$file);
            }
        }
        closedir($dir_handle);
    } else {
        copy($source, $dest);
    }
}
}
?>
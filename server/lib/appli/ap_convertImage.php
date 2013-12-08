<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Convertiseur d'images
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_convertImage {

	private static $_validBitmap = array('bmp','rle','dib','emf','psd','tif','tiff','pict','pct','odg');

	private static $_validVector = array('eps','ps','wmf');

	private static $_htmlFormats = array('jpg','jpeg','png','gif','svg');

	static public function getName($file){
		$infoFile = pathinfo($file);
		$extension = strtolower($infoFile['extension']);
		// validité du format
		if(!in_array($extension, self::$_htmlFormats)){
			// conversion
			if(in_array($extension, self::$_validBitmap)){
				// convert bitmap
				return $infoFile['filename'].'.png';
			} else if(in_array($extension, self::$_validVector)){
				// convert vector
				return $infoFile['filename'].'.svg';
			} else {
				return null;
			}
		}
		return $file;
	}

	static public function getValidFormats(){
		return array_merge(self::$_htmlFormats,self::$_validBitmap,self::$_validVector);
	}

	static public function get($file){
		$infoFile = pathinfo($file);
		$extension = strtolower($infoFile['extension']);

		// validité du format
		if(!in_array($extension, self::$_htmlFormats)){
			// conversion
			if(in_array($extension, self::$_validBitmap)){
				// convert bitmap
				return self::_convert($file,$infoFile,'png');
			} else if(in_array($extension, self::$_validVector)){
				// convert vector
				return self::_convert($file,$infoFile,'svg');
			} else {
				return null;
			}
		}
		return $file;
	}

	static private function _convert($file,$infoFile,$newExtension){
		$newFile = $infoFile['dirname'].DS.$infoFile['filename'].'.'.$newExtension;
		$command = sprintf('convert %s %s 2>&1', $file, $newFile);
		$output = shell_exec($command);
		if(strlen($output)!=0) {
			return null;
		} else {
			unlink($file);
			return $newFile;
		}
	}
}
?>
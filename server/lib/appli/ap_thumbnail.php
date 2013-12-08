<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Création des vignettes de couverture
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_thumbnail {

	private $_file = '';
	private $_maxwidth = 60;
	private $_maxheight = 80;

	public function __construct($file,$maxwidth=60,$maxheight=80){
		$this->_file = $file;
		$this->_maxwidth = $maxwidth;
		$this->_maxheight = $maxheight;
	}

	public function creat($file) {
		$ret = false;
		if(is_file($this->_file)) {
			$extension = strtolower(pathinfo($this->_file,  PATHINFO_EXTENSION));
			if(in_array($extension, array('png','jpg','jpeg'))) {
				if($extension=='png')
					$img = imagecreatefrompng($this->_file);
				else
					$img = imagecreatefromjpeg($this->_file);

				$width = imagesx($img); //get width and height of original image
				$height = imagesy($img);

				if ($height > $width) {
					$ratio = $this->_maxheight / $height;
					$newheight = $this->_maxheight;
					$newwidth = $width * $ratio;
				} else {
					$ratio = $this->_maxwidth / $width;
					$newwidth = $this->_maxwidth;
					$newheight = $height * $ratio;
				}

				// Création d'une image vide et ajout d'un texte
				$newimg = imagecreatetruecolor($newwidth,$newheight);

				imagecopyresampled($newimg, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
				// Sauvegarde de l'image sous le nom 'simpletext.jpg'
				imagejpeg($newimg, $file);

				// Libération de la mémoire
				imagedestroy($newimg);

				$ret = true;
			}
		}
		return $ret;
	}
}
?>
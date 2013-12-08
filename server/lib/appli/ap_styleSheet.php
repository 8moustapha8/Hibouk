<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion de feuilles de style
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_styleSheet {
	/**
	* Variable de class pour l'instance
	*
	* @var instance
	*/
	private static $_instance = null;
	private static $_styleSheets = array();
	private static $_attr_tmp = array();
	private static $_dirImgRelatif = '';
	private static $_dirImg = '';
	private static $_id = null;
	private static $_footNum = array();

	/**
	* Constructeur privé, empèche une instanciation externe
	*
	* @value : none
	* @return : none
	*/
	private function  __construct($styleSheets_transform,$dirImgRelatif,$dirImg) {
			self::$_styleSheets = $styleSheets_transform;
			self::$_dirImgRelatif = $dirImgRelatif;
			self::$_dirImg = $dirImg;
			self::$_id = time();
	}

	/**
	* Empêche le clonage
	*
	* @return : none
	*/
	private function  __clone() {}

	/**
	* crée une instance de la class
	*
	* @param : none
	* @return : none
	*/
	public static function construct($styleSheets_transform,$dirImgRelatif,$dirImg){
		self::$_instance = new self($styleSheets_transform,$dirImgRelatif,$dirImg);
	}

	/**
	*  est-ce que le style existe dans le tableau de transformation ?
	*
	* @param (string $name) nom du style
	* @return : boolean
	*/
	public static function style_in_array($name) {
		if (array_key_exists($name, self::$_styleSheets))
			return '1';
		else
			return '0';
	}

	/**
	* création d'un id de footnote
	*
	* @param (string $id)
	* @return (string)
	*/
	public static function set_footID($id) {
		self::$_footNum[$id] = self::$_id.'_'.$id;
		return self::$_footNum[$id];
	}

	/**
	* Récupération d'unid de footnote
	*
	* @param (string $id)
	* @return (string)
	*/
	public static function get_footID($id) {
		return self::$_footNum[$id];
	}

	/**
	* création d'un nouvel élément
	*
	* @param (string $name) : nom de l'élément dans la source
	* @return (string) : nom de l'élément
	*/
	public static function creat_element($name) {
		return self::$_styleSheets[$name]['name'];
	}

	/**
	*  compte le nombre d'éléments et place les valeurs dans $_attr_tmp
	*
	* @param (string $x) : les attributs de l'élément
	* @return (integer) : le nombre d'attributs
	*/
	public static function count_attributs($x){
		$c = count($x)-1;
		if($c > 0 ){
			$a = array();
			foreach ($x as $k => $v){
				$a[] = array($v->name,$v->value);
			}
			self::$_attr_tmp = $a;
		}
		return $c;
	}

	/**
	*  substitution d'un attribut
	*
	* @param (string $attr) : position de l'attribut dans $_attr_tmp
	* @param (string $style) : nom du style
	* @return (string) : nom de l'attribut
	*/
	public static function switch_attr($attr,$style){
		if (@array_key_exists(self::$_attr_tmp[(int) $attr][0], self::$_styleSheets[$style]['attr'])){
			return self::$_styleSheets[$style]['attr'][self::$_attr_tmp[(int) $attr][0]];
		} else {
			return '';
		}
	}

	/**
	*  retourne la valeur enregistré de l'attribut
	*
	* @param (string $attr) : nom de l'attribut
	* @return (string) : valeur enregistré
	*/
	// retourne la valeur enregistré
	public static function value_attr($attr){
		return self::$_attr_tmp[(int) $attr][1];
	}

	/**
	*  comptage pour de nouveaux attributs
	*
	* @param (string $style) : nom du style
	* @return (integer) : nombre de l'attribut
	*/
	public static function count_new_attr($style){
		$x = count(self::$_styleSheets[$style]['newattr']);
		if($x>0)
			return $x-1;
		else
		return 'null';
	}

	/**
	*  crée un nouvel attribut
	*
	* @param (string $attr) : position de l'attribut
	* @param (string $style) : nom du style
	* @return (string) : nom de l'attribut
	*/
	public static function creat_new_attr($attr,$style){
		return key(array_slice(self::$_styleSheets[$style]['newattr'],(int) $attr,1));
	}

	/**
	*  la valeur par défaut pour un nouvel attribut
	*
	* @param (string $attr) : position de l'attribut
	* @param (string $style) : nom du style
	* @return (string) : valeur par défaut de l'attribut
	*/
	public static function value_new_attr($attr,$style){
		return current(array_slice(self::$_styleSheets[$style]['newattr'],(int) $attr,1));
	}

	public static function link_src($l){
		$file = ap_convertImage::getName(pathinfo($l,PATHINFO_BASENAME));
		if($file==null){
			$file = 'ap_novalidformat.png';
			copy(adr::getAdr('ap_novalidformat~imgPNG'), self::$_dirImg.$file);
		}

		return self::$_dirImgRelatif.$file;
	}
}
?>
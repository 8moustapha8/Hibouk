<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Gestion des adresses
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class adr {
	/**
	 * Instance du singleton
	 *
	 * @var object adr
	 */
	private static $_instance = null;

	/**
	 * Liste des dossiers
	 *
	 * @var array
	 */
	protected $_dirs = null;

	/**
	 * Initialisation
	 *
	 */
	public static function init(){
		if (is_null(self::$_instance)){
			// création de l'instance du singleton
			self::$_instance = new self();

			$conf = new g_configADR();

			self::$_instance->_dirs = $conf->load();

			return self::$_instance;
		} else {
			throw new Exception('[22] Instance de adr déjà réalisée');// E[22]
		}
	}

	/**
	 * Renvoie l'instance du singleton
	 *
	 * @return object adr
	 */
	public static function getInstance(){
		if (is_null(self::$_instance)){
			throw new Exception('[23] Instance de adr non réalisée');// E[23]
		}
		return self::$_instance;
	}

	/**
	 * Construction d'une adresse
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @param boolean $file ajout ou nom du fichier partie 0 du sélecteur
	 * @return string
	 */
	protected static function _getAdr($sel,$dirReplace,$dirAdd,$file=true){
		$i = self::getInstance();
		$sel = explode('~',$sel);
		$link = '';
		if(isset($i->_dirs[$sel[1]])){
			$link = $i->_dirs[$sel[1]]['dirAdr'].DS;

			if($dirReplace!=null){
					foreach($dirReplace as $v)
						$rep .= DS.$v;
					$link = str_replace(DS.'??', $rep, $link);
			}

			if($dirAdd!=null)
				foreach($dirAdd as $v)
					$link .= $v.DS;

			if($file)
				$link .= str_replace('/', DS, $sel[0]).'.'.$i->_dirs[$sel[1]]['ext'];

			return $link;
		} else {
			trigger_error("[6] Address key does not exist : $sel[1] ", E_USER_WARNING);// E[6]
		}
	}

	/**
	 * Construction d'une adresse sans fichier
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @return string
	 */
	public static function getAdrNofile($sel,$dirReplace=null,$dirAdd=null){
		return self::_getAdr($sel,$dirReplace,$dirAdd,false);
	}

	/**
	 * Construction d'une adresse avec fichier
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @return string
	 */
	public static function getAdr($sel,$dirReplace=null,$dirAdd=null){
		return self::_getAdr($sel,$dirReplace,$dirAdd);
	}

	/**
	 * Construction d'une adresse de type répertoire
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @param boolean $creat création du répertoire si il n'existe pas
	 * @return string
	 */
	public static function getAdrDir($type,$dirReplace=null,$dirAdd=null,$creat=false){
		$i = self::getInstance();
		if(isset($i->_dirs[$type])){
			$link = $i->_dirs[$type]['dirAdr'];


			if($dirReplace!=null){
				foreach($dirReplace as $v){
					$rep .= DS.$v;
					if($creat){
						if(!is_dir($link))
							mkdir($link, 0777);
					}
				}
				$link = str_replace(DS.'??', $rep, $link);
			}

			if($dirAdd!=null){
				foreach($dirAdd as $v){
					$link .= DS.$v;
					if($creat){
						if(!is_dir($link))
							mkdir($link, 0777);
					}
				}
			}
			return $link;
		} else {
			trigger_error("[7] Address key does not exist : $sel[1] ", E_USER_WARNING);// E[7]
		}
	}

	/**
	 * Construction d'une URL relative avec fichier
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @return string
	 */
	public static function getRurl($sel,$dirReplace=null,$dirAdd=null){
		return self::_getRurl($sel,$dirReplace,$dirAdd);
	}

	/**
	 * Construction d'une URL relative sans fichier
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @return string
	 */
	public static function getRurlNofile($sel,$dirReplace=null,$dirAdd=null){
		return self::_getRurl($sel,$dirReplace,$dirAdd,false);
	}

	/**
	 * Construction d'une URL relative
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @param boolean $file ajout ou nom du fichier partie 0 du sélecteur
	 * @return string
	 */
	protected static function _getRurl($sel,$dirReplace=null,$dirAdd=null,$file=true){
		$i = self::getInstance();
		$sel = explode('~',$sel);
		if(isset($i->_dirs[$sel[1]])){

			$link = $i->_dirs[$sel[1]]['dirUrl'].'/';

			if($dirReplace!=null){
				foreach($dirReplace as $v)
					$rep .= '/'.$v;
				$link = str_replace('/??', $rep, $link);
			}

			if($dirAdd!=null){
				foreach($dirAdd as $v)
					$link .= $v.'/';
			}

			if($file)
				$link .= $sel[0].'.'.$i->_dirs[$sel[1]]['ext'];

			return $link;
		} else {
			trigger_error("[8] Address key does not exist : $sel[1] ", E_USER_WARNING);// E[8]
		}
	}

	/**
	 * Construction d'une URL absolue
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dir dossier(s)
	 * @return string
	 */
	public static function getGurl($sel,$dir=array()){
		$i = self::getInstance();
		$sel = explode('~',$sel);
		if(isset($i->_dirs[$sel[1]])){
			$link = g_url::getParam('pathUrl').$i->_dirs[$sel[1]]['dirUrl'].'/';

			if($dirReplace!=null){
				foreach($dirReplace as $v)
					$rep .= '/'.$v;
				$link = str_replace('/??', $rep, $link);
			}


			if($dirAdd!=null){
				foreach($dirAdd as $v)
					$link .= $v.'/';
			}

			$link .= $sel[0].'.'.$i->_dirs[$sel[1]]['ext'];

			return $link;
		} else {
			trigger_error("[9] Address key does not exist : $sel[1] ", E_USER_WARNING);// E[9]
		}
	}

		/**
	 * Retourne le contenu d'un fichier
	 *
	 * @param string $sel sélecteur d'adresse
	 * @param array $dirReplace dossier(s) pour remplacer la partie /??/ du masque des adresses
	 * @param array $dirAdd dossier(s) ajouté(s) à l'adresse
	 * @return string
	 */
	public static function get($sel,$dirReplace=null,$dirAdd=null){
		return file_get_contents(adr::getAdr($sel,$dirReplace,$dirAdd));
	}
}
?>
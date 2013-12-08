<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Classe principale des requètes
 *
 * Liste des filtres :<br/>
 * integer 			: integer <br/>
 * min 					: valeur minimum ou égal<br/>
 * max 					: valeur maximum ou égal<br/>
 * bool 				: boolean <br/>
 * alnum 				: alphanumérique <br/>
 * minlength		: longeur d'une chaine minimum ou égal<br/>
 * maxlength		: longeur d'une chaine maximum ou égal<br/>
 * rangelength	: longeur d'une chaine minimum ou égal et longeur d'une chaine maximum ou égal<br/>
 * email 			: email <br/>
 * url 				: url <br/>
 * string 			: alphanumérique + '_' + '-' <br/>
 * stringI 			: alphanumérique + accents + '_' + '-' <br/>
 * stringIS 		: alphanumérique + accents + espace + tabulation <br/>
 * stringIP 		: alphanumérique + accents + ponctuation <br/>
 * stringISP 		: alphanumérique + accents + espace + ponctuation <br/>
 * file 			: alphanumérique + '_' + '-' + '.' <br/>
 * filex 			: alphanumérique + '_' + '-' + '.' + '/' <br/>
 * DNS 				: alphanumérique + '_' + '-' + '/' + '.' + ';'
 * list 			: alphanumérique + accents + '_' + ',' <br/>
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */

interface Irequest {
	public function initParams();
}


abstract Class g_request {

	/**
	 * Tableau des paramètres
	 *
	 * @var array
	 */
	public $params = array();

	/**
	 * Tableau des expression régulière pour les filtres
	 *
	 * @var array
	 */
	private $_filter = array(
		'string'		=> '/^[[:alnum:]_\-]+$/iD', // alphanumérique + '_' + '-'
		'stringI'	=> '/^[\p{L}[:alnum:]_\-]+$/iD', // alphanumérique + accents + '_' + '-'
		'stringIS'	=> '/^[\p{L}[:alnum:][:blank:]\.\_\-]+$/iD', // alphanumérique + accents + espace + tabulation
		'stringIP'	=> '/^[\p{L}\p{P}[:alnum:]]+$/D', // alphanumérique + accents + ponctuation
		'stringISP'	=> '/^[\p{L}\p{P}[:alnum:][:blank:]]+$/D', // alphanumérique + accents + espace + ponctuation
		'file'	=> '/^[[:alnum:]_\-\.]+$/iD', // alphanumérique + '_' + '-' + '.'
		'filex'	=> '/^[[:alnum:]_\-\/\.]+$/iD', // alphanumérique + '_' + '-' + '/'
		'DNS'	=> '/^[[:alnum:]_;=\-\/\.\:]+$/iD', // alphanumérique + '_' + '-' + '/' + '.' + ';'
		'list'	=> '/^[\p{L}[:alnum:]_,]+$/iD' // alphanumérique + accents + '_' + ','
	);

	/**
	 * Envoie d'un paramètre selon son type de valeur.
	 * Si le type de valeur n'est pas valide la valeur
	 * par défaut est retourné
	 *
	 * @param string $name Nom du paramètre
	 * @param string $default Valeur par défaut
	 * @param mixed $type Type de valeur
	 * @param mixed $option Option du filtre
	 * @return mixed
	 */
	public function getParam($name,$default,$type,$option=''){

		// si c'est un tableau
		if(is_array($type)){
			// par défaut on ne retourne pas la valeur par défaut
			$returnDefault = false;

			// on recontruit les type et les option selon le tableau
			foreach($type as $k => $v){
				if(!is_integer($k)){
					$type = $k;
					$option = $v;
				} else {
					$type = $v;
					$option = '';
				}
				// on teste
				$return = $this->_getParam($name,$default,$type,$option);

				// si le retour est égal à la valeur par défaut
				// on stoppe et on retourne la valeur par défaut
				if($return == $default){
					$returnDefault = true;
					break;
				}
			}

			// retour
			if($returnDefault)
				return $default;
			else
				return $return;

		} else {
			return $this->_getParam($name,$default,$type,$option);
		}
	}

	/**
	 * Envoie d'un paramètre selon son type de valeur.
	 * Si le type de valeur n'est pas valide la valeur
	 * par défaut est retourné
	 *
	 * @param string $name Nom du paramètre
	 * @param string $default Valeur par défaut
	 * @param mixed $type Type de valeur
	 * @param mixed $option Option du filtre
	 * @return mixed
	 */
	public function _getParam($name, $default,$type,$option=''){
		if(isset($this->params[$name])){
			switch($type){

				// integer
				case 'integer' :
					return filter_var($this->params[$name], FILTER_VALIDATE_INT) ? (int) $this->params[$name] : (int) $default;
				break;

				// min
				case 'min' :
					return ($this->params[$name]+0) >= ($option+0) ? ($this->params[$name]+0) : ($default+0);
				break;

				// max
				case 'max' :
					return ($this->params[$name]+0) <= ($option+0) ? ($this->params[$name]+0) : ($default+0);
				break;

				// boolean
				case 'bool' :
					if(in_array($this->params[$name], array('true','false','1','0','TRUE','FALSE','on','off'))){
						if(in_array($this->params[$name], array('true','1','TRUE','on')))
							return true;
						else
							return false;
					} else {
						return $default === 'true'? true: false;
					}
				break;

				// alphanumérique
				case 'alnum' :
					return ctype_alnum($this->params[$name]) ? $this->params[$name] : $default;
				break;

				// minWord
				case 'minlength' :
					return strlen($this->params[$name])>=$option ? $this->params[$name] : $default;
				break;

				// minWord
				case 'maxlength' :
					return strlen($this->params[$name])<=$option ? $this->params[$name] : $default;
				break;

				// rangelength
				case 'rangelength' :
					if(strlen($this->params[$name])>=$option[0] && strlen($this->params[$name])<=$option[1])
						return $this->params[$name];
					else
						return $default;
				break;

				// mail
				case 'email' :
					return filter_var($this->params[$name], FILTER_VALIDATE_EMAIL) ? $this->params[$name] : $default;
				break;

				// url
				case 'url' :
					return filter_var($this->params[$name], FILTER_VALIDATE_URL) ? $this->params[$name] : $default;
				break;

				// Avec filtre REGEXP
				case 'string' :
				case 'stringI' :
				case 'stringIS' :
				case 'stringIP' :
				case 'stringISP' :
				case 'file' :
				case 'filex' :
				case 'DNS' :
				case 'list' :
					return filter_var($this->params[$name], FILTER_VALIDATE_REGEXP,
						array('options'=>array('regexp'=>$this->_filter[$type]))) ? stripcslashes($this->params[$name]) : $default;
				break;

				// Erreur de type provoque une erreur fatal
				default :
					// E[17]
					throw new Exception("[17] Erreur de type de filtrage. Filtre : $type ; nom du paramètre : $name");
				break;
			}
		} else {
			switch($type){
				// integer
				case 'integer' :
					return (int) $default;
				break;

				// min // max
				case 'min' :
				case 'max' :
					return ($default+0);
				break;

				// boolean
				case 'bool' :
						return $default === 'true'? true: false;
				break;

				// alphanumérique // minWord // minWord // rangelength // mail // url
				// Avec filtre REGEXP
				case 'alnum' :
				case 'minlength' :
				case 'maxlength' :
				case 'rangelength' :
				case 'email' :
				case 'url' :
				case 'string' :
				case 'stringI' :
				case 'stringIS' :
				case 'stringIP' :
				case 'stringISP' :
				case 'file' :
				case 'filex' :
				case 'DNS' :
				case 'list' :
					return $default;
				break;

				// Erreur de type provoque une erreur fatal
				default :
					// E[18]
					throw new Exception("[18] Erreur de type de filtrage. Filtre : $type ; nom du paramètre : $name");
				break;
			}
		}
	}

	/**
	 * Envoie d'un paramètre si il est valide selon son type de valeur.
	 * Sinon renvoie false ou null pour les boolean
	 *
	 * @param string $name Nom du paramètre
	 * @param string $type Type de valeur
	 * @param mixed $option Option du filtre
	 * @return mixed
	 */
	public function getValidParam($name,$type,$option=''){
		if(isset($this->params[$name])){
			switch($type){
				// integer
				case 'integer' :
					return filter_var($this->params[$name], FILTER_VALIDATE_INT) ? (int) $this->params[$name] : false;
				break;

				// min
				case 'min' :
					return ($this->params[$name]+0) >= ($option+0) ? ($this->params[$name]+0) : false;
				break;

				// max
				case 'max' :
					return ($this->params[$name]+0) <= ($option+0) ? ($this->params[$name]+0) : false;
				break;

				// boolean (retourne null en cas d'échec)
				case 'bool' :
					if(in_array($this->params[$name], array('true','false','1','0','TRUE','FALSE','on','off'))){
						if(in_array($this->params[$name], array('true','1','TRUE','on')))
							return true;
						else
							return false;
					} else {
						return null;
					}
				break;

				// alphanumérique
				case 'alnum' :
					return ctype_alnum($this->params[$name]) ? $this->params[$name] : false;
				break;

				// minWord
				case 'minlength' :
					return strlen($this->params[$name])>=$option ? $this->params[$name] : false;
				break;

				// minWord
				case 'maxlength' :
					return strlen($this->params[$name])<=$option ? $this->params[$name] : false;
				break;

				// rangelength
				case 'rangelength' :
					if(strlen($this->params[$name])>=$option[0] && strlen($this->params[$name])<=$option[1])
						return $this->params[$name];
					else
						return false;
				break;

				// mail
				case 'email' :
					return filter_var($this->params[$name], FILTER_VALIDATE_EMAIL) ? $this->params[$name] : false;
				break;

				// url
				case 'url' :
					return filter_var($this->params[$name], FILTER_VALIDATE_URL) ? $this->params[$name] : false;
				break;

				// Avec filtre REGEXP
				case 'string' :
				case 'stringI' :
				case 'stringIS' :
				case 'stringIP' :
				case 'stringISP' :
				case 'file' :
				case 'filex' :
				case 'DNS' :
				case 'list' :
					return filter_var($this->params[$name], FILTER_VALIDATE_REGEXP,
						array('options'=>array('regexp'=>$this->_filter[$type]))) ? stripcslashes($this->params[$name]) : false;
				break;

				// Erreur de type provoque une erreur fatal
				default :
					// E[19]
					throw new Exception("[19] Erreur de type de validation. Filtre : $type ; nom du paramètre : $name");
				break;
			}
		} else {
			if($type=='bool')
				return null;
			else
				return false;
		}
	}

	/**
	 * Transforme une liste de filtre en tableau
	 * exemple : alnum,minWord|2,maxWord|3,rangelength|2|3
	 *
	 * @param string $filter Chaine des filtres
	 * @return mixed
	 */
	public function filterToArray($filter){
		$r = array();
		$_filter = explode(',',$filter);
		if(count($_filter)>1){
			foreach($_filter as $v){
				$t_op = explode('|',$v);
				if(count($t_op)>1){
					if(count($t_op)>2){
						$k = $t_op[0];
						array_shift($t_op);
						$r[$k] = $t_op;
					} else {
						$r[$t_op[0]] = $t_op[1];
					}
				}
				else
					$r[$t_op[0]] = '';
			}
			return $r;
		} else {
			return $filter;
		}
	}
}
?>
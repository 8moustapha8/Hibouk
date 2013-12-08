<?php
/**
 * @package  Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Compilateur des templates
 *
 *
 * @package  Gallina °)>
 * @subpackage core (g_)
 */
class g_tplC {
	/**
	 * Liste des tokens
	 *
	 * @var array
	 */
	private  $type_ok = array(T_CHARACTER, T_CONSTANT_ENCAPSED_STRING, T_DNUMBER,
	T_ENCAPSED_AND_WHITESPACE, T_LNUMBER, T_OBJECT_OPERATOR, T_STRING, T_WHITESPACE,
	T_ARRAY,T_AND_EQUAL, T_DIV_EQUAL, T_MINUS_EQUAL, T_MOD_EQUAL,T_MUL_EQUAL,
	T_OR_EQUAL, T_PLUS_EQUAL, T_PLUS_EQUAL, T_SL_EQUAL,T_SR_EQUAL, T_XOR_EQUAL,
	T_BOOLEAN_AND, T_BOOLEAN_OR, T_EMPTY, T_INC, T_ISSET,T_IS_EQUAL,
	T_IS_GREATER_OR_EQUAL, T_IS_IDENTICAL, T_IS_NOT_EQUAL,T_IS_NOT_IDENTICAL,
	T_IS_SMALLER_OR_EQUAL, T_LOGICAL_AND,T_LOGICAL_OR, T_LOGICAL_XOR, T_SR, T_SL,
	T_DOUBLE_ARROW,T_STRING, T_ABSTRACT, T_AS, T_BREAK, T_CASE, T_CATCH, T_CLASS, T_CLONE,
	T_CONST, T_CONTINUE, T_DECLARE, T_DEFAULT, T_DO, T_ECHO, T_ELSE, T_ELSEIF, T_EMPTY,
	T_EXIT, T_FINAL, T_FOR, T_FOREACH, T_FUNCTION, T_GLOBAL, T_IF, T_IMPLEMENTS, T_INSTANCEOF,
	T_INTERFACE, T_LOGICAL_AND, T_LOGICAL_OR, T_LOGICAL_XOR, T_NEW, T_PRIVATE, T_PUBLIC,
	T_PROTECTED, T_RETURN, T_STATIC, T_SWITCH, T_THROW, T_TRY, T_USE, T_VAR, T_WHILE);

	/**
	 * Tableau du contenu des balises "literal"
	 *
	 * @var array
	 */
	private $_literal;

	/**
	 * Adresse du fichier source du template
	 *
	 * @var string
	 */
	private $_files = '';

	/**
	 * Traitement des constantes comme variable ou comme constante
	 *
	 * @var bool
	 */
	private $_const = true;


	/**
	* Constructeur
	*
	* @param string $files adresse des fichiers du template
	*/
	public function __construct($files){
		$this->_files = $files;
	}

	/**
	 * 	Compilation
	 *
	 * @param bool $const traitement des constantes comme variable ou comme constante
	 */
	public function compil($const=true){

		// traitement des constantes
		$this->_const = $const;

		// chargement du template
		$t = file_get_contents($this->_files['tpl']);

		$tJS = str_replace(array("\r\n", "\n", "\r"),'',addcslashes($t, "'"));

		// recherche des balises "literal"
		preg_match_all("#{{literal}}(.*?){{/literal}}#s",$t,$match);

		// sauvegarde du contenu des balises "literal"
		$this->_literal = $match[1];

		// on remplace les balises "literal"
		$t = preg_replace("#{{literal}}(.*?){{/literal}}#s",'{{literal}}',$t);

		// on annalyse toute les commandes {...}
		$t = preg_replace_callback("/{{((.).*?)}}/s", array($this,'_callback'), $t);

		// on enregistre la fonction
		// nom de la fonction
		$nameFile = 'tpl_'.md5($this->_files['compil']);
		file_put_contents($this->_files['compil'],"<?php\nfunction ".$nameFile."(\$v){\n?>".$t.'<?php } ?>');

	}

	/**
	* Fonction appeler lors du parsage des template
	*
	* @param array $matches tableau contenant les résultats
	* @return string code php
	*/
	private function _callback($matches){
		// Assigne les variables du tableau $matches
		list(,$tag, $firstcar) = $matches;

		// selon le premier caractère
		if ($firstcar == '$'){// variable
			return  '<?php echo '.$this->_parse($tag).'; ?>';
		} else if ($firstcar == '*'){// commentaire
			return '';
		} else {

			// commandes ?
			if(!preg_match('/^(\/?[a-zA-Z0-9_]+)(?:(?:\s+(.*))|(?:\((.*)\)))?$/',$tag,$m)){
				return '';
			} else {
				switch($m[1]){
				case 'foreach':
					return '<?php foreach('.$this->_parse($m[2]).'):?>';
				break;
				case 'if':
					return '<?php if('.$this->_parse($m[2]).'):?>';
				break;
				case 'else':
					return '<?php else:?>';
				case 'elseif':
					return '<?php elseif('.$this->_parse($m[2]).'):?>';
				break;
				case 'literal':
					return array_shift($this->_literal);
				break;
						case '/foreach':
						case '/for':
				case '/if':
				case '/while':
					return  '<?php end'.substr($m[1],1).';?>';
				break;
				default:
					if(substr($m[1], 0, 1)=='/'){
						$func = substr($m[1], 1);
						if(function_exists($func)){
							$f = $func($this,false,$this->_parse($m[2],true));
						} else {
							$f = '';
						}
					} else {
						$func = $m[1];
						if(function_exists($func)){
								$f = $func($this,true,$this->_parse($m[2],true));
						} else {
							$filePlugin = adr::getAdr($func.'~extendFunction',null,array('tpl'));
							if(file_exists($filePlugin)){
								require_once($filePlugin);
								$f = $func($this,true,$this->_parse($m[2],true));
							} else {
								$f = '';
							}
						}
					}
					return $f;
				break;
				}
			}
		}
	}

	/**
	* analyse de la commande
	*
	* @param string $string commande
	* @return string
	*/
	private function _parse($string,$resultArray=false){
		// variable du code php de la commande

		$t = '';
		$ts=array();
		$bracketcount = $sqbracketcount = 0;
		// On scinde un code source php en éléments de base
		$tokens = token_get_all('<?php '.$string.'?>');

		// tableau des constantes
		if(!$this->_const)
			$const = array();
		else
			$const = get_defined_constants();

		// annalyse du tableau des tokens
		foreach($tokens as $tok){
			// si le résultat est un tableau
			if (is_array($tok)){
				// Assigne les variables du tableau $tok
				list($type,$str)= $tok;

				if($type == T_VARIABLE){// si c'est de type T_VARIABLE
					$nameV = substr($str,1);
					// constante ou variables ?
					if(array_key_exists($nameV,$const))
						$t .= $nameV;
					else
				$t .= '$v[\''.$nameV.'\']';

				} else if(in_array($type, $this->type_ok)){// si ça appartient à la liste des tokens
					$t .= $str;
				}
			} else {
				if($tok =='.'){
					 $t .= $tok;
				} elseif ($tok =='(') {
							$bracketcount++;$t.=$tok;
					} elseif ($tok ==')') {
							$bracketcount--;$t.=$tok;
					} elseif ($tok =='[') {
							$sqbracketcount++;$t.=$tok;
					} elseif ($tok ==']') {
							$sqbracketcount--;$t.=$tok;
					} elseif( $resultArray && $tok == ',' && $bracketcount==0 && $sqbracketcount==0){
						 $ts[]=$t;
						 $t='';
					} else {
							$t.=$tok;
					}
			}
		}

		if($resultArray){
			if($t !='')
				$ts[] = $t;
			return $ts;
		} else {
				return $t;
		}
	}
}

?>
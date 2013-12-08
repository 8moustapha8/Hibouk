<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Outils de débugage
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_debug {

	/**
	 * Variables poussés
	 *
	 * @var string
	 */
	private $_out = '';

	/**
	 * Entête du fichier de bugs HTML
	 *
	 * @var string
	 */
	private $_begin = '<html>
<head>
<title>Debug</title>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<script type="text/javascript" >

function onload(){
	var x = document.getElementById("phperror").contentWindow.document.body.innerHTML;
	if(x=="")
		document.body.removeChild(document.getElementById("cadre_phperror"));
}

function actionDebug(action){
    var xhr;

    if (window.XMLHttpRequest)// Mozilla, Safari, ...
    	xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) // IE
    	xhr = new ActiveXObject("Microsoft.XMLHTTP");
    else
    	xhr = false;

    xhr.onreadystatechange  = function(){
			 if(xhr.readyState  == 4){
					if(xhr.status  == 200)
						 reloadPage();
					else
						 alert(xhr.status);
			 }
    };
   xhr.open( "GET", "index.php?act="+action,  true);
   xhr.send(null);
}

function reloadPage(){
	parent.document.location.reload();
}

function fullScreen(){
 var body = document.body.scrollHeight;
 var iframe = parent.document.getElementById("debugi").style.height;
 if(iframe=="150px")
 	parent.document.getElementById("debugi").style.height = body+"px";
 else
 	parent.document.getElementById("debugi").style.height = "150px";
}

function showHide(me){
	var x = me.nextSibling;
	var d = x.style.display;
	if(d == "none"){
		x.style.display = "block";
		me.innerHTML = "-";
	} else {
		x.style.display = "none";
		me.innerHTML = "+";
	}
}

function showHidePHP(me){
	var x = document.getElementById("phpdebug");
	var d = x.style.display;
	if(d == "none"){
		x.style.display = "block";
		me.innerHTML = "-";
	} else {
		x.style.display = "none";
		me.innerHTML = "+";
	}
}

function refresh(){
	document.location.reload();
}

</script>
<style type="text/css">

body {
	background: white;
}

.error_php {
	border:1px solid red;
}

.cadre{

}

.v{
	margin: 0px 0px 10px 0px; display: block;

	color: black;
	font-family: Verdana;
	border: 1px solid #cccccc;
	padding: 5px;
	font-size: 12px;
	line-height: 13px;
}

.reduct {
	font-size: 20px;
	color:green;
	cursor:pointer;
	font-weight:bold;
}


.varName {
	height:20px;
	color:#40006F;
}

.varName1 {
	color:#8F0824;
}

.typeVar {
	color:#a2a2a2;
}

.String {
	color:black;
}

.Integer {
	color:red;
}

.Double {
	color:#0099c5;
}

.Boolean {
	color:#92008d;
}

.NULL {
	color:#003F00;
}

iframe {
	width:100%;
	border:0;
}
</style>
</head>
<body>
<div><input type="button" onclick="reloadPage()" value="⟳"/>
<input type="button" onclick="refresh()" value="⟳ Debug"/>
<input type="button" onclick="actionDebug(\'emptyGallinaCache\')" value="✘ Gallina Cache"/>
<input type="button" onclick="actionDebug(\'sessionDestroy\')" value="✘ Destroy session"/>
<input type="button" onclick="fullScreen()" value="⇲"/>
</div>
';
	/**
	 * Enregistre une variable
	 *
	 * @param	string $vname Nom de la variable
	 * @param	mixed $var La variable enregistrée
	 * @param	string $info Info/commentaire
	 */
	public function dump($vname,$var, $info = FALSE){
		$this->_out .= "<div class='v'><span class='reduct' onclick='showHide(this)'>-</span><pre class='cadre'><br/>";
		if($info != FALSE) $this->_out .= "<b style='color: red;'>$info:</b><br/>";
		$this->_do_dump($var, '$'.$vname);
		$this->_out .= "</pre></div>";
	}

	/**
	 * Mise en forme de la variable
	 *
	 * @param	mixed $var La variable mise en forme
	 * @param	string $var_name Nom de la variable
	 * @param	string $indent Indentation
	 * @param	string $reference Référence
	 */
	private function _do_dump(&$var, $var_name = NULL, $indent = NULL, $reference = NULL){
		$do_dump_indent = "&nbsp;&nbsp; ";
		$reference = $reference.$var_name;
		$keyvar = 'the_do_dump_recursion_protection_scheme'; $keyname = 'referenced_object_name';

		if (is_array($var) && isset($var[$keyvar])){
				$real_var = &$var[$keyvar];
				$real_name = &$var[$keyname];
				$type = ucfirst(gettype($real_var));
				$this->_out .= "$indent$var_name <span class='typeVar'>$type</span> = <span style='color:#e87800;'>&amp;$real_name</span><br/>";
		} else {
			$var = array($keyvar => $var, $keyname => $reference);
			$avar = &$var[$keyvar];

			$type = ucfirst(gettype($avar));
			if($type == "String") $type_color = "<span class='String'>";
			elseif($type == "Integer") $type_color = "<span class='Integer'>";
			elseif($type == "Double"){ $type_color = "<span class='Double'>"; $type = "Float"; }
			elseif($type == "Boolean") $type_color = "<span class='Boolean'>";
			elseif($type == "NULL") $type_color = "<span class='NULL'>";

			if (is_array($avar)) {
					$count = count($avar);
					$this->_out .= "$indent" . ($var_name ? "<span class='varName'>$var_name</span> => ":"") . "<span class='typeVar'>$type ($count)</span><br/>$indent(<br/>";
					$keys = array_keys($avar);
					foreach($keys as $name)
					{
							$value = &$avar[$name];
							$this->_do_dump($value, "['$name']", $indent.$do_dump_indent, $reference);
					}
					$this->_out .= "$indent) <br/><br/>";
			} elseif(is_object($avar)) {
					$this->_out .= "$indent<span class='varName'>$var_name</span> <span class='typeVar'>$type</span><br/>$indent(<br/>";
					foreach($avar as $name=>$value) $this->_do_dump($value, "$name", $indent.$do_dump_indent, $reference);
					$this->_out .= "$indent)<br/>";
			}
			elseif(is_int($avar)) $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> $type_color$avar</span><br/>";
			elseif(is_string($avar)) $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> $type_color<pre style='margin-left:70px;'>".htmlspecialchars($avar, ENT_QUOTES, 'UTF-8', false)."</pre></span>";
			elseif(is_float($avar)) $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> $type_color$avar</span><br/>";
			elseif(is_bool($avar)) $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> $type_color".($avar == 1 ? "TRUE":"FALSE")."</span><br/>";
			elseif(is_null($avar)) $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> {$type_color}NULL</span><br/>";
			else $this->_out .= "$indent<span class='varName1'>$var_name</span> = <span class='typeVar'>$type(".strlen($avar).")</span> $avar<br/>";
			$var = $var[$keyvar];

		}
	}
	/**
	 * Enregistrement du fichier HTML
	 *
	 */
  public function display(){
  	$i = '<div id="cadre_phperror" class="v"><span class="reduct" onclick="showHidePHP(this)">-</span>
  	<div id="phpdebug" class="cadre"><iframe id="phperror" src="'.GALLINA_FILENAME_DEBUGPHP.'"></iframe></div></div>';
  	file_put_contents(GALLINA_FILE_DEBUG,$this->_begin.$i.$this->_out.'</body></html>');
  }

  /**
	 * Desctructeur ; Le fichier HTML est enregistré quand la class est détruite
	 *
	 */
  public function __destruct(){
  	$this->display();
  }
}
?>
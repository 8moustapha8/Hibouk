<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Réponse HTML
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
Class response_HTML extends g_response {
	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'HTML';

	/**
	 * Tableau des variables pour la sortie
	 *
	 * @var array
	 */
	public $_out = array('javascript'=>'','css'=>'');

	/**
	 * Contenu pour la sortie
	 *
	 * @var string
	 */
	public $content = '';

	/**
	 * Titre
	 *
	 * @var string
	 */
	private $_title = '';

	/**
	 * Pas de javascript et de css dans l'entête
	 *
	 * @var string
	 */
	public $noJSandCSS = false;

	/**
	 * les scripts js
	 *
	 * @var array
	 */
	private $_js = array();

	/**
	 * les scripts css
	 *
	 * @var array
	 */
	private $_css = array();

	/**
	 * Path js
	 *
	 * @var array
	 */
	private $_pathJS = array();

	/**
	 * Titre
	 *
	 * @param string $title Titre de la page
	 */
	public function title($title){
		$this->_title = $title;
	}

	/**
	 *
	 * Finalisation des entrées javascript
	 *
	 * @return string
	 */
	private function _creatJS(){

		// tableau sans doublons
		$this->_js = array_unique($this->_js);

		// variable qui va contenir le code js dans la balise <script>
		$jsScript = '';

		foreach($this->_js as $key => $value){
			if(filter_var($key, FILTER_VALIDATE_INT) || $key=='0' )
				$jsScript .= $value;
			else
				$this->_out['javascript'] .= $value;// fichier js
		}

		if($jsScript != '')
		$this->_out['javascript'] = '<script type="text/javascript"><!--//--><![CDATA[//><!--'.PHP_EOL.$jsScript.PHP_EOL.'//--><!]]></script>'.$this->_out['javascript'];

		return $this->_out['javascript'];
	}

	/**
	 *
	 * Finalisation des entrées css
	 *
	 * @return string
	 */
	private function _creatCSS(){

		// tableau sans doublons
		$this->_css = array_unique($this->_css);

		// variable qui va contenir le code css dans la balise <style>
		$jsCSS = '';

		foreach($this->_css as $key => $value){
			if(filter_var($key, FILTER_VALIDATE_INT) || $key=='0' )
				$jsCSS .= $value;
			else
				$this->_out['css'] .= $value;// fichier css
		}
		if($jsCSS != '')
			$this->_out['css'] .= PHP_EOL.'<style type="text/css">'.$jsCSS.PHP_EOL.'</style>'.PHP_EOL;

		return $this->_out['css'];
	}


	/**
	 *
	 * Ajoute une entrée css
	 *
	 * @param mixed $value Nom du fichier ou code css
	 * @param boolean $file false code css true fichier
	 * @param string $link adresse spécifique
	 * @param string $media média de sortie
	 */
	public function addCSS($value,$file=true,$media='screen'){
		if(!$file){
			$this->_css[] = PHP_EOL.$value;
		} else {
			if(is_array($value)){
				foreach($value as $v)
					$this->_css[$v] = '<link rel="stylesheet" type="text/css" href="'.adr::getRurl($v).'" media="'.$media.'"/>'.PHP_EOL;
			} else {
				$this->_css[$value] = '<link rel="stylesheet" type="text/css" href="'.adr::getRurl($value).'" media="'.$media.'"/>'.PHP_EOL;
			}
		}
	}

	/**
	 *
	 * Ajoute une entrée javascript
	 *
	 * @param mixed $value Nom du fichier ou code javascript
	 */
	public function addJS($value,$file=true){
		if(!$file) {
			$this->_js[] = PHP_EOL.$value;
		} else {
			if(is_array($value)){
				foreach($value as $v)
					$this->_js[$v] = '<script type="text/javascript src="'.adr::getRurl($v).'"></script>'.PHP_EOL;
			} else {
				$this->_js[$value] = '<script type="text/javascript" src="'.adr::getRurl($value).'"></script>'.PHP_EOL;
			}
		}
	}

	/**
	 *
	 * Doctype de la sortie
	 *
	 * @return string
	 */
	private function _doctype (){
		$doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "xhtml1-strict.dtd">'.PHP_EOL
			.'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="'.GALLINA_CONFIG_LANG.'" lang="'.GALLINA_CONFIG_LANG.'">'.PHP_EOL
			.'<head id="head">'.PHP_EOL
			.'<link rel="icon" type="image/png" href="'.adr::getRurl('g_favicon~imgPNG').'"/>'.PHP_EOL
			.'<link rel="shortcut icon" type="image/x-icon" href="'.adr::getRurl('g_favicon~imgICO').'"/>'.PHP_EOL
			.'<meta http-equiv="Cache-Control" content="no-cache">'.PHP_EOL
			.'<meta http-equiv="Pragma" content="no-cache">'.PHP_EOL
			.'<meta http-equiv="Expires" content="0">'.PHP_EOL
			.'<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>'.PHP_EOL;
		return $doctype;
	}

	/**
	 *
	 * Titre de la page
	 *
	 * @return string
	 */
	private function _title (){
		$title = '';
		if($this->_title!='')
			$title = '<title>'.$this->_title.'</title>'.PHP_EOL;
		return $title;
	}

	/**
	 *
	 * Panneau pour le debuggage
	 *
	 * @return string
	 */
	private function _debug (){
		$debug = '<iframe id="debugi" style="width:100%;border:0;overflow-x: hidden;height:150px;display:none;" src="'.adr::getRurl(GALLINA_FILENAME_DEBUG.'~log').'"></iframe>'.PHP_EOL
		.'<input type="button" value="⬍" onclick="var _debugui=document.getElementById(\'debugi\');if(_debugui.style.display==\'none\')_debugui.style.display=\'block\'; else _debugui.style.display =\'none\';" style="background:transparent;color:gray;border:0;padding:0;height:15px;width:15px;position:absolute;top:0px;z-index:10000000;left:0px;"/>'.PHP_EOL;
		return $debug;
	}

	/**
	 *
	 * Création de l'entête http
	 *
	 */
	private function _sendHeadersHTML(){
		$this->_headers['Content-Type'] = 'text/html;charset=UTF-8';
		$this->_headers['Vary'] = 'Accept';
		$this->sendHeaders();
	}

	/**
	 * Sortie
	 *
	 * @return boolean
	 */
	public function printOut(){

		// Entête http
		$this->_sendHeadersHTML();

		// doctype
		$out = $this->_doctype();

		// le titre
		$out .= $this->_title();

		if(!$this->noJSandCSS){// création css et js ?
			// Finalisation des entrées javascript
			$out .= $this->_creatJS();

			// Finalisation des entrées CSS
			$out .= $this->_creatCSS();

		}

		// fin de l'entète et début du corp
		$out .= '</head>'.PHP_EOL.'<body id="body">'.PHP_EOL;

		// iframe mode debug
		if(GALLINA_DEBUG)
			$out .= $this->_debug();

		// le contenu et on ferme body et html
		$out .= $this->content.PHP_EOL.'</body>'.PHP_EOL.'</html>'.PHP_EOL;

		// sortie
		echo $out;

		return true;
	}

	/**
	 * Sortie pour une erreur interne
	 *
	 * @param string $msg message d'erreur
	 */
	public function errorOut($msg){
		$this->_statutCode = '500';
		$this->_statutMess = 'Internal Server Error';
		$this->_headers['Content-Type'] = 'text/html;charset=UTF-8';
		$this->_headers['Cache-Control'] = 'no-cache, must-revalidate';
		$this->_headers['Pragma'] = 'no-cache';
		$this->_headers['Expires'] = 'Sat, 26 Jul 1997 05:00:00 GMT';
		$this->sendHeaders();
		echo $msg;
	}
}
?>
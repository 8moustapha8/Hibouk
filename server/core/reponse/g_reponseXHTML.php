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
Class response_XHTML extends g_response {
	/**
	 * Type de réponse
	 *
	 * @var string
	 */
	public $type = 'XHTML';

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
	 * les scripts css
	 *
	 * @var array
	 */
	private $_css = array();

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
	 * Doctype de la sortie
	 *
	 * @return string
	 */
	private function _doctype (){
		$doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "xhtml1-strict.dtd">'.PHP_EOL
							.'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="'.GALLINA_CONFIG_LANG.'" lang="'.GALLINA_CONFIG_LANG.'">'.PHP_EOL
							.'<head>'.PHP_EOL
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

		// Finalisation des entrées CSS
		$out .= $this->_creatCSS();

		// fin de l'entète et début du corp
		$out .= '</head>'.PHP_EOL.'<body id="body">'.PHP_EOL;

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
		$this->sendHeaders();
		echo $msg;
	}
}
?>
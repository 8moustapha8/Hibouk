<?php
/**
 * @package  JSElem Builder
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see COPYING.LESSER file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Simply documentation genarator
 */
class cpb_doc {
	public function parseFile($file) {
		$lines = file($file);

		$m = 'start';
		$components = array();
		$componentsM = array();
		$commentsM = array();
		$namespaces = array();
		$comments = array();
		$comSave = false;
		$comName = false;
		$comTxt = '';
		$nameFNC = '';
		$noComment = false;
		$th = array('methods', 'events', 'attributes', 'properties');

		foreach ($lines as $lineNumber => $lineContent) {

			$lineContent = ltrim($lineContent);
			$dontSave = false;

			foreach ($th as $_m) {
				if (preg_match('#^'.$_m.'\s?\:#', $lineContent)) {
					$m = $_m;
					$dontSave = true;
				}
			}

			if(preg_match('#^\/\*\*#s', $lineContent)) {// comment start
				$comSave = true;
				if(preg_match('#@(\S+)#s', $lineContent, $matchFNC)){
					if(strtolower($matchFNC[1])=='nocomment')
						$noComment = true;
					else
						$nameFNC = $matchFNC[1];
				}

			} else if(preg_match('#^\*\/#s', $lineContent)) {// comment end
				$comSave = false;
				$comName = true;
			} else if($comSave) {
				$comTxt .= $lineContent;
			} else if(!$dontSave) {
				if($nameFNC!='') {
					// pour les "actions" non listées exemple en début de commentaire
					// /** @change
					$comments[$m][$nameFNC] = $this->_commentParse($comTxt);
					$comName = false;
					$comTxt = '';
					$nameFNC = '';
				} else if ( (preg_match('#^([\w|_|\d]+)\s?\:\s?function\s?\(#', $lineContent,$comName_matches) && ($m=='methods' || $m=='events') ) || ( preg_match('#^([\w|_|\d]+)\s?\:\s?\{#', $lineContent,$comName_matches) && ($m=='attributes' || $m=='properties') ) ) {
						if(!$noComment)
							$comments[$m][$comName_matches[1]] = $this->_commentParse($comTxt);
						$comName = false;
						$comTxt = '';
						$noComment = false;
				} else if($comName) {
					$comments[$m][] = $this->_commentParse($comTxt);
					$comName = false;
					$comTxt = '';
				}
			} else if($dontSave && $comTxt!='') {
				$commentsM[$m] = $this->_commentParse($comTxt);
				$comName = false;
				$comTxt = '';
			}

			if( preg_match('#^JSElem\.register\(#s', $lineContent) || preg_match('#^JSElem\.extend\(#s', $lineContent) ){
				// extract component name
				preg_match('#\((.*?)\)#', $lineContent,$componentName_matches);

				$componentName = explode(',', $componentName_matches[1]);
				if(count($componentName)==3) {
					$namesapce = trim($componentName[0], ' \'"');
					$componentName = trim($componentName[1], ' \'"');
				} else {
					$namesapce = trim($componentName[2], ' \'"');
					$componentName = trim($componentName[3], ' \'"');
				}
				$namespaces[$componentName] = $namesapce;
				$components[$componentName] = $comments;
				$componentsM[$componentName] = $commentsM;
				$comments = array();
				$commentsM = array();
				$m = 'start';
			}
		}
		return $this->_renderHTML($components,$componentsM,$namespaces);
	}

	private function _renderHTML($components,$componentsM,$namespaces) {
		$html = $this->_getHtmlHeader();
		$p = 0;
		$lifecycle = array('domCreate', 'domInsert');
		foreach ($components as $key => $value) {
			if($p>0)
				$html .= '<hr style="border:0;border-top:1px solid #81009B;margin:20px 0;"/>';
			$p++;
			$html .= PHP_EOL.'<div><h1>'.$key.' <span class="namespace">'.$namespaces[$key].'</span></h1>'.PHP_EOL;

			foreach ($componentsM[$key] as $_kM => $_vM)
				if (!array_key_exists($_kM, $components[$key]))
					$components[$key][$_kM] = array(1000=>'');

			foreach ($components[$key] as $k => $v) {
				if($k!='start')
					$html .= '<div><h2>'.$k.'</h2>'.PHP_EOL;

				foreach ($components[$key][$k] as $_k => $_v) {
					$html .= '<div>';

					if($componentsM[$key] && $componentsM[$key][$k])
						$html .= '<div class="mcomment">'.$componentsM[$key][$k].'</div>'.PHP_EOL;

					if(!is_numeric($_k)) {
						$lifecycleHTML = '';
						if(in_array($_k, $lifecycle))
							$lifecycleHTML = ' <span class="lifecycle">lifecycle method</span>';
						$html .= '<h3>'.$_k.$lifecycleHTML.'</h3>'.PHP_EOL;
					}
					$html .= $_v.'</div>'.PHP_EOL;
				}
				if($k!='start')
					$html .= '</div>'.PHP_EOL;
			}
			$html .= '</div>'.PHP_EOL;
		}
		return $html.'</body></html>';
	}

	private function _commentParse($string) {
		// paragraphs and params
		$string = preg_replace('/^\*\h?/m','',$string);
		preg_match_all('/@([a-z]+)\s+(.*?)\s*(?=$|@[a-z]+\s)/s', $string, $params);
		$string = preg_replace_callback('/@([a-z]+)\s+(.*?)\s*(?=$|@[a-z]+\s)/s',create_function('$ma','return "";'),$string);
	    return $this->_formatPara($string).$this->_formatParams($params);
	}

	private function _formatPara($string) {
		$cr = new creole();
        return $cr->parse($string);
	}

	private function _formatParams($params) {
		$html = '';
		foreach ($params[1] as $key => $value) {
			$html .= '<p class="params"><span class="type">'.$value.'</span><span class="typestring">'.$params[2][$key].'</span></p>'.PHP_EOL;
		}
		return $html;
	}

	private function _getHtmlHeader() {
		return '<html>
	<head>
		<title></title>
		<style type="text/css">
			body {font-size:12px;}
		 	div {margin-left:15px;}
			p {margin:3px;}
			.params .type {font-weight:bold;color:#FF6A00;}
			.params .typestring {margin-left:10px;}
			h3 {margin-top:10px;margin-bottom:0;color:#075108;}
			div div div p {margin-left:15px;}
			.mcomment {margin-left:0;margin-bottom:15px;margin-top:-8px;}
			.mcomment p {margin-left:0;}
			h2 {border-top:1px solid silver;}
			.namespace {float:right;padding-right:15px;font-size:0.5em;color:gray;font-weight:normal;}
			.lifecycle {padding-left:15px;font-size:0.9em;color:gray;font-weight:normal;}

			/* highlight */
			pre.code {border-left:1px solid gray;padding-left:10px;color: #000;}
			.Root{color: #000;}
			.Shebang{color: #4e9a06;font-style: italic;}
			.BlockComment{color: #0066ff;font-style: italic;}
			.Comment {color: #0066ff;font-style: italic;}
			.Logic {color: #ad7fa8;}
			.className {color: #ff6a6a;}
			.funcName {color: #ff8000;}
			.Keywords {color: #4e9a06;}
			.Keywords2 {color: #9700cc;}
			.Keywords3 {color: #CF19CB;}
			.Keywords4 {color: #473E8F;}
			.Keywords5 {color: #DF8A45;}
			.Special{color: #AFA400;}
			.Types {color: #00FF40;font-style: italic;}
			.Entities {background-color: #3F342B;color: #3FCDFF;}
			.Entities1 {color: #000;}
			.Entities2 {color: #CF3E0C;}
			.Entities3 {color: #8FCDFF;}
			.Pars {	color: #D332C8;}
			.Operators{color: #ef2929;}
			pre .StringEsc {color: #3A3A3A;background-color: #C4C4C4;}
			.String, .SingleString {color: #729fcf;}
			.DoubleString {color: #729fcf;}
			.Number {color: #0066cd;}
			.Integer {color: #49A5FF;}
			.Tag {color: #49A5FF;}
			.Name {color: #49A5FF;}
			.Regex {color: #29AFDF;background-color: #2F1D1D;}
			.Dico {color: #61FF2F;background-color: #183F0C;}
			.Url, .Url .a  {color: #ef2929;text-decoration: underline;font-style: italic;}
		</style>
	</head>
	<body>';
	}
}
?>
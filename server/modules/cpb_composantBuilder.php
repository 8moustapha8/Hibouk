<?php

/**
 * @package  composantBuilder
 * @subpackage composantBuilder (cpb_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module composantBuilder
 *
 * @package  composantBuilder
 * @subpackage composantBuilder (cpb_)
 */
class cpb_composantBuilder extends g_module {

	public $auth = array('action'=>'connexion','session'=>'CONNEXION_PACKAGES');

	// Connexion
	protected function connexion() {
		// redirection vers le module package
		return $this->Mdirection('packages','connexion');
	}

	private function _getFile ($file) {
		return GALLINA_ROOT.'components'.DS.$file;
	}
	private function _getData ($name) {
		return stripslashes($this->MgetBrutParam($name),true);
	}

	protected function getComponents () {
		$rep = $this->MgetResponse('JSON');
		$cpDir = $this->_getFile('');
		foreach (glob($cpDir."*",GLOB_ONLYDIR) as $dir)
			$components[] = substr($dir, strlen($cpDir));

		$rep->content = $components;
		return $rep;
	}

	protected function save () {
		$rep = $this->MgetResponse('JSON');
		$cpName = $this->MgetParam('name','','string');
		$cpPrefix = $this->MgetParam('prefix','','string');
		if($cpName!='' || $cpPrefix!=''){
			$cpDir = $this->_getFile($cpName.DS);
			$name = $cpPrefix.'_'.$cpName;
			$files = array('js','css','jstest','htmltest');
			foreach ($files as $value)
				file_put_contents($cpDir.$name.'.'.$value, $this->_getData($value));

			// documentation
			try {
				$cpb_doc = new cpb_doc();
				$doc = $cpb_doc->parseFile($cpDir.$name.'.js');
				$dirDoc = $cpDir.'doc';
				if(!file_exists($dirDoc))
					mkdir($dirDoc, 0777,true);
				file_put_contents($dirDoc.DS.$name.'.html',$doc);
				$rep->content = ajax::ok();
			} catch (Exception $e) {
				$rep->content = ajax::error(array('content'=>$e->getMessage()),'Err-cpb-3');

			}
		} else {
			$rep->content = ajax::error(array('content'=>'cpb-error'),'Err-cpb-2');
		}
		return $rep;
	}

	protected function run () {
		$rep = $this->MgetResponse('JSON');

		$htmltest = $this->_getData('htmltest');
		$jstest = $this->_getData('jstest');
		$js = $this->_getData('js');
		$css = $this->_getData('css');

		$dependScript = '';
		// creat test page
		$page = '<!DOCTYPE html>
		<html lang="fr">
		<head>
			<meta charset="UTF-8"/>
			<script type="text/javascript" src="../../js/lib/g_req.js" charset="utf-8"></script>
			<script type="text/javascript" src="../../js/lib/g_JSElem.js" charset="utf-8"></script>
			'.$dependScript.'
			<title></title>
			<style type="text/css">
			'.$css.'
			</style>
			<script>
				var $params = {
					debugMode : true,

					UIType : \'html\'
				};
				document.addEventListener("DOMContentLoaded", function() {
					'.$js.'
					JSElem.DOMContentLoaded();
					'.$jstest.'
				});
		</script>
		</head>
		<body>
		'.$htmltest.'
		</body>
		</html>';
		file_put_contents(GALLINA_DIR_CACHE.'pagetest.html', $page);


		$rep->content = ajax::ok();
		return $rep;
	}

	protected function load () {
		$rep = $this->MgetResponse('JSON');

		$cpName = $this->MgetParam('name','','string');
		if($cpName!=''){
			$cpDir = $this->_getFile($cpName.DS);
			$_r = array();
			foreach (glob($cpDir."*") as $file){
				$ex = pathinfo($file,PATHINFO_EXTENSION);
				if(in_array($ex, array('js','css','jstest','htmltest'))) {
					$_r[$ex] = substr($file, strlen($cpDir));
					if($ex=='js'){
						$prefix = explode('_', pathinfo($file,PATHINFO_BASENAME));
						$_r['prefix'] = $prefix[0];
					}
				}
			}
			if(!isset($_r['jstest'])) {
				$file = $cpDir.$_r['prefix'].'_'.$cpName.'.jstest';
				file_put_contents($file, '');
				$_r['jstest'] = substr($file, strlen($cpDir));
			}
			if(!isset($_r['htmltest'])) {
				$file = $cpDir.$_r['prefix'].'_'.$cpName.'.htmltest';
				file_put_contents($file, '');
				$_r['htmltest'] = substr($file, strlen($cpDir));
			}
			$rep->content = $_r;
		} else {
			$rep->content = ajax::error(array('content'=>'cpb-error'),'Err-cpb-1');
		}
		return $rep;
	}

}
?>
<?php

/**
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module de création de bundle
 *
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 */
class bdlcreat_module extends g_module {

	public $auth = array('action'=>'connexion','session'=>'CONNEXION_PACKAGES');

	// Connexion
	protected function connexion() {
		// redirection vers le module package
		return $this->Mdirection('packages','connexion');
	}

	protected function creat(){

		// chargement de la réponse html
		$rep = $this->MgetResponse('json');

		$data = array();
		$data['bundleName'] = $this->MgetParam('bundleName','','stringIS'); // --NAMEBDL--
		$data['bdlName'] = $this->_clearSTR($data['bundleName']);// --NBDL--
		$data['nameSpace'] = $this->MgetParam('nameSpace','','alnum');// --NSP--

		$data['typeBundle'] = $this->MgetParam('typeBundle','extend','alnum');// --TYPE-- //extend, appli
		$data['author'] = $this->MgetBrutParam('author');// --AUTHOR--
		$data['licence'] = $this->MgetBrutParam('licence');// --LICENCE--

		if($data['bundleName']!='' && $data['nameSpace']!='') {
			$filesAndTPL = array(
				array(
					"name" => "js/bundlelist/--NSP--_bundlesList.js",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_bundlesList.tpl"
				),
				array(
					"name" => "server/lib/bundles/--NBDL--/--NSP--_install.php",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_install.tpl"
				),
				array(
					"name" => "server/modules/--NSP--_--NBDL--.php",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_module.tpl"
				),
				array(
					"name" => "bundles/--NBDL--/--NSP--_--NBDL--.js",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_js.tpl"
				),
				array(
					"name" => "bundles/--NBDL--/--NSP--_--NBDL--_bdl.js",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_bdl_js.tpl"
				),
				array(
					"name" => "bundles/--NBDL--/--NSP--_--NBDL--.tpl",
					"tpl" => GALLINA_DIR_TPL."bdlcreat_tpl.tpl"
				),
				array(
					"name" => "bundles/--NBDL--/--NSP--_--NBDL--.css",
					"tpl" => "NOTPL"
				),
				array(
					"name" => "bundles/--NBDL--/locale/en-EN/--NSP--_--NBDL--.json",
					"tpl" => "JSON"
				),
				array(
					"name" => "bundles/--NBDL--/locale/fr-FR/--NSP--_--NBDL--.json",
					"tpl" => "JSON"
				)
			);
			$content = '';
			foreach ($filesAndTPL as $value) {
				switch ($value['tpl']) {
					case 'NOTPL':
						// .
					break;
					case 'JSON':
						$content = "{\n\t\"xxxx\" : \"xxxx\"\n}";
					break;
					default:
						$content = file_get_contents($value['tpl']);
					break;
				}
				$fileSave = $this->_replace($data,$value['name']);
				$this->_dirs($fileSave);
				file_put_contents($fileSave, $this->_replace($data,$content));
			}
			$rep->content = ajax::ok();
		} else {
			$rep->content = ajax::error(array('content'=>'ap-bundleName'),'Err-bdlcreat-1');
		}
		return $rep;
	}

	private function _dirs($file) {
		$_dirFiles = explode('/', $file);
		array_pop($_dirFiles);
		$dir = rtrim(GALLINA_ROOT, DS);
		foreach ($_dirFiles as $value) {
			$dir .= DS.$value;
			if(!is_dir($dir))
				mkdir($dir);
		}
	}

	private function _replace($data,$subject){
		$subject = preg_replace(
				array('#\-\-NAMEBDL\-\-#s',
					'#\-\-NBDL\-\-#s',
					'#\-\-NSP\-\-#s',
					'#\-\-TYPE\-\-#s',
					'#\-\-AUTHOR\-\-#s',
					'#\-\-LICENCE\-\-#s'
				),
				array($data['bundleName'],
					$data['bdlName'],
					$data['nameSpace'],
					$data['typeBundle'],
					$data['author'],
					$data['licence']
				),
				$subject);
		return $subject;
	}

	private function _clearSTR ($str) {
		$str = trim($str);
		$str = utf8_decode($str);
		$str = strtr($str, utf8_decode("àáäâèéëêìíïîòóöôùúüûñç.,:;'"), "aaaaeeeeiiiioooouuuunc-----");
		$str = utf8_encode($str);
		$str = preg_replace(array('#[^a-zA-Z0-9 /_]#s','#\s+#s','#"#s'), array('','',''), $str);
		return $str;
	}
}
?>
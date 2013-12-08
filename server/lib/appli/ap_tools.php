<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 *
 */

/**
 * Tools for Hibouk
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_tools {


	private static function _locked($dir){
		$file = $dir.DS.'__lock.php';
		if(file_exists($file)) {
			include($file);
			if($lock['ID']!=session::getID()) {
				if(($lock['timestamp']+GALLINA_SESSION_TIMEOUT)>time())
					return false;
			}
		}
		file_put_contents($file, "<?php\n\$lock=array('ID'=>'".session::getID()."','timestamp'=>".time().");\n?>");
		return true;
	}

	public static function unlock($dir){
		unlink($dir.'__lock.php');
	}

	/**
	 * Tableau d'un editeur
	 *
	 * @param stringID $stringID identifiant sous forme de chaine
	 * @return array
	 */
	public static function getEditorProperties($stringID,$widthOPF=false) {
		$editor = self::getEditorName();

		$pos = strrpos($stringID, "_");
		$id = substr($stringID,$pos+1);
		//$editor = substr($str,0,$pos);

		if($editor==null || $stringID=='' || $id=='') {
			return null;
		} else {
			$dirTmp = $stringID.'_tmp';
			$path = adr::getAdrDir('epubs',null,array($editor,$stringID),true);
			$pathtmp = adr::getAdrDir('epubs',null,array($editor,$dirTmp),true);
			$_return = array(
				'locked' => self::_locked($pathtmp),
				'stringID' => $stringID,
				'path' => $path.DS,
				'pathTmp' => $pathtmp.DS,
				'pathNODS' => $path,
				'pathTmpNODS' => $pathtmp,
				'dirName' => $stringID,
				'dirNameTmp' => $dirTmp,
				'editor' => $editor,
				'id'=> $id
			);

			if($widthOPF) {
				$opf = session::read($stringID);
				if(session::exist($stringID) && substr($opf['opf_dirname'], 0,5)=='epubs') {
					$_return['opf_dirname'] = $opf['opf_dirname'];
					$_return['opf_basename'] = $opf['opf_basename'];
					$_return['opf_full_dirname'] = $opf['opf_full_dirname'];
				} else {
					$_return = null;
				}
			}
			return $_return;
		}
	}

	public static function msgNoSessionOrLocked ($editor,$errorNum) {
		if($editor===null)
			return ajax::error(array('content'=>'Session has expired, reload Hibouk'),$errorNum);
		else
			return array('ajaxMsg' => 'newcall', 'name' => 'locked');
	}

	public static function getEditorName() {
		$APPLI_EDITOR = session::read('APPLI_EDITOR');
		if(session::exist('APPLI_EDITOR') && $APPLI_EDITOR!='')
			return $APPLI_EDITOR;
		else
			return null;
	}

	public static function opfFile($path) {
		$r = array('error'=>true);
		$containerFile = $path.'META-INF'.DS.'container.xml';
		if (file_exists($containerFile)) {
			$r['error'] = false;
			$containerXML = simplexml_load_file($containerFile);
			$r['relativePath'] = $containerXML->rootfiles->rootfile['full-path'].'';
			$r['path'] = $path.$r['relativePath'];
		}
		return $r;
	}

	public static function getFileName($module) {
		return self::clearSTR($module->MgetParam('file','f_'.time(),'filex')).'.xhtml';
	}

	public static function clearSTR ($str) {
		$str = trim($str);
		$str = utf8_decode($str);
		$str = strtr($str, utf8_decode("àáäâèéëêìíïîòóöôùúüûñç.,:;'"), "aaaaeeeeiiiioooouuuunc-----");
		$str = utf8_encode($str);
		$str = preg_replace(array('#[^a-zA-Z0-9 -/_]#s','#\s+#s','#"#s'), array('','-',''), $str);
		return $str;
	}

	public static function dirsValid($name,$dirOPF) {
		$_dirFiles = explode('/', $name);
		array_pop($_dirFiles);
		$dirOPF = rtrim($dirOPF, DS);
		foreach ($_dirFiles as $value) {
			$dirOPF .= DS.$value;
			if(!is_dir($dirOPF))
				mkdir($dirOPF);
		}
	}

	public static function creatHtmlDoc($templateName,$title,$filesCSS,$bodyContent) {
		$_css = '';
		foreach ($filesCSS as $value)
			$_css .= '<link href="'.$value.'" rel="stylesheet" type="text/css"></link>'.PHP_EOL;

		return g_tpl::get($templateName,array(
				'title' => $title,
				'css' => $_css,
				'body' => $bodyContent,
			)
		);
	}
}
?>

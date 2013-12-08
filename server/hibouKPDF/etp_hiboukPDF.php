<?php
/**
 * @package  epubtopdf
 * @subpackage application (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Tansformation d'epub en PDF
 *
 *
 * @package  epubtopdf
 * @subpackage application (etp_)
 */
class etp_hiboukPDF {

	private $_hiboukPDFDir = '';

	private $_filesModel = array(
		'css' => 'etp_model.css',
		'config' => 'etp_config.json'
	);

	private $_files = array(
		'cssHibouk' => 'css/etp_hibouKPDF.css',
		'cssModel' => 'models/XXXX/etp_model.css',
		'jsHyphen' => 'js/hyphenator/Hyphenator.js',
		'jsHibouk' => 'js/etp_hibouKPDF.js',
		'config' => 'models/XXXX/etp_config.json',
		'tplURL' => 'tpl/etp_hibouKPDF.html',
		'init' => 'js/etp_init.js'
	);

	private $_title = '';

	private $_size = array();

	private $_model = '';

	private $_zoneClass = 'ZONE_HK';

	private $_zones = array();

	private $_workDir = '';

	private $_fileHTML = '__hiboukPDF.html';

	private $_exec = 'etp_hiboukPDF';

	public function loadModel($workDirectory,$modelName='default'){

		$this->_model = $modelName;
		$this->_workDir = $workDirectory;
		$this->_defineDirectory();
		// test la validité du fichier de config
		$json = json_decode(file_get_contents($this->_hiboukPDFDir.DS.str_replace('XXXX', $modelName, $this->_files['config'])));

		if(json_last_error() === JSON_ERROR_NONE) {
			$this->_exec = $this->_hiboukPDFDir.DS.'sources'.DS.'hiboukPDF';

			$relativeFile = $this->_getRelativePath($this->_hiboukPDFDir,$this->_workDir);
			foreach ($this->_files as $key => $value)
				$this->_files[$key] = $relativeFile.str_replace('XXXX', $modelName, $value);
			return true;
		} else {
		    return false;
		}
	}

	public function loadExternalModel($workDirectory,$model){
		$this->_workDir = $workDirectory;
		$this->_defineDirectory();
		$this->_exec = $this->_hiboukPDFDir.DS.'sources'.DS.'hiboukPDF';
		$relativeFile = $this->_getRelativePath($this->_hiboukPDFDir,$this->_workDir);
		foreach ($this->_files as $key => $value)
				$this->_files[$key] = $relativeFile.$value;
		foreach ($model as $key => $value)
				$this->_files[$key] = $value;
	}

	private function _defineDirectory() {
		$this->_hiboukPDFDir = realpath(dirname(__FILE__));
	}

	private function _getRelativePath($path, $from) {
		$path = explode(DS, $path);
		$from = explode(DS, $from);
		$common = array_intersect_assoc($path, $from);
		$base = array('.');
		if ( $pre_fill = count( array_diff_assoc($from, $common) ) )
			$base = array_fill(0, $pre_fill, '..');

		$path = array_merge( $base, array_diff_assoc($path, $common) );
		return implode('/', $path).'/';
	}

	public function title($value){
		$this->_title = htmlentities($value,ENT_QUOTES);
	}

	public function pushZone($name,$content){
		array_push($this->_zones, array('name'=>$name,'content'=>$content));
	}

	protected function generateHead($cssFiles,$fileOut,$zoomFactor){
		$links = implode("','",$cssFiles);

		$head = <<<EOT
<meta charset="UTF-8" />
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
<style type="text/css">
body {
	zoom:$zoomFactor%;
}
</style>
<script type="text/javascript">
var booKTitle = '$this->_title';
var FILEOUT = '$fileOut';
var zoneSelector = '.$this->_zoneClass';
var urls = {
	css : ['{$this->_files['cssHibouk']}','{$this->_files['cssModel']}','{$links}'],
	config : '{$this->_files['config']}',
	tplURL : '{$this->_files['tplURL']}',
	js :['{$this->_files['jsHyphen']}','{$this->_files['jsHibouk']}']
};
</script>
<script src="{$this->_files['init']}" type="text/javascript"></script>
EOT;
		return $head;
	}

	protected function generateZones(){
		$body = '';
		foreach ($this->_zones as $zone)
			$body .= '<div class="'.$this->_zoneClass.'" title="'.$zone['name'].'">'.$zone['content']."</div>\n";
		return $body;
	}

	public function creatPDF($out,$fileOut,$cssFiles,$delFile=true){
		$html = "<!DOCTYPE html>\n"
			."<html>\n"
			."<head>\n"
			.$this->generateHead($cssFiles,$fileOut,ETP_ZOOMFACTOR)
			."</head>\n"
			."<body>\n"
			.$this->generateZones()
			."</body>\n"
			."</html>";

		$file = $this->_workDir.DS.$this->_fileHTML;
		file_put_contents($file, $html);

		//supprimer les anciens fichiers pdf
		foreach (glob($out.DS.'*.pdf') as $_oldfile)
			unlink($_oldfile);

		$fileHttp = preg_replace('#'.$_SERVER["DOCUMENT_ROOT"].'#s', ETP_HOST, $file);

		$command = sprintf('xvfb-run -a %s http://%s %s 2>&1 &', $this->_exec, $fileHttp,$out.DS);
		$output = exec($command);

		if($delFile)
			unlink($file);

		$pages = $this->_loadResult($out,'pages.json',true);
		return array(
			'errors' => $this->_loadResult($out,'errors.json',false),
			'crossRefs' => $this->_loadResult($out,'crossRefs.json',false),
			'pages' => $pages->pages,
			'pdf' => $out.DS.$fileOut.'.pdf'
		);
	}

	private function _loadResult($out,$file,$json=true){
		$result = null;
		$resultFile = $out.DS.$file;
		if(file_exists($resultFile)){
			if($json)
				$result = json_decode(file_get_contents($resultFile));
			else
				$result = file_get_contents($resultFile);
			unlink($resultFile);
		}
		return $result;
	}

	public function getModels () {
		$this->_defineDirectory();
		$pattern = $this->_hiboukPDFDir.DS.'models'.DS.'*';
		foreach (glob($pattern,GLOB_ONLYDIR) as $dir)
			$models[] = basename($dir);
		return $models;
	}

	public function saveModel ($modelName,$config,$css) {
		$this->_defineDirectory();
		$dirModel = $this->_hiboukPDFDir.DS.'models'.DS.$modelName;
		if(!file_exists($dirModel))
			mkdir($dirModel, 0777,true);
		file_put_contents($dirModel.DS.$this->_filesModel['css'], $css);
		file_put_contents($dirModel.DS.$this->_filesModel['config'], $config);
	}
};
?>
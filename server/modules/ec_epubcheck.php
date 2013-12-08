<?php

/**
 * @package EpubCheck
 * @subpackage EpubCheck (ec_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module EpubCheck
 *
 * @package EpubCheck
 * @subpackage EpubCheck (ec_)
 */
class ec_epubcheck extends g_module {

	protected function check () {
		$rep = $this->MgetResponse('JSON');
		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {
			$file = $editor['pathTmp'].$editor['dirName'].'.epub';
			$out = $this->_runExternal('java -jar '.GALLINA_DIR_SERVER.'epubcheck'.DS.'ec_epubcheck.jar '.$file,$code);
			$out = str_replace($editor['pathTmp'], '', $out);
			$out = preg_replace("#\n\n#s", "<br/><br/>\n", htmlspecialchars($out));
			$out = "<p>".preg_replace("#\n#s", "</p><p>", $out)."</p>";
			$out = preg_replace("#<p>Epubcheck#", '<p style="font-weight:bold;">Epubcheck', $out);
			$out = preg_replace("#<p>ERROR:#s", '<p><span style="color:red;">ERROR:</span>', $out);
			$out = preg_replace("#<p>WARNING:#s", '<p><span style="color:#BC008A;">WARNING:</span>', $out);
			$rep->content = $out;
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ec-1');
		}
		return $rep;
	}

	private function _runExternal($cmd,&$code) {
		$descriptorspec = array(
			 0 => array("pipe", "r"),// stdin is a pipe that the child will read from
			 1 => array("pipe", "w"),// stdout is a pipe that the child will write to
			 2 => array("pipe", "w") // stderr is a file to write to
		);

		$pipes = array();
		$process = proc_open($cmd, $descriptorspec, $pipes);

		$output = "";

		if (!is_resource($process))
			return false;

		#close child's input imidiately
		fclose($pipes[0]);

		stream_set_blocking($pipes[1],false);
		stream_set_blocking($pipes[2],false);

		$todo = array($pipes[1],$pipes[2]);

		while( true ) {
			$read = array();
			if( !feof($pipes[1]) )
				$read[] = $pipes[1];
			if( !feof($pipes[2]) )
				$read[] = $pipes[2];
			if( !$read )
				break;

			@$ready = stream_select($read, $write=NULL, $ex=NULL, 2);

			if ($ready === false)
				 break; #should never happen - something died

			foreach ($read as $r) {
				 $s = fread($r,1024);
				 $output.= $s;
			}
		}
		fclose($pipes[1]);
		fclose($pipes[2]);
		$code = proc_close($process);
		return $output;
	}
}
?>
<?php

/**
 * @package epubtopdf
 * @subpackage bundle (etp_)
 * @author David Dauvergne
 *
 */

/**
 * Module epubtopdf
 *
 * @package epubtopdf
 * @subpackage bundle (etp_)
 */
class etp_epubtopdf extends g_module {

	protected function creatPDF () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$hiboukPDF = new etp_hiboukPDF();

			$files = json_decode(stripcslashes($this->MgetBrutParam('files')));

			$cssFiles = json_decode(stripcslashes($this->MgetBrutParam('cssFiles')));

			$workDirectory = dirname($editor['opf_full_dirname'].$files[0]->href);

			$loadModel = $hiboukPDF->loadModel($workDirectory,$this->MgetParam('model','default_A4','string'));

			if($loadModel) {
				// titre du livre
				$hiboukPDF->title($this->MgetBrutParam('title'));

				// zones
				foreach ($files as $value) {
					$extension = strtolower(pathinfo($value->href,  PATHINFO_EXTENSION));
					if(in_array($extension, array('html','xhtml'))) {
						$_file = $editor['opf_full_dirname'].$value->href;
						preg_match('/<body[^>]*>(.*?)<\/body>/s', file_get_contents($_file), $matches);
						$hiboukPDF->pushZone($value->guidetype,$matches[1]);
					}
				}

				$fileOut = 'f_'.time();
				$r = $hiboukPDF->creatPDF(adr::getAdrDir('epubs',null,array($editor['editor'],$editor['dirNameTmp']),true),$fileOut,$cssFiles);
				// return errors + ink pdf
				$rep->content = array('errors'=>$r['errors'],'l'=>'epubs/'.$editor['editor'].'/'.$editor['dirNameTmp'].'/'.$fileOut.'.pdf');
			} else {
				$rep->content = ajax::error(array('content'=>'Model config invalid'),'Err-etp-4');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-etp-1');
		}
		return $rep;
	}

	protected function getModels () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');
		$hiboukPDF = new etp_hiboukPDF();
		$rep->content = $hiboukPDF->getModels();
		return $rep;
	}
}
?>
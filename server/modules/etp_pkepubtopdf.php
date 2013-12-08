<?php

/**
 * @package epubtopdf
 * @subpackage bundle (etp_)
 * @author David Dauvergne
 *
 */

/**
 * Module pkepubtopdf
 *
 * @package pkepubtopdf
 * @subpackage bundle (etp_)
 */
class etp_pkepubtopdf extends g_module {

	public $auth = array('action'=>'connexion','session'=>'CONNEXION_PACKAGES');

	// Connexion
	protected function connexion() {
		// redirection vers le module package
		return $this->Mdirection('packages','connexion');
	}

	protected function saveModel () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');
		$_modelName = $this->MgetParam('modelName','','string');
		if($_modelName!='') {
			$_contentJSON = stripslashes($this->MgetBrutParam('contentJSON'),true);
			$_contentCSS = stripslashes($this->MgetBrutParam('contentCSS'),true);
			$hiboukPDF = new etp_hiboukPDF();
			$hiboukPDF->saveModel($_modelName,$_contentJSON,$_contentCSS);
			$rep->content = ajax::ok();
		} else {
			$rep->content = ajax::error(array('content'=>'etp-error modelName'),'Err-etp-2');
		}
		return $rep;
	}

	protected function creatModelPDF () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		$hiboukPDF = new etp_hiboukPDF();

		/*
			title_page
			epigraph
			dedication
			table_of_contents
			preface
			foreword
			part
			chapter => ok
			acknowledgements
			list_of_illustrations
			list_of_tables
			notes
			index
			glossary
			bibliography
			copyright
			colophon
		*/

		$files = array(
			array(
				'href' => 'etp_chapter.xhtml',
				'guidetype' => 'chapter'
			)
		);

		$cssFiles = array('css/etp_pkepubtopdf.css');

		$directory = adr::getAdrDir('epubs',null,array('pkepubtopdf','pkepubtopdf'),false);

		$directoryTMP = adr::getAdrDir('epubs',null,array('pkepubtopdf','pkepubtopdf_tmp'),true);

		$workDirectory = $directory.DS.'OPS';

		$loadModel = $hiboukPDF->loadModel($workDirectory,$this->MgetParam('modelName','default_A4','string'));

		if($loadModel) {
			// titre du livre
			$hiboukPDF->title('Model Test');

			// zones
			foreach ($files as $value) {
				$extension = strtolower(pathinfo($value['href'],  PATHINFO_EXTENSION));
				if(in_array($extension, array('html','xhtml'))) {
					$_file = $workDirectory.DS.$value['href'];
					preg_match('/<body[^>]*>(.*?)<\/body>/s', file_get_contents($_file), $matches);
					$hiboukPDF->pushZone($value['guidetype'],$matches[1]);
				}
			}
			$fileOut = 'f_'.time();
			$r = $hiboukPDF->creatPDF($directoryTMP,$fileOut,$cssFiles,false);
			// return errors + ink pdf
			$rep->content = array('errors'=>$r['errors'],'l'=>'epubs/pkepubtopdf/pkepubtopdf_tmp/'.$fileOut.'.pdf');
		} else {
			$rep->content = ajax::error(array('content'=>'Model config invalid'),'Err-etp-3');
		}
		return $rep;
	}
}
?>
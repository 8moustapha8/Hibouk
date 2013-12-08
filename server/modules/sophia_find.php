<?php


class sophia_find extends g_module {

	protected function search () {
		// la réponse XML
		$rep = $this->MgetResponse('xml');
		$_request = 'http://www.magazine-litteraire.com/epub/search/'.$this->MgetBrutParam('find');
		$_request .= '?start='.($this->MgetParam('start',0,'integer')*$this->MgetParam('rows',10,'integer'));
		$rep->content = file_get_contents($_request);
		$rep->content = preg_replace('#\n#s', '', $rep->content);
		return $rep;
	}

	protected function loadarticle () {
		// la réponse html
		$rep = $this->MgetResponse('xhtml');

		$rep->title = 'Article';

		$path = $this->MgetBrutParam('path');

		$fileXML = file_get_contents('http://www.magazine-litteraire.com/'.$path);
		$fileXML = preg_replace(array('#&nbsp;#s'),array('&#160;'), $fileXML);

		// feuilles XSLT de transformation
		$sophiatohtml = adr::getAdr('sophia_sophiatohtml~sophiaXSLT');

		// transformation XSLT
		$html = g_xml::xml_via_xsl($fileXML,$sophiatohtml);

		if(!$html['errorStatus']) {
			$rep->content = $html['content'];
		} else {
			// log d'erreur sur cet article
			$log_error_xml = adr::getAdrDir('sophiaXSLT',null,array(),true).DS.'sophia-error-xml.txt';
			$msg = 'Error XML '.date("Y-m-d").' ; article : '.$path;

			// nettoyage
			$fileXML = $this->_clearXML($fileXML);

			// nouvelle tentative de transformation XSLT
			$html = g_xml::xml_via_xsl($fileXML,$sophiatohtml);

			// -> bon ou échec
			if(!$html['errorStatus']) {
				$rep->content = $html['content'];
			} else {
				$msg .= ' (cleaner failure)';
				$rep->content = '<pre>'.$msg.'</pre>';
			}

			file_put_contents($log_error_xml, $msg.PHP_EOL, FILE_APPEND );
			$message = file_get_contents($log_error_xml);

			// mail
			$mail = new PHPMailer();
			$mail->SetFrom('server@archicol.fr', 'Server Archicol');
			$mail->AddReplyTo('server@archicol.fr', 'Server Archicol');

			$address = "david.dauvergne@lescomplexes.com";
			$mail->AddAddress($address, "");

			$mail->Subject = "Invalid XML article";

			$mail->MsgHTML('<pre>'.$message.'</pre>');

			$mail->Send();
		}
		// TODO:
		//$rep->addCSS('sophia~css_context');
		return $rep;
	}

	protected function creatFileXML () {
		// la réponse html
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			// nom du fichier
			$_file = ap_tools::getFileName($this);

			$_title = $this->MgetParam('title','','string');

			// upload
			$upload = new g_upload('fileToUpload',array('xml'),$editor['pathTmp']);

			$filesCSS = json_decode(stripcslashes($this->MgetBrutParam('cssFiles')));

			// traitement de l'upload
			$_upload = $upload->uploading();

			// upload réussi !
			if(!$_upload['errorStatus']){

				$uploadFile = $upload->getfile();

				// $extension = $upload->getExtension();

				$fileXML = file_get_contents($uploadFile);

				// nettoyage
				$fileXML = $this->_clearXML($fileXML);

				// feuilles XSLT de transformation
				$sophiatohtml = adr::getAdr('sophia_sophiatohtml~sophiaXSLT');

				// transformation XSLT + nettoyage
				$_content = g_xml::xml_via_xsl($fileXML,$sophiatohtml);
				$_content = preg_replace('#<br>#s', '<br/>', $_content['content']);

				// validation des dossiers sur le nom d'un fichier
				ap_tools::dirsValid($_file,$editor['opf_full_dirname']);

				// creat file xhtml11
				$rep->content = ap_generateFile::creat(array(
					'file' => $_file,
					'dir' => $editor['opf_full_dirname'],
					'title' => $_title,
					'filesCSS' => $filesCSS,
					'body' => $_content
				), 'xhtml11');

				// suppression du fichier uploadé
				unlink($uploadFile);
			} else {
				$rep->content = ajax::error($_upload,'Err-sophia-2');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-sophia-1');
		}
		return $rep;
	}

	protected function  creatFile () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {
			// nom du fichier
			$_file = ap_tools::getFileName($this);

			$_title = $this->MgetParam('title','','string');

			$filesCSS = json_decode(stripcslashes($this->MgetBrutParam('cssFiles')));

			// l'aricle
			$path = $this->MgetBrutParam('path');

			$fileXML = file_get_contents('http://www.magazine-litteraire.com/'.$path);

			// nettoyage
			$fileXML = $this->_clearXML($fileXML);;

			// feuilles XSLT de transformation
			$sophiatohtml = adr::getAdr('sophia_sophiatohtml~sophiaXSLT');

			// transformation XSLT
			$_content = g_xml::xml_via_xsl($fileXML,$sophiatohtml);

			$_content = preg_replace('#<br>#s', '<br/>', $_content['content']);

			// validation des dossiers sur le nom d'un fichier
			ap_tools::dirsValid($_file,$editor['opf_full_dirname']);

			// creat file xhtml11
			$rep->content = ap_generateFile::creat(array(
				'file' => $_file,
				'dir' => $editor['opf_full_dirname'],
				'title' => $_title,
				'filesCSS' => $filesCSS,
				'body' => $_content
			), 'xhtml11');
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-sophia-4');
		}
		return $rep;
	}

	private function _clearXML ($fileXML) {
		return preg_replace(
			array('#<P />#s','#<I />#s','#<INTERTITRE>#s','#</INTERTITRE>#s','#&nbsp;#s'),
			array('<p>','<i>','<intertitre>','</intertitre>','&#160;'),
			$fileXML
		);
	}
}
?>
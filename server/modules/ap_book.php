<?php

/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module bilio
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_book extends g_module {

	protected function editBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {

			// container epub
			$opfFile = ap_tools::opfFile($editor['path']);

			if (!$opfFile['error']) {

				// feuilles XSLT pour corriger les préfixes
				$prefixopf = adr::getAdr('ap_prefixopf~libXSLT');

				// est-ce que le fichier est bien formé (préfixe)
				// transformation XSLT
				$opf = g_xml::xml_via_xsl($opfFile['path'],$prefixopf);

				$pathinfo = pathinfo($opfFile['relativePath']);

				$opf_dirname = 'epubs/'.$editor['editor'].'/'.$editor['dirName'].'/'.$pathinfo['dirname'].'/';

				session::write($editor['dirName'], array(
						'opf_dirname' => $opf_dirname,
						'opf_basename' => $pathinfo['basename'],
						'opf_full_dirname' => $editor['path'].$pathinfo['dirname'].DS
					)
				);

				if(!$opf['errorStatus']) {
					$rep->content = array(
						'opf_basename' => $pathinfo['basename'],
						'opf_dirname' => $opf_dirname,
						'content' => g_xml::cleanXML($opf['content'],false)
					);
				} else {
					$rep->content = ajax::error(array('content'=>'ap-book-opf-load'),'Err-ap-7');
				}
			} else {
				$rep->content = ajax::error(array('content'=>'ap-book-container'),'Err-ap-6');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-5');
		}
		return $rep;
	}

	protected function saveFile () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$_file = $this->MgetParam('file','','filex');
			$_content = stripslashes($this->MgetBrutParam('fileContent',true));
			$_content = g_xml::html_convert_entities($_content);

			if (in_array(pathinfo($_file,PATHINFO_EXTENSION), array('ncx','html','xhtml','opf','css','js'))) {
				file_put_contents($editor['opf_full_dirname'].$_file, $_content);
				$rep->content = ajax::ok();
			} else {
				$rep->content = ajax::error(array('content'=>'ap-book-savefile'),'Err-ap-9');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-8');
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

			ap_tools::dirsValid($_file,$editor['opf_full_dirname']);

			$filesCSS = json_decode(stripcslashes($this->MgetBrutParam('cssFiles')));

			$_content = stripslashes($this->MgetBrutParam('fileContent',true));
			$_content = g_xml::html_convert_entities($_content);

			$rep->content = ap_generateFile::creat(array(
				'file' => $_file,
				'dir' => $editor['opf_full_dirname'],
				'title' => $_title,
				'filesCSS' => $filesCSS,
				'body' => $_content
			),'xhtml11');
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-25');
		}
		return $rep;
	}

	protected function filesDepend () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$_files = $this->MgetBrutParam('files');

			$_files = explode(',', $_files);

			array_push($_files, $editor['opf_basename']);

			$_dirLength = strlen($editor['opf_full_dirname']);

			$scanFiles = array();

			foreach (dirs::glob_recursive( $editor['opf_full_dirname']."*") as $_filename) {
				$f = substr($_filename, $_dirLength);
				if(is_file($_filename)) {
					if (!in_array($f, $_files))
						array_push($scanFiles, $f);
				}
			}

			$rep->content = $scanFiles;
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-10');
		}
		return $rep;
	}

	protected function filesDependDel () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$_files = $this->MgetBrutParam('files');

			$_files = explode(',', $_files);

			foreach ($_files as $_file) {
				$f = $editor['opf_full_dirname'].$_file;
				if(is_file($f))
					unlink($f);
			}
			$rep->content = ajax::ok();
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-26');
		}
		return $rep;
	}

	protected function loadNCX () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$_href = $this->MgetParam('href','','filex');

			$ncxFile = $editor['opf_full_dirname'].$_href;

			if (file_exists($ncxFile)) {

				// feuilles XSLT pour corriger les préfixes
				$ncxprefix = adr::getAdr('ap_prefixncx~libXSLT');

				// est-ce que le fichier est bien formé (préfixe)
				// transformation XSLT
				$ncx = g_xml::xml_via_xsl($ncxFile,$ncxprefix);

				if(!$ncx['errorStatus']) {
					$ncx_xml = g_xml::cleanXML($ncx['content'],false);
					// navMap uniquement
					preg_match('#<ncx:navMap>(.*?)</ncx:navMap>#s', $ncx_xml, $matches);
					$rep->content = array(
						'content' => '<ncx:navMap>'.$matches[1].'</ncx:navMap>'
					);
				} else {
					$rep->content = ajax::error(array('content'=>'ap-book-ncx-load'),'Err-ap-13');
				}
			} else {
				$rep->content = ajax::error(array('content'=>'ap-book-ncx'),'Err-ap-12');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-11');
		}
		return $rep;
	}

	protected function uploadfile () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$dirImage = $editor['opf_full_dirname'].'image';

			if(!is_dir($dirImage))
				mkdir($dirImage);

			// type de fichier img or txt
			$typefile = $this->MgetParam('typefile','','string');

			// si img
			// savoir si l'image est valide
			// si valide connaitre le type de mouvement
			if( $typefile == 'img') {

				$mv = $this->MgetParam('mv','','string');

				if($mv=='replace') {
					$href = $this->MgetParam('href','','string');
					if(is_file($editor['opf_full_dirname'].$href))
						unlink($editor['opf_full_dirname'].$href);
				}

				// upload ap_convertImage::getValidFormats()
				$upload = new g_upload('fileToUpload',array('png','jpg','jpeg'),$dirImage.DS);

				// traitement de l'upload
				$_upload = $upload->uploading();

				// upload réussi !
				if(!$_upload['errorStatus']){

					$name = $upload->getName();

					$extension = $upload->getExtension();

					$im = new ap_thumbnail($upload->getfile());

					$thumbnailFile = adr::getAdrDir('thumbnail',null,array(),true).DS.$editor['dirName'].'.jpg';

					$im->creat($thumbnailFile);

					$typeMime = ap_typemime::get($extension);

					$html = g_tpl::get('ap_bookCover',array('name' =>$name));

					file_put_contents($editor['opf_full_dirname'].'cover.xhtml', $html);
					$rep->content = array(
						'img' => array(
							'href'			=> "image/".$name,
							'id'			=> $name,
							'media-type'	=> $typeMime
						),

						'html' => array(
								'href'			=> "cover.xhtml",
								'id'			=> 'f_'.time(),
								'media-type'	=> "application/xhtml+xml"
						)
					);
				} else {
					$rep->content = ajax::error($_upload,'Err-ap-14');
				}
			} else {
				// texte

				$upload = new g_upload('fileToUpload',array('doc','docx','odt','rtf','txt'),$editor['opf_full_dirname']);

				// traitement de l'upload
				$_upload = $upload->uploading();

				// upload réussi !
				if(!$_upload['errorStatus']){
					$fileIn = $upload->getfile();
					// nom du fichier
					$_file = ap_tools::getFileName($this);

					$filesCSS = explode('|', $this->MgetBrutParam('cssfiles'));

					$dirImg = $dirImage.DS;
					$dirImgRelatif = 'image/';
					$fileXSLT = adr::getAdr('ap_odttohtml~libXSLT');
					$paramsXSLT = array();

					// récupération d'un tableau transformation selon son nom
					$transformStyle = ap_transformStyle::get($this->MgetParam('transform','ap_default','string'));

					// niveau relatif
					$relativeURL = $this->MgetParam('relativeURL','','filex');
					ap_styleSheet::construct($transformStyle,$relativeURL.$dirImgRelatif,$dirImg);

					// validation des dossiers sur le nom d'un fichier
					ap_tools::dirsValid($_file,$editor['opf_full_dirname']);

					// création du fichier
					$filetohtml = new ap_filetohtml($fileIn,$_file);

					$_out = $filetohtml->creat($editor['opf_full_dirname'],$dirImg,$filesCSS,$fileXSLT,$paramsXSLT);

					// capture des images
					$__filesIMG = array();
					if($_out['errorStatus'] && array_key_exists('type', $_out)){
						$_out['errorStatus'] = false;
						$__filesIMG = $_out['content'];
					}

					if(!$_out['errorStatus']){
						$filetohtml->clear();
						$rep->content = array(
							'source' => $_out['source'],
							'filesIMG' => $__filesIMG
							);
					} else {
						$rep->content = ajax::error($_out,'Err-ap-17');
					}
				} else {
					$rep->content = ajax::error($_upload,'Err-ap-16');
				}
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-15');
		}
		return $rep;
	}

	protected function epubMake () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {
			$fileNameEpub = $editor['dirName'].'.epub';
			$filEepub = $editor['pathTmp'].$fileNameEpub;
			if(file_exists($filEepub))
				unlink($filEepub);

			$epub = new ap_epub();
			$epub->creat($filEepub);

			foreach (glob($editor['path'].'*') as $file) {
				if(is_dir($file))
					$epub->addDir($file, $editor['path']);
			}
			$book = array(
				'file' => 'index.php?module=ap_book&act=epubDownload&id='.$editor['dirName'],
				'id' => $editor['dirName']
			);
			$rep->content = $book ;
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-4');
		}
		return $rep;
	}


	protected function epubDownload () {
		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {
			$rep = $this->MgetResponse('BINARY');
			$rep->setHeader('Pragma','public');
			$rep->setHeader('Expires','0');
			$rep->setHeader('Cache-Control','must-revalidate, post-check=0, pre-check=0');
			$rep->content = $editor['pathTmp'].$editor['dirName'].'.epub';
		} else {
			$rep = $this->MgetResponse('json');
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-27');
		}
		return $rep;
	}

	protected function uploadImg () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'),true);

		if($editor!=null && $editor['locked'] ) {

			$dirImage = $editor['opf_full_dirname'].'image';

			if(!is_dir($dirImage))
				mkdir($dirImage);

			// upload
			$upload = new g_upload('fileToUpload',ap_convertImage::getValidFormats(),$dirImage.DS);

			// traitement de l'upload
			$_upload = $upload->uploading();

			// upload réussi !
			if(!$_upload['errorStatus']){
				$nameRelatif = 'image/'.$upload->getName();
				$_f = ap_convertImage::get($upload->getfile());
				if($_f!=null)
					$rep->content = array('file' => $nameRelatif);
				else
					$rep->content = ajax::error(array('content'=>'ap-book-img-import'),'Err-ap-30');
			} else {
				$rep->content = ajax::error($_upload,'Err-ap-29');
			}
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-28');
		}
		return $rep;
	}
}
?>
<?php

/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 *
 */

/**
 * Module d'action pour simpleEpub bilio ajax
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_biblio extends g_module {

	// chargements des livres dans la bibliothèque
	protected function loadBooks(){
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// éditeur
		$APPLI_EDITOR = session::read('APPLI_EDITOR');
		if(session::exist('APPLI_EDITOR') && $APPLI_EDITOR!=''){

			$page = $this->MgetParam('page',1,'integer');

			// récupération des livres
			$booksData = ORM::for_table(APPLI_TABLE)
				->where('editor',$APPLI_EDITOR)
				->offset(APPLI_BOOK_NUMBER*($page-1))
				->limit(APPLI_BOOK_NUMBER*$page)
				->find_many();

			$APPLI_BOOK_COUNT = ORM::for_table(APPLI_TABLE)->count();

			// tableau des livres
			$books = array();

			// construction du tableau
			foreach ($booksData as $key => $value) {
				$id = $APPLI_EDITOR.'_'.$booksData[$key]->id;
				$books[] = array(
					'id' => $id,
					'title' => $booksData[$key]->title,
					'img' => $id,
					'status' => $booksData[$key]->status,
				);
			}

			$rep->content = array(
				'APPLI_BOOK_NUMBER' => APPLI_BOOK_NUMBER,
				'APPLI_BOOK_COUNT' => $APPLI_BOOK_COUNT,
				'APPLI_BOOK_PAGE' => $page,
				'APPLI_BOOKS' => $books
			);
		} else {
			$rep->content = ajax::error(array('content'=>'ap-errorEditorName Reload Hibouk'),'Err-ap-23');
		}
		return $rep;
	}

	private function _insertBook($fileZip,$APPLI_EDITOR){

		// titre du livre
		$_title = "Title book";
		// status par défaut
		$defaultStatus = "ap_progr";
		// création d'un livre
		$newBook = ORM::for_table(APPLI_TABLE)->create();

		$newBook->title = $_title;
		$newBook->editor = $APPLI_EDITOR;
		$newBook->status = $defaultStatus;
		// on sauve
		$newBook->save();
		// id créé
		$_id = $newBook->id();
		$idEditor = $APPLI_EDITOR.'_'.$_id;

		// on fabrique le dossier
		$dirID = adr::getAdrDir('epubs',null,array($APPLI_EDITOR,$idEditor),true);
		if(!is_dir($dirID))
			mkdir($dirID, 0700);

		// on extrait le epub
		$zip = new ZipArchive;
		$zip->open($fileZip);
		$zip->extractTo($dirID.DS);
		$zip->close();

		// container epub
		$opfFile = ap_tools::opfFile($dirID.DS);

		$opf = simplexml_load_file($opfFile['path'], null, true);

		$BookID = 'BookID';
		$opf['unique-identifier'] = $BookID;

		$title = $opf->metadata->children('http://purl.org/dc/elements/1.1/')->title.'';

		if($title!='') {
			$_book = ORM::for_table(APPLI_TABLE)->where('id', $_id)->find_one();
			$_book->set('title', $title);
			$_book->save();
		} else {
			$title = $_title;
		}

		// La couverture
		$metas = $opf->metadata->meta;
		$cover = false;
		$coverContent = '';
		$coverFile = '';
		foreach ($metas as $meta) {
			$attributes = $meta->attributes();
			if($attributes['name']){
				if($attributes['name']=='cover') {
					$cover = true;
					$coverContent = $attributes['content'].'';
				}
			}
		}

		if($cover) {
			$items = $opf->manifest->item;
			foreach ($items as $item) {
				$attributes = $item->attributes();
				if($attributes['id'] && $attributes['id']==$coverContent)
					$coverFile = $attributes['href'].'';
			}
		}

		// recherche d'un identifier UUID
		$identifiers = $opf->metadata->children('http://purl.org/dc/elements/1.1/')->identifier;

		$urn = true;
		$id = true;
		foreach ($identifiers as $identifier) {
			$attributes = $identifier->attributes();
			$attributesOPF = $identifier->attributes('http://www.idpf.org/2007/opf');

			if($attributes['id'] ) {
				$attributes['id'] = $BookID;
				$id = false;
			}

			if($attributesOPF['scheme']) {
				if(strtoupper($attributesOPF['scheme'])=='URN')
					$urn = false;
			}
		}

		if($urn) {
			$UUID = $opf->metadata->addChild('identifier','urn:uuid:'.$this->_gen_uuid(),'http://purl.org/dc/elements/1.1/');
			$UUID->addAttribute('opf:scheme', 'UUID','http://www.idpf.org/2007/opf');
			if($id)
				$UUID->addAttribute('id', $BookID);
		}

		// on enregistrement un fichier propre
		$dom = new DOMDocument("1.0");
		$dom->preserveWhiteSpace = false;
		$dom->formatOutput = true;
		$dom->loadXML($opf->asXML());
		file_put_contents($opfFile['path'], g_xml::html_convert_entities($dom->saveXML()));
		return array(
			'id'=>$idEditor,
			'title'=>$title,
			'status'=>$defaultStatus,
			'coverFile'=>dirname($opfFile['path']).DS.$coverFile
		);
	}

	protected function modelsBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');
		$models = new g_configEpubModels();
		$rep->content = $models->get();
		return $rep;
	}

	protected function addBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		$model = $this->MgetParam('model','ap_epub2','string');

		$APPLI_EDITOR = session::read('APPLI_EDITOR');
		if(session::exist('APPLI_EDITOR') && $APPLI_EDITOR!=''){
			$newBook = $this->_insertBook(adr::getAdr($model.'~epubMODELS'),$APPLI_EDITOR);

			// on copy le thumbnail vide
			$tumb_s = adr::getAdr('ap_covernull~imgJPG');
			$tumb_t = adr::getAdr($newBook['id'].'~thumbnail');

			copy($tumb_s, $tumb_t);
			// tableau des livres
			$rep->content = array(
				'id' => $newBook['id'],
				'title' => $newBook['title'],
				'img' => $newBook['id'],
				'status' => $newBook['status']
			);
		} else {
			$rep->content = ajax::error(array('content'=>'ap-errorEditorName Reload Hibouk'),'Err-ap-21');
		}
		return $rep;
	}

	protected function importBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');
		// upload
		$dirTmp = adr::getAdrDir('epubs',null,array('_tmp'),true).DS;
		$upload = new g_upload('fileToUpload',array('epub'),$dirTmp);
		// traitement de l'upload
		$_upload = $upload->uploading();

		// upload réussi !
		if(!$_upload['errorStatus']){

			$uploadFile = $upload->getfile();
			$APPLI_EDITOR = session::read('APPLI_EDITOR');
			if(session::exist('APPLI_EDITOR') && $APPLI_EDITOR!=''){
				$newBook = $this->_insertBook($uploadFile,$APPLI_EDITOR);

				// couverture
				$im = new ap_thumbnail($newBook['coverFile']);

				$thumbnailFile = adr::getAdrDir('thumbnail',null,array(),true).DS.$newBook['id'].'.jpg';

				$im->creat($thumbnailFile);

				$rep->content = array(
					'id' => $newBook['id'],
					'title' => $newBook['title'],
					'img' => $newBook['id'],
					'status' => $newBook['status']
				);
			} else {
				$rep->content = ajax::error(array('content'=>'ap-errorEditorName Reload Hibouk'),'Err-ap-22');
			}
			// suppressiondu fichier uploadé
			unlink($uploadFile);
		} else {
			$rep->content = ajax::error($_upload,'Err-ap-18');
		}
		return $rep;
	}

	protected function cloneBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {

			// TODO : manque pour les images !!
			$metaData = json_decode(stripslashes($this->MgetBrutParam('metaData')));
			// création d'un livre
			$newBook = ORM::for_table(APPLI_TABLE)->create();

			$newBook->editor = $editor['editor'];
			$newBook->title = $metaData->title;
			$newBook->status = $metaData->status;
			// on sauve
			$newBook->save();
			// id créé
			$id = $editor['editor'].'_'.$newBook->id();

			// on fabrique le dossier
			$dirTarget = adr::getAdrDir('epubs',null,array($editor['editor'],$id),true);
			if(!is_dir($dirTarget))
				mkdir($dirTarget, 0700);

			foreach (glob($editor['path'].'*') as $filename)
				dirs::copyDir($filename,$dirTarget);

			// URN:UUID
			$containerFile = $dirTarget.DS.'META-INF'.DS.'container.xml';
			$containerXML = simplexml_load_file($containerFile);
			$fullPath = $containerXML->rootfiles->rootfile['full-path'].'';
			$packageOPFFile = $dirTarget.DS.$fullPath;
			$packageOPFContent = file_get_contents($packageOPFFile);
			$packageOPFContent = preg_replace('#>urn:uuid:[\w|\d|-]+<#', '>urn:uuid:'.$this->_gen_uuid().'<', $packageOPFContent);
			file_put_contents($packageOPFFile, $packageOPFContent);

			// on copy le thumbnail vide
			$tumb_s = adr::getAdr($editor['dirName'].'~thumbnail');
			$tumb_t = adr::getAdr($id.'~thumbnail');

			copy($tumb_s, $tumb_t);

			// tableau des livres
			$book = array(
					'id' => $id,
					'title' => $metaData->title,
					'img' => $id,
					'status' => $metaData->status
				);
			$rep->content = $book ;
			return $rep;
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-1');
		}
		return $rep;
	}


	protected function delBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {
			// suppression des dossiers
			dirs::deleteDirectory($editor['pathNODS']);
			dirs::deleteDirectory($editor['pathTmpNODS']);
			unlink(adr::getAdr($editor['dirName'].'~thumbnail'));

			// suppresion en base
			$book = ORM::for_table(APPLI_TABLE)->where('id', $editor['id'])->find_one();
			$book->delete();

			$rep->content = ajax::ok();
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-2');
		}
		return $rep;
	}

	protected function updateBook () {
		// la réponse JSON
		$rep = $this->MgetResponse('json');

		// editor array
		$editor = ap_tools::getEditorProperties($this->MgetParam('id','','string'));

		if($editor!=null && $editor['locked'] ) {
			$metaData = json_decode(stripslashes($this->MgetBrutParam('metaData')));
			$book = ORM::for_table(APPLI_TABLE)->where('id', $editor['id'])->find_one();
			$book->set('title', $metaData->title);
			$book->set('status', $metaData->status);
			$book->save();

			ap_tools::unlock($editor['pathTmp']);
			$rep->content = ajax::ok();
		} else {
			$rep->content = ap_tools::msgNoSessionOrLocked($editor,'Err-ap-3');
		}
		return $rep;
	}

	private function _gen_uuid() {
		return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
			// 32 bits for "time_low"
			mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

			// 16 bits for "time_mid"
			mt_rand( 0, 0xffff ),

			// 16 bits for "time_hi_and_version",
			// four most significant bits holds version number 4
			mt_rand( 0, 0x0fff ) | 0x4000,

			// 16 bits, 8 bits for "clk_seq_hi_res",
			// 8 bits for "clk_seq_low",
			// two most significant bits holds zero and one for variant DCE1.1
			mt_rand( 0, 0x3fff ) | 0x8000,

			// 48 bits for "node"
			mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
		);
	}
}

?>
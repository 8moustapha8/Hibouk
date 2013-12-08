<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Transformation des fichiers texte en HTML
 *
 * @package application
 * @subpackage application (ap_)
 */
/*

script du service (nom du fichier unoconvd) :


#!/bin/sh
### BEGIN INIT INFO
# Provides: unoconvd
# Required-Start: $network
# Required-Stop: $network
# Default-Start: 2 3 5
# Default-Stop:
# Description: unoconvd - Converting documents to PDF by unoconv
### END INIT INFO
case "$1" in
	start)
		su www-data -c '/usr/bin/unoconv --listener &'
		;;
	stop)
		killall soffice.bin
		;;
	restart)
		killall soffice.bin
		sleep 1
		su www-data -c '/usr/bin/unoconv --listener &'
		;;
esac
 */

/*
The adjust permissions, put on boot and run the daemon:

chmod 755 /etc/init.d/unoconvd
update-rc.d  unoconvd defaults
service unoconvd start
 */

ini_set('pcre.backtrack_limit',5000000);

class ap_filetohtml {

	private static $_xlt_en = array(
		'#\[\|lt\|\]#s',// \|lt\|
		'#\[\|gt\|\]#s',// \|gt\|
	);

	private static $_xlt_en_to = array(
		'<',// [|lt\|]
		'>',// [|gt\|]
	);

	private static $_xlt_entities = array(
		'/#/s',// #

		'# \?#s', // espace
		'#\302\240\?#s', // espace insécable
		'#\342\200\257\?#s', // espace fine insécable
		'#×§×#s',

		'# \!#s', // espace
		'#\302\240\!#s', // espace insécable
		'#\342\200\257\!#s', // espace fine insécable
		'#×§×#s',

		'# \;#s', // espace
		'#\302\240\;#s', // espace insécable
		'#\342\200\257\;#s', // espace fine insécable
		'#×§×#s',

		'# \:#s', // espace
		'#\302\240\:#s', // espace insécable
		'#\342\200\257\:#s', // espace fine insécable
		'#×§×#s',

		'#« #s', // espace
		'#«\302\240#s', // espace insécable
		'#«\342\200\257#s', // espace fine insécable
		'#«#s',
		'#×§×#s',

		'# »#s', // espace
		'#\302\240»#s', // espace insécable
		'#\342\200\257»#s', // espace fine insécable
		'#»#s',
		'#×§×#s',

		'/_/s',// _

		'#souuuuuul#s',// souligné protégé adresse
		'#pouuuuuurc#s',// poucentage protégé adresse
		'#dieeeeeese#s',// dièse protégé adresse
		'#\[\|diese\|\]#s',// diese protégée
		'#\[\|soul\|\]#s',// souligné protégée


		'#&lt;#s',// entity &lt;  <lt/>
		'#&gt;#s',// entity &gt;  <gt/>
		'#\'#s',// apostrophe  <apofr/>
		'#\302\240#s',// espace insécable <espi/>


		'#&amp;#s',// esperluette
		'#%#s',// poucentage
		'#\[\|prc\|\]#s',// poucentage protégé
		'#\[\|space\|\]#s',// espace protégé

		'#œ#s',// œ
		'#Œ#s',// Œ
		'#æ#s',// æ
		'#Æ#s',// Æ
		'#°#s',// degre
		'#€#s',// €
		'#\$#s',// $
		'#~#s',// ~
		'#Ç#s',// Ç
		'#…#s',// …
		'#\.\.\.#s',// …
		'#“#s',
		'#”#s',
		'#‘#s',
		'#’#s',
		'#‐#s',
		'#–#s',
		'#—#s',
		'#\\\#s',// \
		'#\{#s',//  accolade ouvrante
		'#\}#s',//  accolade fermante
		'#\[#s',//  crochet ouvrant
		'#\]#s',//  crochet fermant
		'#\|#s',//  barre verticale (en dernier)
		'#HREFIMG#s'//  images vides
	);

	private static $_xlt_entities_to = array(
		'&#35;',// #

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'&#160;?',

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'&#160;!',

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'&#160;;',

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'&#160;:',

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'×§×', // «
		'«&#160;',

		'×§×', // espace
		'×§×', // espace insécable
		'×§×', // espace espace fine insécable
		'×§×', // »
		'&#160;»',

		'&#95;',// _

		'[|soul|]',// souligné protégé adresse
		'[|prc|]',// poucentage protégé adresse
		'[|diese|]',// dièse protégé adresse
		'#',// diese protégée
		'_',// souligné protégée

		'&lt;',// entity &lt;  <lt/>
		'&gt;',// entity &gt;  <gt/>
		'&#8217;',// apostrophe  <apofr/>
		'&#160;',// espace insécable <espi/>

		'&#38;',// esperluette
		'%',// poucentage
		'%',// poucentage protégé
		'&#160;',// espace protégé

		'&#339;',// œ
		'&#338;',// Œ
		'&#230;',// æ
		'&#198;',// Æ
		'&#176;',// degre
		'&#8364;',// €
		'&#36;',// $
		'&#126;',// ~
		'&#199;',// Ç
		'&#8230;',// …
		'&#8230;',// …
		'&#8220;',// “
		'&#8221;',// ”
		'&#8216;',// ‘
		'&#8217;',// ’
		'&#8208;',// ‐
		'&#8211;',// –
		'&#8212;',// —
		'&#92;',// \
		'&#123;',//  accolade ouvrante
		'&#125;',//  accolade fermante
		'&#91;',//  crochet ouvrant
		'&#93;',//  crochet fermant
		'&#124;',//  barre verticale (en dernier)
		''//  images vides
	);

	/**
	 *
	 *
	 * @var string
	 */
	private $_fileIn = '';

	/**
	 *
	 *
	 * @var string
	 */
	private $_dirOut = '';

	/**
	 *
	 *
	 * @var string
	 */
	private $_extension = '';

	/**
	 *
	 *
	 * @var string
	 */
	private $_fileOut = '';

	/**
	 *
	 *
	 * @var array
	 */
	private $_tag_xml = null;

	/**
	 *
	 *
	 * @var integer
	 */
	private $_cp_xml = 0;

	public function __construct($fileIn,$_fileHtml){
		$this->_fileIn = $fileIn;
		$path = pathinfo($fileIn);
		$this->_fileHtml = $_fileHtml;
		$this->_dirOut = $path['dirname'].DIRECTORY_SEPARATOR;
		$this->_extension = strtolower($path['extension']);
		$this->_fileOut = $this->_dirOut.$path['filename'].'.odt';
	}

	/**
	 *
	*/
	private function _convertToODT() {
		$command = sprintf('unoconv --format odt --output %s %s 2>&1', $this->_dirOut, $this->_fileIn);
		$output = shell_exec($command);
		if(substr($output, 0,5)=='sh: 1')
			return $error = array('errorStatus' => true, 'content' => 'ap_filetohtml Error 2 (unoconv no found)');
		else
			return $error = array('errorStatus' => false, 'content' => $output);
	}

	/**
	 * Methode de callback pour protéger des attributs dans du xml
	 * @param (array $matches) tableau de la capture
	 * @return (string) le tag numéroté
	*/
	private function _protectAtt($matches){
		$this->_cp_xml++;
		$this->_tag_xml[$this->_cp_xml] = $matches[1];
		return '¿'.$this->_cp_xml.'¬';
	}

	/**
	 * Methode de callback pour remplacer des attributs dans du xml
	 * @param (array $matches) tableau de la capture
	 * @return (string) le tag reconstruit
	*/
	private function _replaceAtt($matches){
		return '<'.$this->_tag_xml[$matches[1]].'>';
	}

	/**
	 * Sauvegarde des images
	*/
	private function _saveIMG($file,$dirImg){
		$nbEntrees = $file->numFiles;
		$_dirPictures = array('Pictures','media');
		$_files = array();
		$errorStatus = false;
		for ($i = 0; $i < $nbEntrees; $i++) {
			@$entree = $file->statIndex($i);
			$_fileName = explode('/', $entree['name']);
			if(in_array($_fileName[0], $_dirPictures)){
				$file->extractTo($dirImg, $entree['name']);
				$_nfile = $dirImg.$_fileName[1];
				rename($dirImg.$entree['name'],$_nfile);
				$_f = ap_convertImage::get($_nfile);
				if($_f==null)
					$errorStatus = true;
				$_files[$_fileName[1]] = ap_convertImage::get($_nfile);
			}
		}
		foreach ($_dirPictures as $value) {
			$_d = $dirImg.$value;
			if(is_dir($_d))
				rmdir($_d);
		}
		return array('errorStatus' => $errorStatus, 'content' => $_files, 'type' => 'files');
	}

	/**
	 * Sauvegarde des images
	*/
	private function _creatHTML($file,$fileXSLT,$paramsXSLT) {
		$content = $file->getFromName('content.xml');
		$style = $file->getFromName('styles.xml');
		preg_match('#<office:styles>(.*?)</office:styles>#s', $style, $matches);
		$content = preg_replace('#<office:automatic-styles>#', '<office:styles>'.$matches[1].'</office:styles><office:automatic-styles>', $content);
		$content = preg_replace(array('#<text:section(.*?)>#s','#</text:section>#s'),'',$content);
		$doc = new DOMDocument();
		$xsl = new XSLTProcessor();
		$xsl->registerPHPFunctions();
		$doc->load($fileXSLT);
		$xsl->importStyleSheet($doc);

		foreach ($paramsXSLT as $param=>$value)
			$xsl->setParameter(null,$param,$value);

		$doc->loadXML($content);

		$html = $xsl->transformToXML($doc);

		// on supprime le DOCTYPE
		$html = preg_replace('#<!DOCTYPE(.*?)>#s', '', $html);

		// on replace les chevrons protégés
		$html = preg_replace(self::$_xlt_en, self::$_xlt_en_to, $html);

		$this->_tag_xml = array();
		$this->_cp_xml = 0;
		// on protèges les attributs
		$html = preg_replace_callback('#<(.*?)>#s', array($this, '_protectAtt'), $html);

		// on remplace les caratères spéciaux
		$html = preg_replace(self::$_xlt_entities, self::$_xlt_entities_to, $html);

		// on récupère les attributs
		$html = preg_replace_callback('#¿(\d+)¬#s', array($this, '_replaceAtt'), $html);
		return $html;
	}

	/**
	 *
	*/
	public function creat($dir,$dirImg,$filesCSS,$fileXSLT,$paramsXSLT) {
		if($this->_extension!='odt')
			$error = $this->_convertToODT();
		else
			$error['errorStatus'] = false;

		if(!$error['errorStatus']){
			$zip = new ZipArchive();
			if($zip->open($this->_fileOut) !== true){
				$error = array('errorStatus' => true, 'content' => 'ap_filetohtml Error 1');
			} else {
				$error = $this->_saveIMG($zip,$dirImg);
				$_content = $this->_creatHTML($zip,$fileXSLT,$paramsXSLT);
				// creat file xhtml11
				$error['source'] = ap_generateFile::creat(array(
					'file' => $this->_fileHtml,
					'dir' => $dir,
					'title' => $this->_fileHtml,
					'filesCSS' => $filesCSS,
					'body' => $_content
				), 'xhtml11');
			}
		}
		return $error;
	}

	public function clear() {
		unlink($this->_fileIn);
		if(is_file($this->_fileOut))
			unlink($this->_fileOut);
	}
}
?>
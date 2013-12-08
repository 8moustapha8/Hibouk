<?php
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 *
 */

/**
 * Generate file
 *
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 */
class ap_generateFile {


	public static function creat($data,$type='xhtml11') {
		$fnc = '_'.$type;
		return self::$fnc($data);
	}

	private static function _xhtml11($data) {

		$_css = '';
		foreach ($data['filesCSS'] as $value)
			$_css .= '<link href="'.$value.'" rel="stylesheet" type="text/css"></link>'.PHP_EOL;

		$_html = g_tpl::get('ap_fileXHTML11',array(
				'title' => $data['title'],
				'css' => $_css,
				'body' => $data['body'],
			)
		);

		file_put_contents($data['dir'].$data['file'], $_html);

		return array(
			'href'			=> $data['file'],
			'id'			=> 'f_'.time(),
			'media-type'	=> "application/xhtml+xml"
		);
	}
}
?>

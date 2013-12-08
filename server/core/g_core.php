<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Classe principale
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_core {

	/**
	 * Initialisation
	 *
	 */
	public static function Init() {
		// niveau des erreurs
		if(GALLINA_DEBUG){
			error_reporting(-1);
			// remize à zéro du fichier d'erreurs php
			file_put_contents(GALLINA_FILE_DEBUGPHP,'<html>'.PHP_EOL.'<head>'.PHP_EOL
				.'<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>'
				.PHP_EOL.'</head>'.PHP_EOL.'<body>'.PHP_EOL);
		} else {
			error_reporting(E_ERROR | E_WARNING);
		}

		// Gestionnaire d'erreur
		set_error_handler(array(__CLASS__,'errorHandler'));

		register_shutdown_function(array(__CLASS__,'lastErrorHandler'));

		// Exception non capturée
		set_exception_handler(array(__CLASS__,'exceptionHandler'));

		// initialisation du gestionnaire des fichiers et des adresses
		adr::init();

		// on charge le sous controller
		$ssController = call_user_func(array(GALLINA_CONFIG_SSCONTROLER, 'getInstance'));
		$ssController->dispatch();
	}

	public static	function lastErrorHandler(){
    $error = error_get_last();
    if (!empty($error)) {
		$errors = errors::errorType($error['type']);
				if(GALLINA_DEBUG)
					$_msg = sprintf("<b>%s</b> : %s<br/>ligne : <b>%d</b><br/>%s", $errors, $error['message'], $error['line'], $error['file']);
				else
					$_msg = sprintf("%s : %s ; ligne : %d ; %s", $errors, $error['message'], $error['line'], $error['file']);

				errors::writeMsg($_msg,$error['message'],$error['type']);
    }
  }

	/**
	 * Déclenchement d'une erreur.
	 *
	 * @param	int $code Niveau de l'erreur
	 * @param	string $msg Message d'erreur
	 * @param	string $file Nom du fichier ou l'erreur s'est déclenchée
	 * @param	int $line Numéro de ligne ou l'erreur s'est déclenchée
	 * @param	string $context Les variables au moment ou l'erreur s'est déclenchée
	 */
	public static function errorHandler($code, $msg, $file, $line, $context){

		// exception xml
		if ($code==E_WARNING && ( (substr_count($msg,'DOMDocument::load()')>0) || (substr_count($msg,'DOMDocument::loadXML()')>0) )){
	throw new DOMException($msg);
    } else {
			$errors = errors::errorType($code);
			if(GALLINA_DEBUG)
				$_msg = sprintf("<b>%s</b> : %s<br/>ligne : <b>%d</b><br/>%s", $errors, $msg, $line, $file);
			else
				$_msg = sprintf("%s : %s ; ligne : %d ; %s", $errors, $msg, $line, $file);

			errors::writeMsg($_msg,$msg,$code);
			return true;
		}
  }

  /**
	 * Exception non capturée
	 *
	 * @param	object Exception
	 */
	public static function exceptionHandler($e){
		echo $e->getMessage();
		if(GALLINA_DEBUG)
			$_msg = '<span style="color:red"><b>Exception non capturée</b></span> : '.$e->getMessage().'<br/>ligne : <b>'.$e->getLine().'</b><br/> '.$e->getFile();
		else
			$_msg = 'Exception non capturée : '.$e->getMessage().' ; ligne : '.$e->getLine().' ; '.$e->getFile();
		errors::writeMsg($_msg,$_msg,1);
	}
}
?>
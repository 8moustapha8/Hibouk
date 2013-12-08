<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Classe des fonctions pour les erreurs et les logs
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class errors {
	/**
	 *
	 * Enregistre un message
	 * en mode débugage dans le fichier errorphp.html
	 * en mode log dans le fichier logs.txt
	 *
	 * @param string $msg Message
	 */
	public static function writeMsg($msg,$msgS,$code){
		if($code == E_ERROR || $code == E_USER_ERROR || $code == E_PARSE || $code == E_RECOVERABLE_ERROR){
			$ssControler = call_user_func(array(GALLINA_CONFIG_SSCONTROLER, 'getInstance'));
			if($ssControler->response==null) {
				/*
				header('HTTP/1.1 500 Internal error');
				header('Content-type: text/plain');
				if(GALLINA_DEBUG)
					echo $msg;
				else
					echo $msgS;
				*/
				if(GALLINA_DEBUG) // mode débuggage
					file_put_contents(GALLINA_FILE_DEBUGPHP, $msg.'<hr/>'.PHP_EOL, FILE_APPEND );
				else // mode log
					self::writeLog($msg);

			} else {
				if(GALLINA_DEBUG)
					$ssControler->response->errorOut($msg);
				else
					$ssControler->response->errorOut($msgS);
			}
			exit();
		} else {
			if(GALLINA_DEBUG) // mode débuggage
				file_put_contents(GALLINA_FILE_DEBUGPHP, $msg.'<hr/>'.PHP_EOL, FILE_APPEND );
			else // mode log
				self::writeLog($msg);
		}
	}

	/**
	 *
	 * Enregistre un message dans le fichier de log
	 *
	 * @param string $msg Message
	 */
	public static function writeLog($msg){
		// on vérifie que le fichier existe avant de le charger
		if (file_exists(GALLINA_FILE_LOG))
			$txt = file_get_contents(GALLINA_FILE_LOG);
		else
			$txt = '';

		// on compte le nombre de ligne
		$nbl = substr_count($txt, PHP_EOL);

		// si le fichier est trop long (500 lignes) on le découpe en supprimant le premier log
		if($nbl>500)
			$txt = substr($txt,strpos($txt, PHP_EOL,1)+2,strlen($txt));

		// on ajoute le log en supprimant les retours chariot du message et les tags
		$txt .= PHP_EOL.date('Y-m-d H:i:s').' | ip '.$_SERVER['REMOTE_ADDR'].' | '.strip_tags(str_replace(array("\r", "\r\n", "\n"), '', $msg)).PHP_EOL;

		// on sauve le fichier
		file_put_contents(GALLINA_FILE_LOG,$txt);
	}

	/**
	 *
	 * Détermine l'erreur selon le numéro d'erreur
	 *
	 * @param string $errno Numéro d'erreur
	 * @return string
	 */
	public static function errorType($errno){
  	switch ($errno){
			case E_ERROR:               $errors = 'Error';                  break;
			case E_WARNING:             $errors = 'Warning';                break;
			case E_PARSE:               $errors = 'Parse Error';            break;
			case E_NOTICE:              $errors = 'Notice';                 break;
			case E_CORE_ERROR:          $errors = 'Core Error';             break;
			case E_CORE_WARNING:        $errors = 'Core Warning';           break;
			case E_COMPILE_ERROR:       $errors = 'Compile Error';          break;
			case E_COMPILE_WARNING:     $errors = 'Compile Warning';        break;
			case E_USER_ERROR:          $errors = 'User Error';             break;
			case E_USER_WARNING:        $errors = 'User Warning';           break;
			case E_USER_NOTICE:         $errors = 'User Notice';            break;
			case E_STRICT:              $errors = 'Strict Notice';          break;
			case E_RECOVERABLE_ERROR:   $errors = 'Recoverable Error';      break;
			case E_DEPRECATED:   				$errors = 'Deprecated';     				break;
			case E_USER_DEPRECATED:   	$errors = 'User Deprecated';      	break;
			default:                    $errors = "Unknown error ($errno)"; break;
		}
		return $errors;
	}

	/**
	 *
	 * Message d'erreur interne
	 *
	 * @param string $key
	 * @param string $dataLog
	 * @return array
	 */
	public static function inner($key='',$errorCode='',$dataLog=''){
		if($key=='')
			return array('errorStatus' => false);
		else
			return array('errorStatus' => true, 'content' => errors::errorMsg($key,$errorCode,$dataLog));
	}

  /**
	 *
	 * Message d'erreur
	 *
	 * @param string $key
	 * @param string $errorCode
	 * @param string $dataLog
	 * @return string
	 */
	public static function errorMsg($key,$errorCode,$dataLog=''){
		$msg = '['.$errorCode.'] '.$key;
		errors::writeMsg($msg.' / '.$dataLog,$msg,E_WARNING);
		return $msg;
	}
}
?>
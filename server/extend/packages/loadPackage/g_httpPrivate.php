<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Copie d'un package depuis un dépot privé par http
 *
 * @param array $depot url, nom du dépot
 * @param array $packageFile nom du fichier du package
 * @param array $dirCopy dossier ou effectuer la copie
 * @return array
 */
function g_httpPrivate($depot,$packageFile,$dirCopy){

	$depot['pos'] = (int) $depot['pos'];

	// fichier de packages dans le dépot
	$url = $depot['url'].'loadpackage.php';

	$car = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!><*;}]@[{#(-_)";
	$car = str_shuffle($car);
	$publicKey = '';
	for($i=0;$i<15;$i++)
		$publicKey .= $car[rand(0,strlen($car))];

	$_cryptFnc = function($_publicKey,$_rep) {
		$_publicKey = substr($_publicKey, 0, $_rep['pos']).$_rep['salt'].substr($_publicKey,$_rep['pos'],strlen($_publicKey));
		$_publicKey = hash($_rep['hash'], $_publicKey, false);
		$_c = hash('sha256', $_publicKey, false);
		return $_c;
	};

	$crypt = $_cryptFnc($publicKey,$depot);

	$postFields = array(
		'publicKey' => $publicKey,
		'crypt' => $crypt,
		'login' => $depot['login'],
		'package' => $packageFile
	);

	$options = array(
		CURLOPT_URL			=> $url,
		CURLOPT_RETURNTRANSFER	=> true,
		CURLOPT_HEADER		=> false,
		CURLOPT_FAILONERROR	=> true,
		CURLOPT_POST		=> true,
		CURLOPT_POSTFIELDS	=> $postFields
	);

	$CURL = curl_init();

	if(empty($CURL)){
		$package = errors::inner('Curl error','Err-g-49',$depot['name']);
	} else {

		curl_setopt_array($CURL,$options);

		// Exécution de la requête
		$content = curl_exec($CURL);

		$curl_errno = curl_errno($CURL);
		if($curl_errno){
			$package = errors::inner('Curl errorno','Err-g-50',$curl_errno);
		} else {
			if($content=='error_connexion') {
				$package = errors::inner('Repository error login or password','Err-g-51','');
			} else {
				$package = errors::inner();
				try{
					// dossier temporaire de copy
					$fileLocal = $dirCopy.DS.$packageFile;
					copy($depot['url'].$content, $fileLocal);
					$package['file'] = $fileLocal;

				} catch (Exception $e) {
					// Erreur de copie du package depuis le dépôt
					$package = errors::inner('Error to copy the package from the repository','Err-g-52','');
				}
			}
		}
	}

	curl_close($CURL);

	return $package;
}
?>

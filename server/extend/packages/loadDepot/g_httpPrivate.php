<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Lecture du contenu d'un dépôt privé par http
 *
 * @param array $depot url, nom du dépot
 * @return array
 */
function g_httpPrivate($depot){

	$depot['pos'] = (int) $depot['pos'];

	// fichier de packages dans le dépot
	$url = $depot['url'].'packages.php';

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
		'login' => $depot['login']
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
		$packages = errors::inner('Curl error','Err-g-46',$depot['name']);
	} else {

		curl_setopt_array($CURL,$options);

		// Exécution de la requête
		$content = curl_exec($CURL);

		$curl_errno = curl_errno($CURL);
		if($curl_errno){
			$packages = errors::inner('Curl errorno','Err-g-47',$curl_errno);
		} else {
			if($content=='error_connexion') {
				$packages = errors::inner('Repository error login or password','Err-g-48','');
			} else {
				// le renvoie est fait sous forme de tableau contenant
				// errorStatus => false si pas d'erreur ou true en cas d'erreur
				// error => tableau du dépot qui a généré une erreur
				// packages => contient tout les items du dépot
				$packages = errors::inner();
				// chargement du fichier XML
				$packages_xml = simplexml_load_string($content);
				// parse le fichier pour construire un tableau
				$_packages = array();
				foreach ($packages_xml as $i) {
					$_packages[] = array(
						'uid' => (string) $i['uid'],
						'namespace' => (string) $i['namespace'],
						'name' => (string) $i['name'],
						'phase_dev' => (string) $i['phase_dev'],
						'version' => (string) $i['version'],
						'depend' => (string) $i['depend']
					);
				}
				$packages['packages'] = $_packages;
			}
		}
	}

	curl_close($CURL);

	return $packages;
}
?>
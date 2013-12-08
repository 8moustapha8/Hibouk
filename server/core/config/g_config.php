<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 *
 * Gestion des fichiers de configuration
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_config {

	/**
	 * Retourne les variables de configuration
	 *
	 * @param string $file fichier à charger
	 * @return array
	 */
	protected function _readVars($file){
		require($file);
		return $VARS;
	}

	/**
	 *  Enregistrement en PHP d'un tableau
	 *
	 * @param string $file Nom du fichier
	 * @param string $name Nom dela variable
	 * @param array $var tableau à sauvegarder
	 */
	protected function _saveVars($file,$vars,$comment=''){
		if($comment!='')
			$comment = "/* ".$comment." */\n";
		$php = "<?php\n".$comment.$this->_compilPHP('VARS',$vars,'arraykey')."\n?>";
		file_put_contents($file,$php);
	}

	 /**
	 *
	 * Création du code déclarant les variables au format PHP
	 *
	 * @param string $name Nom de la variable
	 * @param mixed $vars variable à représenter
	 * @param string $key Type de mise en forme (arraykey => tableau avec clés,
	 * array => tableau simple niveau, const => constante, var => variable simple)
	 * @return array
	 */
	private function _compilPHP($name,$vars,$key) {
		switch($key){
				case 'arraykey':
						$str = "\n\$".$name." = ".var_export($vars, true).";\n";
				break;
				case 'array':
						$str = "\n\$".$name." = ".preg_replace("/'?\w+'?\s+=>\s+/", '', var_export($vars, true)).";\n";
				break;
				case 'const':
						$str = "\ndefine('".$name."',".var_export($vars, true).");\n";
				break;
				case 'string':
				case 'bool':
				case 'integer':
				case 'float':
						$str = "\n\$".$name." = ".var_export($vars, true).";\n";
				break;
		}
		return $str;
	}

	/**
	 *  Enregistrement en PHP de variable multiples
	 *
	 * @param string $file Nom du fichier
	 * @param string $comment Commentaire de l'entête du fichier
	 */
	public function _saveMultiplestoPHP($file,$vars, $comment){
		$php = "<?php\n";

		if($comment!='')
			$php .= "/* ".$comment." */\n";

		foreach($vars as $k => $v){
			if(isset($v['type'])){
				if(isset($v['comment']))
					$php .= "\n/* ".$v['comment'].' */';
				$php .= $this->_compilPHP($k,$v['val'],$v['type']);
			}
		}
		$php .= "\n?>";
		file_put_contents($file,$php);
	}

}
?>
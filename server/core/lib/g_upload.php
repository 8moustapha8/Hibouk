<?php
/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Upload de fichiers
 *
 *
 * @package Gallina °)>
 * @subpackage core (g_)
 */
class g_upload {

	/**
	 * Nom d'origine du fichier
	 *
	 * @var string
	 */
	private $_name = '';

	/**
	 * Nouveau nom
	 *
	 * @var string
	 */
	private $_new_name = '';

	/**
	 * Nom temporaire du fichier dans le dossier temporaire du système
	 *
	 * @var string
	 */
	private $_tmp_name = '';

	/**
	 * Type MIME du fichier
	 *
	 * @var string
	 */
	private $_type = '';

	/**
	 * Code d'erreur
	 *
	 * @var string
	 */
	private $_error = '';

	/**
	 * Extensions autorisées
	 *
	 * @var array
	 */
	private $_extensions = array();

	/**
	 * Dossier de déplacement des fichiers
	 *
	 * @var array
	 */
	private $_dir = '';

	/**
	 * Extension du fichier
	 *
	 * @var string
	 */
	private $_file_extension = '';

	/**
	 * Constructeur
	 *
	 * @param string $file nom du fichier uploadé
	 * @param array $extensions liste des extensions (en minuscule)
	 */
	public function __construct($file,$extensions,$dir){
		$this->_tmp_name = $_FILES[$file]['tmp_name'];
		$this->_name = $_FILES[$file]['name'];
		$this->_new_name = pathinfo($this->_name,  PATHINFO_FILENAME);
		$this->_type = $_FILES[$file]['type'];
		$this->_error = $_FILES[$file]['error'];
		$this->_extensions = $extensions;
		$this->_dir = $dir;
	}

	/**
	 * Change le nom du fichier
	 *
	 * @param string $name nom du fichier
	 */
	public function setName($name){
		$this->_new_name = $name;
	}

	/**
	 * Retourne l'adrresse du fichier
	 *
	 */
	public function getfile(){
		return $this->_dir.$this->_new_name.'.'.$this->_file_extension;
	}

	public function getName (){
		return $this->_new_name.'.'.$this->_file_extension;
	}

	public function getExtension (){
		return $this->_file_extension;
	}

	/**
	 * Upload
	 *
	 */
	public function uploading(){
		// Indique si le fichier a été téléchargé par HTTP POST
		if (is_uploaded_file($this->_tmp_name)) {
			// extension valide
			$this->_file_extension = strtolower(pathinfo($this->_name,  PATHINFO_EXTENSION));
			if(in_array($this->_file_extension, $this->_extensions)) {
				// déplacement du fichier
				$this->_new_name = preg_replace("/[^a-zA-Z0-9\.]/", "_", $this->_new_name);
				if(move_uploaded_file($this->_tmp_name, $this->_dir.$this->_new_name.'.'.$this->_file_extension))
					return errors::inner();
				else
					return errors::inner('g-uploadMoveFile','Err-g-31');
			} else {
				return errors::inner('g-uploadExtension','Err-g-32');
			}
		} else {
			switch($this->_error){
				case 1: //Le fichier dépasse la limite autorisée par le serveur (fichier php.ini) UPLOAD_ERR_INI_SIZE
					return errors::inner('g-UPLOAD_ERR_INI_SIZE','Err-g-33');
				break;
				case 2: //Le fichier dépasse la limite autorisée dans le formulaire HTML UPLOAD_ERR_FORM_SIZE
					return errors::inner('g-UPLOAD_ERR_FORM_SIZE','Err-g-34');
				break;
				case 3: //L'envoi du fichier a été interrompu pendant le transfert UPLOAD_ERR_PARTIAL
					return errors::inner('g-UPLOAD_ERR_PARTIAL','Err-g-35');
				break;
				case 4: //Le fichier que vous avez envoyé a une taille nulle UPLOAD_ERR_NO_FILE
					return errors::inner('g-UPLOAD_ERR_NO_FILE','Err-g-36');
				break;
				case 6: //Valeur : 6. Un dossier temporaire est manquant. Introduit en PHP 5.0.3. UPLOAD_ERR_NO_TMP_DIR
					return errors::inner('g-UPLOAD_ERR_NO_TMP_DIR','Err-g-37');
				break;
				case 7: //Valeur : 7. Échec de l'écriture du fichier sur le disque. Introduit en PHP 5.1.0.  UPLOAD_ERR_CANT_WRITE
					return errors::inner('g-UPLOAD_ERR_CANT_WRITE','Err-g-38');
				break;
				case 8: //Valeur : 8. Une extension PHP a arrété l'envoi de fichier. 
								// PHP ne propose aucun moyen de déterminer quelle extension est en cause. 
								// L'examen du phpinfo() peut aider. Introduit en PHP 5.2.0.   UPLOAD_ERR_EXTENSION
					return errors::inner('g-UPLOAD_ERR_EXTENSION','Err-g-39');
				break;
				default:
					return errors::inner('g-uploadInconnu','Err-g-40',$this->_error);
				break;
			}
			return false;
		}
	}
}
?>
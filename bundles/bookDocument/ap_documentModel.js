/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_documentModel
 */
define('bdl/bookDocument/ap_documentModel', function() {

	var DocumentModel = {

		documentIO : null,

		uploadfile : null,

		tranformStyle : null,

		init : function ( documentIO, uploadfile, tranformStyle ) {
			DocumentModel.documentIO = documentIO;
			DocumentModel.uploadfile = uploadfile;
			DocumentModel.tranformStyle = tranformStyle;
		}

		/*
		chargement : récupération des liens

		suppression : dialogue

		sauvegarde :

			mise à jour des dépendances pour le manifeste :
				- médias (images/vidéos/sons)
				- js
				- css

			return : {
				manifest
				spine
			}

		 */
	};
	return DocumentModel;
});
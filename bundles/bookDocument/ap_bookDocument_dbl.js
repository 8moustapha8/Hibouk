/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Boostrap bundle bookDocument
 */
$bundles('appli', 'bookDocument', function(DocumentModel, documentIO, documentView) {

	// initalisations
	DocumentModel.init(documentIO,'index.php?module=ap_book&act=uploadfile',TRANFORMSTYLE);
	documentView.init(DocumentModel);

	// la suite
	__loadNextFile();
});
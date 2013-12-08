/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Boostrap bundle bookToc
 */
$bundles('appli', 'bookToc', function(TocModel, tocIO, tocView) {
	// initalisations
	tocIO.init('index.php', 'ap_book');
	TocModel.init(tocIO);
	tocView.init(TocModel);

	// la suite
	__loadNextFile();
});
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle bookMetaData
 */
$bundles('appli', 'bookMetaData', function(metaDataView) {
	// initalisations
	metaDataView.init();

	// la suite
	__loadNextFile();
});
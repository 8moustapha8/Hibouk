/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle edition
 */
$bundles('appli', 'edition', function(editionView) {
	// initalisation
	editionView.init();

	// la suite
	__loadNextFile();
});
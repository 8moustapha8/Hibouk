/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle PackagesAplli
 */
$bundles('packagesAplli', 'PackagesAplli', function( PackagesAplli ) {
	// initalisations
	PackagesAplli.init('index.php', 'ap_packagesAppli');

	// la suite
	__loadNextFile();
});
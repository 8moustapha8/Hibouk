/**
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle bundlecreat
 */

$bundles('bundlecreat', 'bundlecreat', function( bundlecreat ) {
	// initalisations
	bundlecreat.init();

	// la suite
	__loadNextFile();
});
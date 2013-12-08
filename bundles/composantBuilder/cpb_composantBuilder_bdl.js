/**
 * @package composantBuilder
 * @subpackage composantBuilder (cpb_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle composantBuilder
 */
$bundles('composantBuilder', 'composantBuilder', function( composantBuilder ) {
	// initalisations
	composantBuilder.init();

	// la suite
	__loadNextFile();
});
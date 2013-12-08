/**
 * @package EpubToPDF
 * @subpackage pkepubtotpdf (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle pkepubtotpdf
 */
$bundles('pkepubtotpdf', 'pkepubtotpdf', function( pkepubtotpdf, HPDF  ) {
	// initalisations
	pkepubtotpdf.init('index.php','etp_epubtopdf',HPDF);

	// la suite
	__loadNextFile();
});
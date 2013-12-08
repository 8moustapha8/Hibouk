/**
 * @package EpubToPDF
 * @subpackage EpubToPDF (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle epubtopdf
 */
define('bdl/epubtopdf/etp_epubtopdf_bdl',function() {
	$bundles.register('ePubToPDF','ePubToPDF',{
		load : function( epubtopdf, HPDF ) {
			// initalisations
			epubtopdf.init('index.php','etp_epubtopdf', HPDF);
		},
		unload : function( epubtopdf ){
			epubtopdf.unload();
		}
	});
	// la suite
	setTimeout(function(){
		__loadNextFile();
	}, 500);
});
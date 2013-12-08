/**
 * @package EpubCheck
 * @subpackage EpubCheck (ec_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle epubcheck
 */
define('bdl/epubcheck/ec_epubcheck_bdl',function() {
	$bundles.register('ePubCheck','ePubCheck',{
		load : function( epubcheckView ) {
			// initalisations
			epubcheckView.init();
		},
		unload : function( epubcheckView ){
			epubcheckView.unload();
		}
	});
	// la suite
	setTimeout(function(){
		__loadNextFile();
	}, 500);
});
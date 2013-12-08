/**
 * @package Liseuse
 * @subpackage liseuse (lis_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle bookEpubview
 */
define('bdl/epubview/lis_bookEpubview_bdl',function() {
	$bundles.register('Visualization','Visualization',{
		load : function( epubviewView ) {
			// initalisations
			epubviewView.init();
		},
		unload : function( epubviewView ){
			epubviewView.unload();
		}
	});
	// la suite
	setTimeout(function(){
		__loadNextFile();
	}, 500);
});
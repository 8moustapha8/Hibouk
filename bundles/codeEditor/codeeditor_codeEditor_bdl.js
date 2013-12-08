/**
 * @package codeEditor
 * @subpackage codeEditor (codeeditor_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap bundle codeEditor
 */
define('bdl/codeEditor/codeeditor_codeEditor_bdl',function() {
	$bundles.register('codeEditor','codeEditor',{
		load : function( codeEditorView ) {
			// initalisations
			codeEditorView.init();
		},
		unload : function( codeEditorView ){
			codeEditorView.unload();
		}
	});
	setTimeout(function(){
		__loadNextFile();
	}, 500);
});
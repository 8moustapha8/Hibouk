/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_metaDataView
 */
define('bdl/bookMetaData/ap_metaDataView',function() {

	var view = {

		initEvents : function () {
			// events
			var book_metadata = document.getElementById('book_metadata');
			$notify.sub('book/load', function(attr){
				book_metadata.insertComponent('replace',attr.epubopf.getMetadata());
				book_metadata.querySelector('opf\\:metadata').init(attr.epubopf);
				return [attr];
			});
			$notify.sub('book/close', function(metadata){
				book_metadata.querySelector('opf\\:metadata').close();
				return [metadata];
			});
		}
	};

	// ------------------------------------------------------------------

	var metaDataView = {
		init : function () {
			view.initEvents();
		},
	};
	return metaDataView;
});
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookView
 */
define('bdl/book/ap_bookView',function() {

	var view = {

		initEvents : function (statusURL,bundles) {

			// status
			$req('i18n!cp/statusselect/locale/cp_statusselect.json!default:en-EN', function(_statuslist) {
				document.getElementById('book_statusselect').init(_statuslist,statusURL);
			});

			// cloture d'un livre en édition
			document.getElementById('book_close').command = function (event) {
				bookView.closeBook();
			};

			document.getElementById('book_save').command = function (event) {
				bookView.saveBook();
			};

			// exporter un livre (epub)
			document.getElementById('book_export').command = function (event) {
				bookView.epubMake();
			};

			var book_checkselect = document.getElementById('book_checkselect');
			book_checkselect.init(bundles);

			book_checkselect.addEventListener('itemCheck', function (ev) {
				var v = ev.detail.value;
				if(ev.detail.checked)
					$bundles.load(v,v);
				else
					$bundles.unload(v,v);
			});
		}
	};

	// ------------------------------------------------------------------

	var bookView = {

		BookModel : null,

		init : function ( BookModel, statusURL ) {
			bookView.BookModel = BookModel;
			var bundles = {};
			for(var bundle in BUNDLESFILES) {
				if(BUNDLESFILES[bundle].type=='extend')
					bundles[bundle] = bundle;
			}
			view.initEvents(statusURL,bundles);
		},

		closeBook : function ( ) {
			bookView.BookModel.closeBook();
		},

		saveBook : function ( ) {
			bookView.BookModel.saveBook(false,true,function(){});
		},

		epubMake : function ( ) {
			$func.saveBook(true,true,function(isSave){
				if(isSave){
					$func.epubMake(true);
				} else {
					_Msg.hide();
				}
			});
		}
	};
	return bookView;
});
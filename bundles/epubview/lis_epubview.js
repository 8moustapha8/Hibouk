/**
 * @package Liseuse
 * @subpackage liseuse (lis_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module lis_epubview
 */
define('bdl/epubview/lis_epubview',function() {

	var _notifySelected = _notifyEdit = _notifyRefresh = null;

	var view = {

		initEvents : function () {
			var epubliseuse = document.getElementById('book_epubview_epubliseuse');
			// redimensionnement de l'interface
			document.getElementById('book_epubview').addEventListener('resizeh', function () {
				setTimeout(function(){
					epubliseuse.setAttribute('height',epubliseuse.getAttribute('height'));
					epubliseuse.setAttribute('width',epubliseuse.getAttribute('width'));
				}, 300);
			});

			var book_tab_epubview = document.getElementById('book_tab_epubview');
			var docPreview = document.getElementById('book_doc_preview');

			var _buttonPreview = function (itemrefSelected) {
				if(itemrefSelected==null)
					hrefFile = null;
				else
					hrefFile = itemrefSelected.href;

				$func.inactivated(docPreview,hrefFile);
			};

			_buttonPreview($func.getItemrefSelected());

			var _book_doc_preview = function (hrefFile) {
				if (hrefFile!=null)
					epubliseuse.setAttribute('src',$func.opfDirname()+hrefFile);
			};

			docPreview.command = function () {
				_book_doc_preview($func.getItemrefSelected().href);
				$func.dispatchEvent('MouseEvents','click',book_tab_epubview);
			};

			_notifySelected = $notify.sub('itemref/selected', function(itemrefSelected){
				_buttonPreview(itemrefSelected);
				return [itemrefSelected];
			});

			_notifyEdit = $notify.sub('itemref/dblclick', function(itemrefSelected){
				if(document.getElementById('epubviewTab').getAttribute('selected')=='true')
					_book_doc_preview(itemrefSelected.href);
				return [itemrefSelected];
			});

			_notifyRefresh = $notify.sub('book/refresh', function(){
				epubliseuse.refrech();
			});
		},

		unload : function () {
			$notify.unSub(_notifySelected[0],_notifySelected);
			$notify.unSub(_notifyEdit[0],_notifyEdit);
			$notify.unSub(_notifyRefresh[0],_notifyRefresh);
			var elems = [
					document.getElementById('epubvieaTabpanel'),
					document.getElementById('book_doc_preview'),
					document.getElementById('epubviewTab')
			];
			elems.forEach(function(el){
				el.parentNode.removeChild(el);
			});
		},
	};

	// ------------------------------------------------------------------

	var epubviewView = {
		init : function () {
			view.initEvents();
		},
		unload : function () {
			view.unload();
		},
	};
	return epubviewView;
});
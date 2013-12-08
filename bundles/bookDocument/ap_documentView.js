/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_documentView
 */
define('bdl/bookDocument/ap_documentView',function() {

	var _notifySaveCover = null;

	var _epubController = null;

	var _epubVersion = 2;

	var coverOPF = {

		init : function ( epubController ) {
			var _this = this;
			_epubController = epubController;
			_epubController.register('cover',_this);
			_epubVersion = _epubController.getEpubVersion();
			var coverTXT = document.getElementById('strbundles').getText('documentCover');

			_notifySaveCover = $notify.sub(_epubController.getTargetSave(), function(obj){
				obj.msg(coverTXT);
				var c = _epubController.getCover();

				if(c.id!=undefined) {
					obj.meta += '\t\t<meta name="cover" content="'+c.id+'"/>\n';
					obj.manifest[c.href] = c;
				}
				return [obj];
			});
		},

		close : function () {
			_epubController = null;
			$notify.unSub(_notifySaveCover[0],_notifySaveCover);
			_notifySaveCover = null;
		}
	};

	var view = {

		initEvents : function () {

			var idref = null;
			var _itemrefSelected = null;
			var docFileDel = document.getElementById('book_doc_file_del');
			var book_doc_spine = document.getElementById('book_doc_spine');
			var menu_popup_guide = document.getElementById('menu_popup_guide');

			// suppression d'un item
			docFileDel.command = function (event) {
				if(idref){
					book_doc_spine.querySelector('opf\\:spine').delItemref(idref);
					$notify.pub('itemref/del',[_itemrefSelected]);
					_itemrefSelected = null;
					$notify.pub('itemref/selected',[_itemrefSelected]);
				}
			};
			book_doc_spine.addEventListener('selected', function (ev) {
				_itemrefSelected = ev.detail;
				idref = ev.detail.idref;
				if(ev.detail.idref)
					docFileDel.removeAttribute('inactivated');
				else
					docFileDel.setAttribute('inactivated','true');

				$notify.pub('itemref/selected',[_itemrefSelected]);
			});

			$func['getItemrefSelected'] = function() {
				return _itemrefSelected;
			};

			$func['insertSpineItem'] = function ( idref, href, mediaType, guideType, position ) {
				book_doc_spine.querySelector('opf\\:spine').insertNewItem(idref,href,mediaType,guideType,position);
			};

			// menu popup pour le guide
			var _itemref;
			var opf_itemref = JSElem.namespace.getComponentName('http://www.idpf.org/2007/opf','itemref');
			JSElem.tags[opf_itemref].events['contextmenu'] = function (event) {
				_itemref = event.currentTarget;
				menu_popup_guide.show(event);
			};
			JSElem.tags[opf_itemref].events['dblclick'] = function (event) {
				$notify.pub('itemref/dblclick',[_itemrefSelected]);
			};

			menu_popup_guide.addEventListener('click', function (event) {
				var element = event.originalTarget;
				if(element.tagName!='CP:MENUITEM')
					 element = element.parentNode;
				_itemref.setAttribute('guidetype',element.getAttribute('value'));
			});

			$notify.sub('book/load', function(attr){
				book_doc_spine.insertComponent('replace',attr.epubopf.getSpine());
				book_doc_spine.querySelector('opf\\:spine').init(attr.epubopf);
				coverOPF.init(attr.epubopf);
				return [attr];
			});

			$notify.sub('book/close', function(metadata){
				_itemrefSelected = null;
				$notify.pub('itemref/selected',[_itemrefSelected]);
				book_doc_spine.querySelector('opf\\:spine').close();
				coverOPF.close();
				return [metadata];
			});

			// Import
			document.getElementById('book_doc_file_import').command = function (event) {
				$bundles('appli', 'bookImportfiles', function( dialog ) {
					var url = documentView.DocumentModel.uploadfile+'&id='+$func['bookID']();
					dialog.init(url,_epubController,documentView.DocumentModel.tranformStyle);
					$notify.pub('book/import/files',[_epubController]);
				});
			};
		}
	};

	// ------------------------------------------------------------------

	var documentView = {

		DocumentModel : null,

		init : function ( DocumentModel ) {
			documentView.DocumentModel = DocumentModel;
			view.initEvents();
		}
	};

	return documentView;
});
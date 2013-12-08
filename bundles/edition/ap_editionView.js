/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_editionView
 */
define('bdl/edition/ap_editionView',function() {

	var view = {

		initEvents : function () {

			var cp_editor = document.getElementById('cp_editor');
			var onglets = document.getElementById('edition_onglets');
			var levels = document.getElementById('edition_levels');
			var vbox1 = document.getElementById('edition_vbox1');
			var docEdit = document.getElementById('book_doc_edit');
			var tabEdition = document.getElementById('book_tab_edition');
			var docSpine = document.getElementById('book_doc_spine');
			var attrs = document.getElementById('edition_attrs');

			attrs.filters = ['_treelist_','contenteditable'];
			var edition_hbox = document.getElementById('edition_hbox');

			// redimensionnement de l'interface
			var parent_edition_hbox = edition_hbox.parentNode.parentNode.parentNode;
			var _getEditSizeHeight = function(){
				return (parent_edition_hbox.clientHeight - (onglets.clientHeight+levels.clientHeight+document.getElementById('edition_toolsBar').clientHeight)-4)+'px';
			};
			cp_editor.composer.getResizeHeight = _getEditSizeHeight

			edition_hbox.addEventListener('resizeh', function () {
				setTimeout(function(){
					var pH = parent_edition_hbox.clientHeight + 'px';

					vbox1.style.height = pH;

					document.getElementById('edition_vbox2').style.height = pH;
					document.getElementById('edition_splitter').style.height = pH;
					attrs.style.height = (parent_edition_hbox.clientHeight - 2) + 'px';

					document.getElementById('edition_hbox_levels').style.height = '31px';
					var editSize = _getEditSizeHeight();
					document.getElementById('edition_edit').style.height = editSize;

					cp_editor.composer.resize(editSize);

					var w = vbox1.clientWidth + 'px';
					onglets.style.width = w;
					levels.style.width = w;

				}, 300);
			}, false);

			// sélection de l'onglet édition
			// redessine la page
			tabEdition.addEventListener('click', function () {
				$func.dispatchEvent('Event','resize',window);
			}, false);
			// sélection d'un item dans le spine

			$notify.sub('itemref/selected', function(itemrefSelected){
				var data = null;
				if(itemrefSelected!=null)
					data = itemrefSelected.href;
				$func.inactivated(docEdit,data);
				return [itemrefSelected];
			});

			$notify.sub('itemref/dblclick', function(itemrefSelected){
				if(document.getElementById('bookTabEdition').getAttribute('selected')=='true')
					_docEdit(itemrefSelected.href);
				return [itemrefSelected];
			});

			// édition d'un élément du spine
			var _docEdit = function (href) {

				var file = $func.opfDirname()+href;
				var sd = '';
				file.split('/').forEach(function(e,i){
					if(i>0)
						sd += '../';
				});

				// savoir si le fichier n'est pas déjà édité
				if(!cp_editor.composer.isAdd(href)) {
					cp_editor.composer.add(file, href, 'true', sd+'components/editor/cp_editorIframe.css',null, 'html' );
					cp_editor.composer.show(href);
					onglets.insertComponent('beforeend','<cp:scrollbaronglet href="'+file+'" name="'+href+'"/>');
				}
				$func.dispatchEvent('Event','resize',window);
				$func.dispatchEvent('MouseEvents','click',onglets.querySelector('cp\\:scrollbaronglet[name="'+href+'"]'));
			};
			docEdit.command = function (event) {
				_docEdit($func.getItemrefSelected().href);
				$func.dispatchEvent('MouseEvents','click',tabEdition);
			};

			// class temporaire (survolement des block => components/editor/cp_editorIframe.css)
			cp_editor.composer.addClassTmp('__Inspector__');
			cp_editor.composer.addClassTmp('__Pointer__');
			cp_editor.composer.addClassTmp('__Effect__');

			// sélection/suppression depuis les onglets
			var _delEdit = function(_file) {
				var r = cp_editor.composer.del(_file);
				var bo = onglets.querySelector('cp\\:scrollbaronglet[name="'+_file+'"]')
				if(bo)
					bo.parentNode.removeChild( bo );
				if(r) {
					onglets.querySelector('cp\\:scrollbaronglet[name="'+r+'"]').show();
					cp_editor.composer.show(r);
					selectedFile = r;
				} else {
					selectedFile = null;
				}
			};
			var selectedFile = null;
			onglets.addEventListener('selectedChange', function (ev) {
				if(ev.detail.name!=null && ev.detail.name!=selectedFile) {
					cp_editor.composer.show(ev.detail.name);
					selectedFile = ev.detail.name;

					$func.dispatchEvent('MouseEvents','click',docSpine.querySelector('opf\\:itemref[href="'+ev.detail.name+'"]'));
				} else if(ev.detail.name==null && selectedFile!=null) {
					_delEdit(selectedFile);
				}
			});

			// affichage de l'arbre des éléments
			var attrShow = null;

			// néttoyage de l'arbre des éléments
			cp_editor.notify.sub('composer:show',function(data){
				levels.clear();
				attrs.show(null);
				var activeID = cp_editor.composer.getActiveID();
				if(selectedFile!=activeID){
					selectedFile = activeID;
					var o = onglets.querySelector('cp\\:scrollbaronglet[name="'+activeID+'"]');
					if(o)
						o.show();
				}
				return [data];
			});

			cp_editor.notify.sub('composer:toogleView',function(data){
				levels.clear();
				attrs.show(null);
				return [data];
			});

			cp_editor.notify.sub('composer:empty',function(){
				levels.clear();
				attrs.show(null);
			});

			cp_editor.notify.sub('document:treeChange',function(data){
				levels.clear();
				attrs.show(null);
				if(data.nodes) {
					attrShow = true;
					var n = data.nodes.length-1;
					[].forEach.call(data.nodes,function(el,i) {
						var x = document.createElement("cp:scrollbarelement");
						x.setAttribute("name", el.nodeName);
						levels.appendChild(x);
						x.init(el,i);
						if (i!=n)
							levels.appendChild(document.createTextNode("❭"));
						else
							x.activate();
					});
				}
				return [data];
			});

			levels.addEventListener('treeActivate', function (ev) {
				attrs.show(ev.target.elementTarget);
			});
			// nouvelle node sélectionnée affichage des attributs
			levels.addEventListener('selectedTreeChange', function (ev) {
				cp_editor.composer.setSelectedNodes([ev.target.elementTarget],ev.target.elementIndex);
				attrs.show(ev.target.elementTarget);
			});

			attrs.addEventListener('contextmenu', function (ev) {
				if(attrShow)
					document.getElementById('menu_popup_attrs').show(ev);
			}, false);

			document.getElementById('menu_popup_new_attr').addEventListener('click', function (ev) {
				attrs.newAttr();
			}, false);

			$bundles('appli', 'editionToolbar', function( toolBar ) {
				$req('i18n!bdl/edition/locale/ap_editionToolbar!default:en-EN', function(_lang) {
	 				toolBar.init(_lang);
	 			});
			});

			$notify.sub('itemref/del', function(data){
				_delEdit(data.href);
				return [data];
			});

			$notify.sub('book/refresh', function(){
				cp_editor.composer.refreshAll();
			});

			$notify.sub('book/close', function(metadata){
				cp_editor.composer.closeAll();
				selectedFile = null;
				[].forEach.call(onglets.querySelectorAll('cp\\:scrollbaronglet'), function (element) {
					element.close();
				});
				levels.clear();
				return [metadata];
			});

			$notify.sub('book/save/depends/after',function(depends){
				cp_editor.composer.getSaves(depends);
				return [depends];
			});
		}
	};

	// ------------------------------------------------------------------

	var editionView = {
		init : function () {
			view.initEvents();
		}
	};
	return editionView;
});
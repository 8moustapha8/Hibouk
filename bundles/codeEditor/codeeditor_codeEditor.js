/**
 * @package codeEditor
 * @subpackage codeEditor (codeEditor_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module codeeditor_codeEditor
 */
define('bdl/codeEditor/codeeditor_codeEditor',function() {

	var _ajax = _notifyLoad = _notifyClose = _notifyEdit = _notifySave = null;

	var insertFiles = function () {
		var _select = document.getElementById('codeEditorFiles');
		var options = '<option value="">'+document.getElementById('strbundles').getText('codeEditor_Files')+'</option>';
		var _addlist = function(_list){
			_list.forEach(function(item){
				options += '<option value="'+item+'">'+item+'</option>';
			});
		};
		_addlist($func.epubopf().getCSSList());
		_addlist($func.epubopf().getJSList());
		
		_select.innerHTML = options;
	};

	var view = {
		initEvents : function () {
			var codeeditor = document.getElementById('cp_codeeditor');
			var onglets = document.getElementById('codeeditor_onglets');
			var codeeditor_hbox = document.getElementById('codeeditor_hbox');
			var select = document.getElementById('codeEditorFiles');
			var parent_codeeditor_hbox = codeeditor_hbox.parentNode.parentNode.parentNode;

			var _getResizeHeight = function(){
				return (parent_codeeditor_hbox.clientHeight-80) + 'px';
			};
			document.getElementById('codeeditor_hbox').addEventListener('resizeh', function () {
				setTimeout(function(){
					var pH = _getResizeHeight();
					codeeditor_hbox.style.height = pH;
					var w = codeeditor_hbox.clientWidth + 'px';
					onglets.style.width = w;
					codeeditor.composer.resize(pH);
				}, 300);
			}, false);
			codeeditor.composer.getResizeHeight = _getResizeHeight;

			// édition d'un élément du spine
			var _editFile = function(href) {

				var file = $func.opfDirname()+href;
				var sd = '';
				file.split('/').forEach(function(e,i){
					if(i>0)
						sd += '../';
				});

				// savoir si le fichier n'est pas déjà édité
				if(!codeeditor.composer.isAdd(href)) {
					codeeditor.composer.add(file, href);
					codeeditor.composer.show(href);
					onglets.insertComponent('beforeend','<cp:scrollbaronglet href="'+file+'" name="'+href+'"/>');
				}
				$func.dispatchEvent('MouseEvents','click',onglets.querySelector('cp\\:scrollbaronglet[name="'+href+'"]'));
			};

			// sélection/suppression depuis les onglets
			var _delEdit = function(_file) {
				var r = codeeditor.composer.del(_file);
				var bo = onglets.querySelector('cp\\:scrollbaronglet[name="'+_file+'"]')
				if(bo)
					bo.parentNode.removeChild( bo );
				if(r) {
					codeeditor.composer.show(r);
					onglets.querySelector('cp\\:scrollbaronglet[name="'+r+'"]').show();
					selectedFile = r;
				} else {
					selectedFile = null;
				}
			};

			select.addEventListener('change', function (ev) {
				if(this.value!='')
					_editFile(this.value);
			}, false);

			var selectedFile = null;
			onglets.addEventListener('selectedChange', function (ev) {
				if(ev.detail.name!=null && ev.detail.name!=selectedFile) {
					codeeditor.composer.show(ev.detail.name);
					selectedFile = ev.detail.name;
				} else if(ev.detail.name==null && selectedFile!=null) {
					_delEdit(selectedFile);
				}
			});

			// fichiers css/js du projet
			insertFiles();

			_notifyLoad = $notify.sub('book/load', function(attr){
				insertFiles();
				return [attr];
			});

			_notifyClose = $notify.sub('book/close', function(metadata){
				codeeditor.composer.closeAll();
				selectedFile = null;
				[].forEach.call(onglets.querySelectorAll('cp\\:scrollbaronglet'), function (element) {
					element.close();
				});
				return [metadata];
			});

			_notifyEdit = $notify.sub('itemref/dblclick', function(itemrefSelected){
				if(document.getElementById('codeEditorTab').getAttribute('selected')=='true')
					_editFile(itemrefSelected.href);
				return [itemrefSelected];
			});

			_notifySave = $notify.sub('book/save/depends',function(depends){
				codeeditor.composer.getSaves(depends);
				return [depends];
			});
		},

		unload : function () {
			$notify.unSub(_notifyLoad[0],_notifyLoad);
			$notify.unSub(_notifyClose[0],_notifyClose);
			$notify.unSub(_notifyEdit[0],_notifyEdit);
			$notify.unSub(_notifySave[0],_notifySave);
			var elems = [
				document.getElementById('codeEditorTab'),
				document.getElementById('codeEditorTabpanel')
			];
			elems.forEach(function(el){
				el.parentNode.removeChild(el);
			});
			document.getElementById('strbundles').rmText('codeEditor_Files')
		},
	};

	// ------------------------------------------------------------------

	var codeEditorView = {
		init : function () {
			view.initEvents();
		},
		unload : function () {
			view.unload();
		},
	};
	return codeEditorView;
});
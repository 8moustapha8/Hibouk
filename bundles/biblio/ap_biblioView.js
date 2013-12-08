/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_biblioView
 */
define('bdl/biblio/ap_biblioView',function() {

	var broadcastBiblio = null;

	var initEvents = function (urlImport) {
		// nouveau livre
		document.getElementById('biblioBookNew').command = function (event) {
			BiblioView.addBook();
		};

		// édition d'un livre
		document.getElementById('biblioBookEdit').command = function (event) {
			BiblioView.editBook();
		};

		// suppression d'un livre
		document.getElementById('biblioBookDel').command = function (event) {
			BiblioView.delBook();
		};

		// cloner un livre
		document.getElementById('biblioBookClone').command = function (event) {
			BiblioView.cloneBook();
		};

		// Import
		var epub = document.getElementById("biblioBookImport");
		var epubElem = document.getElementById("biblioBookImport_epubElem");
		$req('js/lib/g_uploadfiles',function(uploadFiles) {
			var msg = {
				url : urlImport,
				box : '',
				hide : function(){setTimeout(function(){_Msg.hide();},1500);},
				container : "fileupload-container",
				fileInfo : "fileupload-file",
				progressBarContainer : "fileupload-progress-bar-container",
				progressBar : "fileupload-progress-bar",
				percent : "fileupload-progress-percent"
			};
			epub.addEventListener("click", function (e) {
				epubElem.click();
			}, false);

			epubElem.addEventListener("change", function () {
				_Msg.box('<div id="importepubbox" style="width:280px;text-align:center;"></div>');
				msg.box = document.getElementById("importepubbox");
				uploadFiles(this.files,msg,['epub'],function(data) {
					_Msg.hide();
					view.creatBook(data);
				});
			}, false);

		});

		// préférences
		document.getElementById('biblioBookPref').command = function (event) {
			window.location.assign("index.php?module=packages&act=connexion");
		};

		/* ---------------------------------------------------- */
		// notify
		$notify.sub('book/load/after', function(attr){
			view.editBook();
			return [attr];
		});
		$notify.sub('book/close/after', function(metadata){
			view.closeBook();
			var b = document.getElementById('bibliobooks').querySelector('cp\\:bibliobook[id='+_bookSelected+']');
			b.reloadImg();

			if(metadata['title']!=_bookSelectedData['title'])
				b.setAttribute('title',metadata['title']);

			if(metadata['status']!=_bookSelectedData['status'])
				b.setAttribute('status',metadata['status']);

			BiblioView.updateBook(_bookSelected,metadata);
			_bookSelectedData = metadata;
			return [metadata];
		});
	};
	var _bookSelected = _bookSelectedData = null;
	var view = {

		// création d'un livre
		creatBook : function ( data ) {
			var bibliobook = document.createElement('cp:bibliobook');
			var metaData = {};
			for (var attr in data) {
				bibliobook.setAttribute(attr, data[attr]);
				if(metaData!='id')
					metaData[attr] = data[attr];
			}

			bibliobook.addEventListener('click', function (event) {
				view.selectBook(data['id'],metaData);
			}, false);

			bibliobook.addEventListener('dblclick', function (event) {
				view.selectBook(data['id'],metaData);
				BiblioView.editBook();
			}, false);

			document.getElementById('bibliobooks').appendChild(bibliobook);
		},

		// sélection d'un livre
		selectBook : function ( id, data ) {
			_bookSelected = id;
			_bookSelectedData = data;
			document.getElementById('biblioBookCommand').setAttribute('inactivated','false');
		},

		// déselection d'un livre
		unselectBooks : function () {
			_bookSelected = null;
			_bookSelectedData = null;
			document.getElementById('biblioBookCommand').setAttribute('inactivated','true');
		},

		// id du livre sélectionné
		getSelectIdBook : function () {
			return _bookSelected;
		},

		getSelectData : function () {
			return _bookSelectedData;
		},

		// suppression d'un livre
		deleteBook : function ( id ) {
			view.unselectBooks();
			var book = document.getElementById(id);
			book.parentNode.removeChild(book);
		},

		_resizeEvent : function () {
			var ev = document.createEvent('Event');
			ev.initEvent('resize', true, true);
			window.dispatchEvent(ev);
		},

		// édition d'un livre
		editBook : function () {
			document.getElementById('biblioFrame').style.display = 'none';
			document.getElementById('bookFrame').style.display = 'block';
			// on lance resize pour bien placer les éléments
			view._resizeEvent();
		},

		// cloture d'un livre en édition
		closeBook : function () {
			document.getElementById('bookFrame').style.display = 'none';
			document.getElementById('biblioFrame').style.display = 'block';
			// on lance resize pour bien placer les éléments
			view._resizeEvent();
		}
	};

	// ------------------------------------------------------------------

	var BiblioView = {

		biblioModel : null,

		init : function ( biblioModel, urlImport ) {
			BiblioView.biblioModel = biblioModel;
			initEvents(urlImport);
		},

		showBooks : function ( data ) {
			for(var book in data.APPLI_BOOKS)
				view.creatBook(data.APPLI_BOOKS[book]);
		},

		showPage : function ( page ) {
			BiblioView.biblioModel.loadBooks(page,BiblioView.showBooks);
		},

		editBook : function () {
			BiblioView.biblioModel.editBook(view.getSelectIdBook(),view.getSelectData());
		},


		addBook : function () {
			// lecture de models
			BiblioView.biblioModel.modelsBook(function(_models){
				if(Object.keys(_models).length>1) {
					// boite de dialogue (plusieurs models)
					$bundles('appli', 'biblioModels', function( dialog ) {
						dialog.init(_models,function(model){
							BiblioView.biblioModel.addBook(model,view.creatBook)
						});
					});
				} else {
					var model = _models[Object.keys(_models)[0]];
					BiblioView.biblioModel.addBook(model,view.creatBook);
				}
			});
		},

		delBook : function () {
			if (confirm(document.getElementById('strbundles').getText('confirmDelBook')))
				BiblioView.biblioModel.delBook( view.getSelectIdBook(), view.deleteBook );
		},

		updateBook : function ( id,  metaData ) {
			BiblioView.biblioModel.updateBook(id,metaData);
		},

		cloneBook : function () {
			BiblioView.biblioModel.cloneBook(view.getSelectIdBook(),view.getSelectData(),view.creatBook);
		}
	};
	return BiblioView;
});
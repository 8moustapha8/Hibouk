/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_biblioModel
 */
define('bdl/biblio/ap_biblioModel',function() {

	// DEBUG:
	/*
	if(debugMode) {
		$notify.sub('debug/start', function(){
			// chargement d'un livre
			BiblioModel.BookModel.editBook( "hibouk_129", {
				id : "hibouk_129",
				img : "hibouk_129",
				status : "ap_progr",
				title : "Book Start"
			});
			// chargement d'un bundle
			// $bundles.load('ePubToPDF','ePubToPDF');

			// click
			// document.getElementById('book_doc_file_import').click();
		});
	}*/

	var BiblioModel = {
		biblioIO : null,
		BookModel : null,

		init : function ( biblioIO,  biblioView ) {
			BiblioModel.biblioIO = biblioIO;

			// lire la page 1
			biblioView.showPage(1);
		},

		initBookModel : function ( BookModel ) {
			BiblioModel.BookModel = BookModel;
		},

		modelsBook : function ( callbackView ) {
			BiblioModel.biblioIO.modelsBook(callbackView);
		},

		addBook : function ( model, callbackView ) {
			BiblioModel.biblioIO.addBook(model,callbackView);
		},

		delBook : function ( id, callbackView ) {
			BiblioModel.biblioIO.delBook(id,callbackView);
		},

		loadBooks : function ( page, callbackView ) {
			BiblioModel.biblioIO.loadBooks(page,callbackView);
		},

		updateBook : function ( id,  metaData ) {
			BiblioModel.biblioIO.updateBook(id,metaData);
		},

		editBook : function ( id, metaData ) {
			BiblioModel.BookModel.editBook( id, metaData );
		},

		cloneBook : function ( id, metaData, callbackView ) {
			BiblioModel.biblioIO.cloneBook( id, metaData, callbackView );
		}
	};
	return BiblioModel;
});
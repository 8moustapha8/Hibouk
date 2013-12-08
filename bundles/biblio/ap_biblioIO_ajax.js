/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_biblioIO_ajax
 */
define('bdl/biblio/ap_biblioIO_ajax',function() {

	var _ajax = null;

	var _url = '';

	var _module = null;

	var biblioIO = {

		init : function ( url , module ) {
			_url = url;
			_module = module;
		},

		modelsBook : function ( callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'modelsBook'
					},
				success : function (data) {
					callback(data);
				}
			});
		},

		addBook : function ( model, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						model : model,
						act : 'addBook'
					},
				success : function (data) {
					callback(data);
				}
			});
		},

		delBook : function ( id, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'delBook',
						id : id
					},
				success : function (data) {
					callback(id);
				}
			});
		},

		loadBooks : function ( page, callback ) {
			//(mode, url, data, callback )
			if (page==undefined)
				page = 1;

			// vue que c'est la fontion qui va être lancé en premier
			// il faut s'assurer que ajax est chargé
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				__ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'loadBooks',
							page : page
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		},

		updateBook : function ( id,  metaData ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'updateBook',
						id : id,
						metaData : JSON.stringify(metaData)
					},
				success : function (data) {
					//
				}
			});
		},

		cloneBook : function ( id,  metaData, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'cloneBook',
						id : id,
						metaData : JSON.stringify(metaData)
					},
				success : function (data) {
					callback(data);
				}
			});
		}
	};

	return biblioIO;
});
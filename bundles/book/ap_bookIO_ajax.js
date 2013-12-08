/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookIO_ajax
 */
define('bdl/book/ap_bookIO_ajax',function() {

	var _ajax = null;

	var _url = '';

	var _module = null;

	var bookIO = {

		init : function ( url , module ) {
			_url = url;
			_module = module;
		},

		editBook : function ( id, callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'editBook',
							id : id
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		},

		creatFile : function ( id, file, fileContent, cssFiles, title, callback ) {
			fileContent = fileContent.replace( /\&/g,'§eper§').replace( /\+/g,'§plus§');
			_ajax.getJSON({
				url : _url,
				data : {
					module : _module,
					act : 'creatFile',
					id : id,
					file : file,
					title : title,
					cssFiles : JSON.stringify(cssFiles),
					fileContent : fileContent
				},
				success : function (data) {
					callback(data);
				}
			});
		},

		saveFile : function ( id, file, fileContent, callback ) {
			fileContent = fileContent.replace( /\&/g,'§eper§').replace( /\+/g,'§plus§');
			_ajax.getJSON({
				url : _url,
				data : {
					module : _module,
					act : 'saveFile',
					id : id,
					file : file,
					fileContent : fileContent
				},
				success : function (data) {
					callback(data);
				}
			});
		},

		filesDepend : function ( id, files, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'filesDepend',
						id : id,
						files : files
					},
				success : function (data) {
					callback(data);
				}
			});
		},

		filesDependDel : function ( id, files, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'filesDependDel',
						id : id,
						files : files
					},
				success : function (data) {
					callback(data.files,data.key);
				}
			});
		},

		epubMake : function ( id, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'epubMake',
						id : id
					},
				success : function (data) {
					callback(data);
				}
			});
		}
	};

	return bookIO;
});
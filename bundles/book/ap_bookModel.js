/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookModel
 */
define('bdl/book/ap_bookModel',function() {

	var _save = function( bookSaveTmp, msg, creatDepends, refresh, savebookCallback) {

			BookModel.epubopf.save(creatDepends, msg, function(files,savefiles){
				var _final = function() {
					var savefilesLength = savefiles.length-1;
					savefiles.forEach(function(saveF,i){
						BookModel.bookIO.saveFile(BookModel.bookID,saveF.file,saveF.content,function(){
							if(i==savefilesLength){
								setTimeout(function(){
									bookSaveTmp.parentNode.removeChild( bookSaveTmp );
									if(refresh)
									$notify.pub('book/refresh');
									savebookCallback(true);
								},500);
							}
						});
					});
				};

				// dépendances
				if(creatDepends){
					msg(document.getElementById('strbundles').getText('bookUpdateFilesList'));
					BookModel.bookIO.filesDepend(BookModel.bookID,files, function(_files){
						if(_files.length>0){
							// boite de dialogue (plusieurs models)
							$bundles('appli', 'filesDepend', function( dialog ) {
								dialog.init(_files,
									function() { // save
										BookModel.bookIO.filesDependDel(BookModel.bookID,_files, function(){
											_final();
										});
									},
									function(){ // cancel
										bookSaveTmp.parentNode.removeChild( bookSaveTmp );
										savebookCallback(false);
									}
								);
							});
						} else {
							_final();
						}
					});
				} else {
					_final();
				}
			});
	};

	var BookModel = {

		bookIO : null,

		epubopf : null,

		bookID : null,

		bookMetadata : null,

		opfDirname : null,

		init : function ( bookIO ) {
			BookModel.bookIO = bookIO;

			// composant abstrait OPF
			BookModel.epubopf = document.getElementById('book_epubopf');

			$func['saveFile'] = BookModel.bookIO.saveFile;

			$func['creatFile'] = BookModel.bookIO.creatFile;

			$func['saveBook'] = BookModel.saveBook;

			$func['bookID'] = function() {
				return BookModel.bookID;
			};
			$func['epubopf'] = function() {
				return BookModel.epubopf;
			};
			$func['opfDirname'] = function() {
				return BookModel.opfDirname;
			};
			$func['epubHref'] = function (epubDirname) {
				var path = window.location.href;
				return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '')+'/'+epubDirname;
			};
			$func['epubMake'] = function(load,callback) {
				BookModel.epubMake(load,callback);
			};
			$func['locked'] = function() {
				_Msg.message(document.getElementById('strbundles').getText('locked'));
			};
		},

		editBook : function ( id, metadata ) {
			BookModel.bookIO.editBook(id, function(data){
				BookModel.bookID = id;
				BookModel.bookMetadata = metadata;

				// status
				document.getElementById('book_statusselect').setAttribute('status',metadata['status']);
				BookModel.opfDirname = data.opf_dirname;

				// sélection du premier onglet
				document.getElementById('bookTabbox').setAttribute('selectedindex',0);
				BookModel.epubopf.load(id, data.content, 'book/save', data.opf_dirname, data.opf_basename);
				$notify.pub('book/load',[{id:id,epubopf:BookModel.epubopf}]);
			});
		},

		saveBook : function (creatDepends,refresh,savebookCallback) {
			document.body.insertComponent('beforeend', '<cp:dialog id="bookSaveTmp" width="300px" height="150px" title="Sauvegarde" hide="no"><div id="bookSaveTmpMSG" style="margin-top:10px;height:30px;text-align:center;"><img src="images/g_wait.gif"></img><br></br><span class="bibliobookMsg"></span></div></cp:dialog>');

			var bookSaveTmp = document.getElementById('bookSaveTmp');
			bookSaveTmp.getButtons().style.display = 'none';
			var msg = $func.msg(document.getElementById('bookSaveTmpMSG'),6);

			// metadata
			var metadata = BookModel.epubopf.getRegister('metadata');
			// title
			var title = metadata.getMetaData('title');
			var title_txt = '';
			if(title[0]!=undefined)
				title_txt = title[0].val;

			// status
			var status = document.getElementById('book_statusselect').getAttribute('status');

			BookModel.bookMetadata = {
				'title' : title_txt,
				'status' : status
			};

			msg(document.getElementById('strbundles').getText('saveFiles'));
			var depends = [];
			var dependsLength = 0;
			depends = $notify.pub('book/save/depends',[depends]);

			if(depends[0].length==0) {
				_save(bookSaveTmp,msg,creatDepends,false,savebookCallback);
			} else {
				depends[0].forEach(function(item,i){
					$func.saveFile(BookModel.bookID,item.file, item.content,function(){
						dependsLength++;
						if(depends[0].length==dependsLength)
							_save(bookSaveTmp,msg,creatDepends,refresh,savebookCallback);
					});
				});
			}
		},

		epubMake : function (load,callback) {
			_Msg.wait();
			BookModel.bookIO.epubMake(BookModel.bookID,function (data) {
				if(load) {
					_Msg.hide();
					window.location = $func.epubHref(data.file);
				} else {
					callback(data);
				}
			});
		},

		finish : function () {
			$notify.pub('book/close',[BookModel.bookMetadata]);
			BookModel.bookID = null;
			BookModel.opfDirname = null;
			BookModel.bookMetadata = null;
		},

		closeBook : function () {
			if (confirm(document.getElementById('strbundles').getText('confirmSaveBook')))
				BookModel.saveBook(false,false,function(){
					BookModel.finish();
				});
			else
				BookModel.finish();
		}
	};
	return BookModel;
});
/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookImportfiles
 */
define('bdl/dialog/bookImportfiles/ap_bookImportfiles',function() {

	var dialog = {
		init : function (url,_epubController,tranformStyle) {
			var bookImportfilesOK = document.getElementById('bookImportfilesOK');
			bookImportfilesOK.getButtons().style.display = 'none';

			var cover = document.getElementById("bookImportfiles_cover");
			var coverElem = document.getElementById("bookImportfiles_coverElem");

			var text = document.getElementById("bookImportfiles_text");
			var textElem = document.getElementById("bookImportfiles_textElem");

			document.getElementById("bookImportfiles_close").command = function (event) {
				bookImportfilesOK.parentNode.removeChild( bookImportfilesOK );
			};

			cover.addEventListener("click", function (e) {
				coverElem.click();
			}, false);

			coverElem.addEventListener("change", function () {
				var _url = url+'&typefile=img';
				var c = _epubController.getCover();

				if(c.id!=undefined)// remplacement
					_url = _url+'&mv=replace&href='+c.href;
				else
					_url = _url+'&mv=creat';

				var guideAndSpineUpdate = function (data) {
					var spine = _epubController.getRegister('spine');
					spine.delGuidetype('cover');
					spine.insertNewItem( data.id, data.href, data['media-type'], 'cover', 'afterbegin' );
					_epubController.setGuide( data.href, 'Cover', 'cover' );
				};

				_Msg.download(
					_url,
					['jpg','jpeg','png'],
					function(data) {
						//remplacer ou créer nouveau
						_epubController.setCover(data.img);
						guideAndSpineUpdate(data.html);
						bookImportfilesOK.parentNode.removeChild( bookImportfilesOK );
					},
					this.files
				);
			}, false);

			text.addEventListener("click", function (e) {
				textElem.click();
			}, false);

			textElem.addEventListener("change", function () {
				var filesSelected = this.files;
				$bundles('appli', 'bookImportfilesText', function( diaOptions ) {
					diaOptions.init(_epubController,tranformStyle);
					document.getElementById('bookImportfilesTextOK').command = function (event) {
						var values = diaOptions.values();
						if(values.name!=''){
							var _url = url+'&typefile=txt&file='+values.name+'&transform='+values.transform+'&cssfiles='+values.css+'&relativeURL='+values.relativeURL;
							_Msg.download(
								_url,
								['doc','docx','txt','rtf','odt'],
								function(data) {
									// data.filesIMG erreur sur les importations d'images
									$func.insertSpineItem( data.source.id, data.source.href, data.source['media-type'], values.type, 'beforeend');
									bookImportfilesOK.parentNode.removeChild( bookImportfilesOK );
								},
								filesSelected
							);

						} else {
							bookImportfilesOK.parentNode.removeChild( bookImportfilesOK );
						}
					};
				});
			}, false);
		}
	};

	return dialog;
});


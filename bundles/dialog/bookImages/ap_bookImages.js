/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookImages
 */
define('bdl/dialog/bookImages/ap_bookImages',function() {

	var dialog = {
		init : function (command,cp_editor,edition_img) {
			// le dialogue
			var bookImagesOK = document.getElementById('bookImagesOK');
			var importBlock = document.getElementById('bookImagesImport');
			var optionsBlock = document.getElementById('bookImagesOptions');

			edition_img.setAttribute('inactivated','true');

			// Deux types de dialogue importation ou suppression/configuration
			var last = cp_editor.dom('[_treeList_]').last();
			var node = last.elems[0];

			var imgExist = false;
			if(node.nodeName.toLowerCase()=='img')
				imgExist = true;

			if(!imgExist){
				// importation
				importBlock.style.display = 'block';
				var formats = ['bmp','rle','dib','emf','psd','tif','tiff','pict','pct','odg','eps','ps','wmf','jpg','jpeg','png','gif','svg'];
				var bookI_file = document.getElementById("bookImagesImport_file");
				var bookI_caption = document.getElementById('bookImagesImport_caption');

				/*
				TODO:
					- URL (insertion d'une image relative (image exist déjà))
					- figure comme option (image dans le texte)
				{{$url}}<input id="bookImagesImport_url" type="text"/><br/><br/>
				<label>{{$figure}}<input type="checkbox" id="bookImagesImport_figure" checked="checked"></input></label>
				var bookI_url = document.getElementById("bookImagesImport_url");
				*/
				$req('i18n!bdl/dialog/locale/ap_bookImages!default:en-EN', function(_lang) {

					bookI_file.addEventListener("change", function () {
						bookI_file.style.outline = "1px solid transparent";
						var name = bookI_file.files[0].name;
						var extention = name.substring(name.lastIndexOf(".")+1, name.length).toLowerCase();
						if(formats.indexOf(extention) == -1) {
							bookI_file.style.outline = "1px solid red";
							_Msg.message(_lang.error_validate_format_file);
						}
					});

					bookImagesOK.command = function(){
						if($func.validate['getFiles'](bookI_file,_lang.error_validate_files,true)){
							_Msg.download(
								'index.php?module=ap_book&act=uploadImg&id='+$func['bookID'](),
								formats,
								function(data) {
									var imgHTML = '<div class="figure"><div><img alt="" src="'+data.file+'" /></div>';
									if(bookI_caption.value!='')
										imgHTML = imgHTML + '<p class="figcaption">'+bookI_caption.value+'</p>';
									imgHTML = imgHTML + '</div>';
									var first = cp_editor.dom('[_treeList_]').reduce(0);
									first.html('afterend',imgHTML,function(){
									bookImagesOK.parentNode.removeChild( bookImagesOK );
									});
								},
								bookI_file.files
							);
						}
					};
				});
			} else {
				optionsBlock.style.display = 'block';
				var fig = cp_editor.dom('[_treeList_]').filterClassName('figure').last();
				var capt = fig.elems[0].querySelector('.figcaption');

				if(capt==undefined)
					document.getElementById("bookImagesOption_captSpan").style.display = "block";

				bookImagesOK.command = function(){
					var bookI_optcap = document.getElementById("bookImagesOption_caption");
					if(bookI_optcap.value!=''){
						fig.html('beforeend','<p class="figcaption">'+bookI_optcap.value+'</p>',function(){
							bookImagesOK.parentNode.removeChild( bookImagesOK );
						});
					} else {
						bookImagesOK.parentNode.removeChild( bookImagesOK );
					}
				};

				document.getElementById("bookImagesOption_del").addEventListener("click", function () {
					fig.rm();
					bookImagesOK.parentNode.removeChild( bookImagesOK );
				}, false);
			}
		}
	};

	return dialog;
});


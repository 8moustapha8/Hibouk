/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_bookImportfilesText
 */
define('bdl/dialog/bookImportfilesText/ap_bookImportfilesText',function() {

	var _epubController = null, nameElem = null, filesCSS = null, transform = null, guide = null;

	var dialog = {
		init : function ( epubController, tranformStyle ) {
			_epubController = epubController;
			var cssList = _epubController.getCSSList();
			var html = '', disabled = '';
			if(cssList.length==1)
				disabled = ' disabled="disabled" ';
			cssList.forEach(function(v,i) {
				var checked = disabled+' checked="checked"';
				html += '<label><input type="checkbox" name="importfilesText_CSS" value="'+v+'"'+checked+' />'+v+'</label><br />';
			});
			filesCSS = document.getElementById("bookImportfilesText_filesCSS");
			filesCSS.innerHTML = html;

			html = '';
			disabled = '';
			if(tranformStyle.length==1)
				disabled = ' disabled="disabled" ';
			tranformStyle.forEach(function(v,i) {
				var checked = disabled+'';
				if(i==0)
					checked += ' checked="checked"';
				html += '<label><input type="radio" name="importfilesText_transmorm" value="'+v+'"'+checked+' />'+v+'</label><br />';
			});
			transform = document.getElementById("bookImportfilesText_transform");
			nameElem = document.getElementById('bookImportfilesText_nameI');
			guide = document.getElementById('bookImportfilesText_guide');
			transform.innerHTML = html;
		},

		values : function () {
			var name = nameElem.value;
			var type = guide.value;
			var cssSeleted = [];
			var relativeURL = _epubController.relativeURL(name);
			[].forEach.call(filesCSS.querySelectorAll('input:checked'),function(el, i){
				cssSeleted.push(relativeURL+el.value);
			});
			var transformChecked = '';
			[].forEach.call(transform.querySelectorAll('input:checked'),function(el, i){
				transformChecked = el.value;
			});
			return {
				name : $func.stringClear(name),
				css : cssSeleted.join("|"),
				transform : transformChecked,
				relativeURL : relativeURL,
				type : type
			}
		}
	};

	return dialog;
});


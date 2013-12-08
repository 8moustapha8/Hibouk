/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_biblioModels (dialog box)
 */
define('bdl/dialog/biblioModels/ap_biblioModels',function() {

	var dialog = {
		init : function (models,callback) {
			var epubModels = document.getElementById('biblio_epubModels');
			var epubModels_list = document.getElementById("biblio_epubModels_list");
			epubModels.command = function(){
				[].forEach.call(epubModels_list.querySelectorAll('input:checked'),function(el, i){
					callback(el.value);
				});
			};
			var html = '', count = 0;
			for(var name in models){
				var checked ='';
				if(count==0)
					checked = ' checked="checked"';
				count++;
				html += '<label><input type="radio" name="epubModels_select" value="'+models[name]+'"'+checked+' />'+name+'</label><br />';
			}
			epubModels_list.innerHTML = html;
		}
	};

	return dialog;
});


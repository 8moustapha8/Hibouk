/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_filesDepend (dialog box)
 */
define('bdl/dialog/filesDepend/ap_filesDepend',function() {

	var dialog = {
		init : function (_files,callback,cancelBack) {
			var filesDepend = document.getElementById('book_filesDepend');
			var filesDepend_list = document.getElementById("book_filesDepend_list");
			filesDepend.command = function(){
				callback();
			};
			filesDepend.cancel = function(){
				cancelBack();
			};
			var html = '<ul>';
			_files.forEach(function(file){
				html += '<li>'+file+'</li>';
			});
			filesDepend_list.innerHTML = html+'</ul>';
		}
	};

	return dialog;
});


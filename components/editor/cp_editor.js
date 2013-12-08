/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor
 * namespace : http://www.components.org
 */
define('cp/editor/cp_editor',function() {
	(function() {

		var resize = function (me) {
			[].forEach.call(document.querySelectorAll('cp\\:editor'), function (element) {
				element.resize();
			});
		};

		var editor = {

			methods : {
				domString : function () {
					return '<cp:editor' + this.attrToString()+ '></cp:editor>';
				},

				domCreate : function () {
					window.addEventListener('resize', resize, false);

					this.keysCodes = {
						Z_KEY : 90,
						Y_KEY : 89,
						BACKSPACE_KEY : 8,
						DELETE_KEY : 46,
						ENTER_KEY: 13,
						ESCAPE_KEY: 27,
						SPACE_KEY: 32,
					};

					this.UNDOSIZE = 25;
				},

				resize : function () {
					var parent = this.parentNode.parentNode.parentNode;
					setTimeout(function(){
						var h = parent.offsetHeight;
						var w = parent.offsetWidth;
						[].forEach.call(parent.querySelectorAll('iframe'), function (element) {
							element.style.height = h+'px';
							element.style.width = w+'px';
						});
					},400);
				}
			}
		};

		JSElem.register('http://www.components.org','editor',editor);
	}());
});
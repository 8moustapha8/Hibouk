/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composants minibutton, minibuttonsep
 * namespace : http://www.components.org
 */
define('cp/button/cp_minibutton',function() {
	(function() {

		var cp_minibutton = {

			template : '<span class="cp_minibutton_disa"></span>',

			properties : {
				command : {
					set : function (fnc) {
						var _this = this;
						var _fnc = function (event) {
							if(_this.getAttribute('inactivated')!='true') {
								fnc.call(_this,event);
							}
						}
						this.addEventListener('mousedown', _fnc, false);
					}
				}
			}
		};
		JSElem.register('http://www.components.org','minibutton',cp_minibutton);
		JSElem.register('http://www.components.org','minibuttonsep',{});
	}());
});
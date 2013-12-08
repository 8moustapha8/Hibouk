/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant button
 * namespace : http://www.components.org
 */
define('cp/button/cp_button',function() {
	(function() {

		var cp_button = {

			template : '<span class="buttonlabel" anonid="label"></span>',

			methods : {
			    domString : function () {
					return '<cp:button' + this.attrToString()+ '></cp:button>';
				}
			},
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
			},
			attributes : {

				label : {
					/* get : function () {
						return this.getAnonid('label').innerHTML;
					},*/
					set : function (value) {
						this.getAnonid('label').innerHTML = value;
					}
			    }
			}
		};

		JSElem.register('http://www.components.org','button',cp_button);

	}());
});
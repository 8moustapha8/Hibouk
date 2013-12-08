/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant input
 * namespace : http://www.components.org
 */
define('cp/input/cp_input',function() {
	(function() {

		var cp_input = {

			template : '&#160;<input class="cp_input" anonid="input"></input>&#160;',

			methods : {
			    domString : function () {
					return '<cp:input' + this.attrToString()+ '></cp:input>';
				}
			},

			attributes : {

				value : {
					get : function () {
						return this.getAnonid('input').value;
					},
					set : function (value) {
						this.getAnonid('input').value = value;
					}
				},
				type : {
					get : function () {
						return this.getAnonid('input').type;
					},
					set : function (value) {
						var x = this.getAnonid('input');
						x.type = value;
					}
				}
			}
		};

		JSElem.register('http://www.components.org','input',cp_input);

	}());
});
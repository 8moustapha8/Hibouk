/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant buttonseparator
 * namespace : http://www.components.org
 */
define('cp/buttonseparator/cp_buttonseparator',function() {
	(function() {

		var cp_buttonseparator = {

			template : '<span class="buttonseparator"></span>',

			methods : {
			    domString : function () {
					return '<cp:buttonseparator' + this.attrToString()+ '></cp:buttonseparator>';
				}
			}
		};

		JSElem.register('http://www.components.org','buttonseparator',cp_buttonseparator);

	}());
});
/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant scrollbarelement
 * namespace : http://www.components.org
 */
define('cp/scrollbar/cp_scrollbarelement',function() {
	(function() {

		var cp_scrollbarelement = {

			template : '<span anonid="name"></span>',

			methods : {
				init : function ( el, index ) {
					this.elementTarget = el;
					this.elementIndex = index;
				},
				activate : function (){
					this.setAttribute('selected','true');
					this.elementTarget.classList.remove('__Inspector__');
					if(this.elementTarget.classList.length==0)
						this.elementTarget.removeAttribute('class');
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('treeActivate', true, true, {
						element : this
					});
					this.dispatchEvent(event);
				}
			},

			attributes : {

				name : {
					set : function (value) {
						this.getAnonid('name').innerHTML = value;
					}
				},

				selected : {
					set : function (value) {
						var s = this.selected;
						if(s!=value) {
							this.selected = value;
							if(value=='true') {
								[].forEach.call(this.parentNode.querySelectorAll('cp\\:scrollbarelement[selected="true"]'), function (element) {
										element.setAttribute('selected','false');
								});
							}
						}
					}
				},
			},

			events : {
				click : function () {
					this.setAttribute('selected','true');
					this.elementTarget.classList.remove('__Inspector__');
					if(this.elementTarget.classList.length==0)
						this.elementTarget.removeAttribute('class');
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('selectedTreeChange', true, true, {
						element : this
					});
					this.dispatchEvent(event);
				},

				mouseenter : function () {
					this.elementTarget.classList.add('__Inspector__');
				},

				mouseleave : function () {
					this.elementTarget.classList.remove('__Inspector__');
				}
			}
		};
		JSElem.register('http://www.components.org','scrollbarelement',cp_scrollbarelement);
	}());
});
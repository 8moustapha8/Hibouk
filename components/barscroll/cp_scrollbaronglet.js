/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant scrollbaronglet
 * namespace : http://www.components.org
 */
define('cp/scrollbar/cp_scrollbaronglet',function() {
	(function() {

		var cp_scrollbaronglet = {

			template : '<span class="scrollbarongletName" anonid="name"></span><span class="scrollbarongletClose" anonid="close">x</span>',

			methods : {

				domCreate : function () {
					var _this = this;
					this.addEventListener("click", function(event) {
						event.stopPropagation();
						event.preventDefault();
						if(_this.getAttribute('selected')!='true'){
							_this.show();
							var event = document.createEvent("CustomEvent");
							event.initCustomEvent('selectedChange', true, true, {
								name : _this.getAttribute('name'),
								href : _this.getAttribute('href')
							});
							_this.dispatchEvent(event);
						}
					});
					this.getAnonid('close').addEventListener("click", function(event) {
						event.stopPropagation();
						event.preventDefault();
						if(_this.getAttribute('selected')=='true'){
							var event = document.createEvent("CustomEvent");
							event.initCustomEvent('selectedChange', true, true, {
								name : null,
								href : null
							});
							_this.dispatchEvent(event);
							try{
								_this.parentNode.removeChild( _this );
							} catch(e){}
						}
					});
				},

				close : function () {
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('selectedChange', true, true, {
						name : null,
						href : null
					});
					this.dispatchEvent(event);
					try{
						this.parentNode.removeChild( this );
					} catch(e){}
				},

				show : function () {
					[].forEach.call(this.parentNode.querySelectorAll('cp\\:scrollbaronglet[selected="true"]'), function (element) {
							element.setAttribute('selected','false');
					});
					this.setAttribute('selected','true');
				}
			},

			attributes : {
				name : {
					set : function (value) {
						this.getAnonid('name').innerHTML = value.substr(-14);
					}
				}
			}
		};
		JSElem.register('http://www.components.org','scrollbaronglet',cp_scrollbaronglet);
	}());
});
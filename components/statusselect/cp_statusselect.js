/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant statusselect
 * namespace : http://www.components.org
 */
define('cp/statusselect/cp_statusselect', function() {
	(function() {

		var statusselect = {

			template : '<div class="statusselect_button" anonid="b"><div class="statusselect_disa"></div></div><ul anonid="list" class="statusselect_il"></ul>',

			methods : {
				/**
				*/
				domString : function () {
					return '<cp:statusselect' + this.attrToString('id')+ '></cp:statusselect>';
				},
				/**
				*/
				domCreate : function () {},
				/**
				*/
				domInsert : function () {
					var b = this.getAnonid('b');
					var list = this.getAnonid('list');
					var _this = this;
					b.addEventListener('click', function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
						if(_this.getAttribute('inactivated')!='true') {
							var hide = function() {
								document.documentElement.removeEventListener('click', hide, false);
								list.style.display = 'none';
							};
							document.documentElement.removeEventListener('click', hide, false);
							document.documentElement.addEventListener('click', hide, false);
							list.style.display = 'block';
						}
					});
				},

				init : function (obj,url) {
					var _this = this;
					this.url = url;
					var list = this.getAnonid('list');
					var lis = '';
					for(var key in obj){
						lis += '<li value="'+key+'">'+obj[key]+'</li>';
					}
					list.innerHTML = lis;
					[].forEach.call(list.querySelectorAll('li'), function (element) {
						var v = element.getAttribute('value');
						element.style.backgroundImage = 'url('+_this.url+v+'.png)';
						element.addEventListener('click', function(ev) {
							_this.setAttribute('status',v);
							var event = document.createEvent("CustomEvent");
							event.initCustomEvent('change', true, true, {status : v});
							_this.dispatchEvent(event);
						});
					});
				}
			},

			attributes : {
				/**
				*/
				status : {
					set : function (value) {
						var b = this.getAnonid('b').style.backgroundImage = 'url('+this.url+value+'.png)';
					}
				}
			}
		};

		JSElem.register('http://www.components.org','statusselect',statusselect);
	}());
});
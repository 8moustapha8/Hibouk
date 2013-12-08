/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant checkselect
 * namespace : http://www.components.org
 */
define('cp/checkselect/cp_checkselect',function() {
	(function() {

		var checkselect = {

			template : '<div class="checkselect_button" anonid="b"><div class="checkselect_disa"></div></div><ul anonid="list" class="checkselect_il"></ul>',

			methods : {
				/**
				*/
				domString : function () {
					return '<cp:checkselect' + this.attrToString('id')+ '></cp:checkselect>';
				},

				domInsert : function () {
					var b = this.getAnonid('b');
					var list = this.getAnonid('list');
					var _this = this;
					var hide = function() {
						document.documentElement.removeEventListener('click', hide, false);
						list.style.display = 'none';
					};
					b.addEventListener('click', function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
						if(_this.getAttribute('inactivated')!='true') {
							if(list.style.display=='block') {
								hide();
							} else {
								document.documentElement.removeEventListener('click', hide, false);
								document.documentElement.addEventListener('click', hide, false);
								list.style.display = 'block';
							}
						}
					});
				},

				init : function (obj) {
					var _this = this;
					var list = this.getAnonid('list');
					var lis = '';
					for(var key in obj){
						lis += '<li><label><input type="checkbox" value="'+key+'"/>'+obj[key]+'</label></li>';
					}
					list.innerHTML = lis;
					[].forEach.call(list.querySelectorAll('li'), function (element) {
						element.addEventListener('click', function(ev) {
						   ev.stopPropagation();
						});
						element.addEventListener('mousedown', function(ev) {
							ev.stopPropagation();
							var check = this.querySelector('input');
							var v = check.getAttribute('value');
							setTimeout(function(){
								var event = document.createEvent("CustomEvent");
								event.initCustomEvent('itemCheck', true, true, {value : v, checked:check.checked});
								_this.dispatchEvent(event);
							}, 300);
						});
					});
				}
			}
		};

		JSElem.register('http://www.components.org','checkselect',checkselect);
	}());
});
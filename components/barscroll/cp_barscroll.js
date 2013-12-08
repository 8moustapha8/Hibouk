/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant barscroll
 * namespace : http://www.components.org
 */
define('cp/barscroll/cp_barscroll',function() {
	(function() {

		var cp_barscroll = {

			template : '<span anonid="left" class="barscrollbleft">◄</span><span anonid="right" class="barscrollbright">►</span><div anonid="cc" class="barscrollcc"><content class="barscrollcontent"/></div>',

			methods : {
			    domString : function () {
					return '<cp:barscroll' + this.attrToString()+ '>'+this.innerComponent+'</cp:barscroll>';
				},

				clear : function () {
					this.getAnonid('content').innerHTML = '';
				},

				domInsert : function () {
					var timer;
					var right = this.getAnonid('right');
					var left = this.getAnonid('left');
					var content = this.getAnonid('cc');
					var scroll = function (v) {
						content.scrollLeft -= v;
						timer = setTimeout(function(){scroll(v)}, 10);
					};
					right.addEventListener("mousedown", function(evt){
						scroll(-5);
					});
					right.addEventListener("mouseup", function(evt){
						clearTimeout(timer);
					});
					left.addEventListener("mousedown", function(evt){
						scroll(5);
					});
					left.addEventListener("mouseup", function(evt){
						clearTimeout(timer);
					});
				}
			}
		};

		JSElem.register('http://www.components.org','barscroll',cp_barscroll);

	}());
});
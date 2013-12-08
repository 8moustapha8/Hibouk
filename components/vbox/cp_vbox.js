/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant vbox
 * namespace : http://www.components.org
 */
define('cp/vbox/cp_vbox',function() {
	(function() {

		var cp_vbox = {

			resize : function (me) {
				[].forEach.call(document.querySelectorAll('cp\\:vbox[last="true"]'), function (element) {
				    cp_vbox.resizeVboxWidth(element);
				});
				[].forEach.call(document.querySelectorAll('cp\\:vbox'), function (element) {
				    cp_vbox.resizeVboxHeight(element);
				});
			},

			resizeVboxWidth : function (me) {
				var parent = me.parentNode.parentNode.parentNode;
				me.style.width = "50px";// 50px min pour ie
				setTimeout(function(){
					var w = parent.clientWidth-me.offsetLeft;
					if(w>0)
						me.style.width = w+"px";
				}, 100);
			},

			resizeVboxHeight : function (me) {
				var parent = me.parentNode.parentNode.parentNode;
				me.style.height = parent.style.height;
			},

			isIgnorable : function ( nod ){
				// Détermine si un nœud texte est entièrement composé de blancs
				var isAllWs = function ( _nod ) {
					return !(/[^\t\n\r ]/.test(_nod.data));
				}
				return ( nod.nodeType == 8) || ( (nod.nodeType == 3) && isAllWs(nod) );
			},

			nodeAfter : function ( sib ) {
			  while ((sib = sib.nextSibling)) {
			    if (!cp_vbox.isIgnorable(sib)) return sib;
			  }
			  return null;
			},

			template : '<div anonid="vbox" class="cp_vbox"><content/></div>',

			methods : {
				domCreate : function () {
					window.addEventListener('resize', cp_vbox.resize, false);
				},
				domInsert : function () {
					var parent = this.parentNode.parentNode.parentNode;
					if(parent.nodeName.toLowerCase()=="cp:hbox")
						this.parentNode.parentNode.style.padding = '0';
					var _this = this;
					setTimeout(function(){
						if(cp_vbox.nodeAfter(_this)==null) {
							_this.setAttribute('last','true');
							cp_vbox.resizeVboxWidth(_this);
						}
						cp_vbox.resizeVboxHeight(_this);
					}, 100);
				},
			    domString : function () {
					return '<cp:vbox' + this.attrToString()+ '>' + this.getAnonid('content').innerComponent + '</cp:vbox>';
				},
				resizeVboxHeight : function(){
					cp_vbox.resizeVboxHeight(this);

					if(this.getAttribute('last')=='true')
						cp_vbox.resizeVboxWidth(this);
				}
			},

			attributes : {
				innerstyle : {
					get : function () {
						return this.getAnonid('vbox').getAttribute('style');
					},
					set : function (value) {
						this.getAnonid('vbox').setAttribute('style',value);
					}
				}
			}
		};

		JSElem.register('http://www.components.org','vbox',cp_vbox);

	}());
});
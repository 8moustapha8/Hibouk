/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant hbox
 * namespace : http://www.components.org
 */
define('components/hbox/cp_hbox',function() {
	(function() {

		var cp_hbox = {

			resize : function (me) {
				[].forEach.call(document.querySelectorAll('cp\\:hbox[last="true"]'), function (element) {
				    cp_hbox.resizeHbox(element);
				});
			},

			resizeHbox : function (me) {
				var parent = me.parentNode;
				if(parent.nodeName.toLowerCase()=="content") {
					parent = parent.parentNode.parentNode;
					me.style.height = "25px";// 50px min pour ie
					setTimeout(function(){
						var h = parent.clientHeight-me.offsetTop;
						if(h>0)
							me.style.height = h+"px";
					}, 100);
				} else {
					var h = parent.clientHeight-me.offsetTop;
					if(h>0)
						me.style.height = h+"px";
				}

				var ev = document.createEvent('Event');
				ev.initEvent('resizeh', true, true);
    			me.dispatchEvent(ev);
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
			    if (!cp_hbox.isIgnorable(sib)) return sib;
			  }
			  return null;
			},

			template : '<div anonid="hbox" class="cp_hbox"><content/></div>',

			methods : {
				domCreate : function () {
					window.addEventListener('resize', cp_hbox.resize, false);
				},
				domInsert : function () {
					var parent = this.parentNode.parentNode.parentNode;
					if(parent.nodeName.toLowerCase()=="cp:vbox")
						this.parentNode.parentNode.style.padding = '0';
					var _this = this;
					setTimeout(function(){
						if(cp_hbox.nodeAfter(_this)==null) {
							_this.setAttribute('last','true');
							cp_hbox.resizeHbox(_this);
						}
					}, 100);
				},
			    domString : function () {
					return '<cp:hbox' + this.attrToString()+ '>' + this.getAnonid('content').innerComponent + '</cp:hbox>';
				},
				resizeHbox : function(){
					cp_hbox.resizeHbox(this);
				}
			},

			attributes : {
				innerstyle : {
					get : function () {
						return this.getAnonid('hbox').getAttribute('style');
					},
					set : function (value) {
						this.getAnonid('hbox').setAttribute('style',value);
					}
				}
			}
		};

		JSElem.register('http://www.components.org','hbox',cp_hbox);

	}());
});
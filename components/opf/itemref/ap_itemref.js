/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant opf - part itemref
 * namespace : http://www.idpf.org/2007/opf
 */
define('cp/opf/itemref/ap_itemref',function() {
	(function() {

		var opf_itemref = {

			template : '<input type="checkbox" anonid="linear" style="display:none;"></input> <span anonid="href"></span>',

			methods : {
				domString : function () {
					return '\t\t<itemref' + this.attrToString('href','media-type','draggable','style','selected','guidetype')+ '></itemref>';
				},

				domString2 : function () {
					return '<opf:itemref' + this.attrToString('draggable','style','selected')+ '></opf:itemref>';
				},

				getManifest : function () {
					return {
						id : this.getAttribute('idref'),
						href : this.getAttribute('href'),
						'media-type' : this.getAttribute('media-type')
					};
				},

				getType : function () {
					return this.getAttribute('guidetype');
				},

				domInsert : function () {
					this.setAttribute('draggable','true');
					var linear = this.getAttribute('linear');
					if(linear==undefined)
						this.setAttribute('linear','yes');
					var guidetype = this.getAttribute('guidetype');
					if(guidetype==undefined)
						this.setAttribute('guidetype','no');
				}
			},

			attributes : {

				href : {
					set : function (value) {
						this.getAnonid('href').innerHTML = value;
					}
				},

				linear : {
					get : function (value) {
						return this.getAnonid('linear').checked;
					},
					set : function (value) {
						if(value=="yes")
							this.getAnonid('linear').checked = true;
						else
							this.getAnonid('linear').checked = false;
					}
				},
			},

			events : {

				click : function (ev) {
					[].forEach.call(this.parentNode.querySelectorAll('opf\\:itemref[selected="true"]'), function (element) {
				 		element.removeAttribute('selected');
					});
					this.setAttribute('selected','true');
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('selected', true, true, {
						idref : this.getAttribute('idref'),
						guidetype : this.getAttribute('guidetype'),
						'media-type' : this.getAttribute('media-type'),
						linear : this.getAttribute('linear'),
						href : this.getAttribute('href')
					});
					this.dispatchEvent(event);
				},

				dragstart : function (ev) {
					ev.dataTransfer.setData('itemref_idref', this.getAttribute('idref'));
					var _this = this;
					setTimeout(function(){
						_this.style.display = 'none';
					}, 50);
				},

				dragend : function (ev) {
					this.style.display = 'block';
				},

				dragleave : function (ev) {
					this.style.paddingBottom = '0';// bug chrome
					this.removeAttribute('style');
				},

				dragover : function (ev) {
					ev.preventDefault();
					this.style.paddingBottom = '25px';
				},

				drop : function (ev) {
					ev.preventDefault();
					this.style.paddingBottom = '0';// bug chrome
					this.removeAttribute('style');
					var idref = ev.dataTransfer.getData('itemref_idref');
					if(idref!=undefined) {
						var el = this.parentNode.querySelector('opf\\:itemref[idref="'+idref+'"]');
						this.insertComponent('afterend',el.domString2());
						el.parentNode.removeChild( el );
					}
				}

			}
		};

		JSElem.register('http://www.idpf.org/2007/opf','itemref',opf_itemref);

	}());
});
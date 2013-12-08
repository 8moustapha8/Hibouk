/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant tabbox, tabs, tab, tabpanels, tabpanel
 * namespace : http://www.components.org
 */
define('cp/tabbox/cp_tabbox',function() {
	(function() {

		/* -------------------  tabbox  ------------------- */
		var cp_tabbox = {
			resize : function() {
				[].forEach.call(document.querySelectorAll('cp\\:tabbox'), function (element) {
					setTimeout(function(){
						cp_tabbox.resizeH(element);
					}, 200);
				});
			},
			resizeH : function(me) {
				var parent = me.parentNode.parentNode.parentNode;
				var tabpanel = parent.querySelectorAll('cp\\:tabpanel[selected="true"]')[0];
				if(tabpanel){
					var border = tabpanel.offsetHeight-tabpanel.clientHeight;
					me.style.height = (parent.offsetHeight - parent.querySelectorAll('cp\\:tabs')[0].offsetHeight - border)+ 'px';
				}
			},
			template : '<content/>',
			methods : {
				domCreate : function () {
					window.addEventListener('resize', cp_tabbox.resize, false);
				},
				domInsert : function () {
					var _this = this;
					setTimeout(function(){
						cp_tabbox.resizeH(_this);
					}, 300);
				},
			    domString : function () {
					return '<cp:tabbox>' + this.getAnonid('content').innerComponent + '</cp:tabbox>';
				},

				getIndexById : function (value) {
					var x = 0, r = null;
					[].forEach.call(this.querySelectorAll('cp\\:tabs'), function (el) {
						if(el.getAttribute('id')==value)
							r = x;
						x++;
					});
					return r;
				}
			},

			attributes : {
				selectedindex : {
					set : function (value) {
						var tabs = this.querySelectorAll('content > cp\\:tabs')[0];

						var _tabs = [];
						var selectedElTab = null;
						var queryTabs = tabs.querySelectorAll('cp\\:tab');
							for (var i = 0; i < queryTabs.length; i++)
								_tabs.push(queryTabs[i]);
						_tabs.forEach(function(el,i){
							if(i == value){
								el.setAttribute('selected', true);
								selectedElTab = el;
							} else {
								el.removeAttribute('selected');
							}
						});
						var tabpanels = this.querySelectorAll('content > cp\\:tabpanels')[0];
						[].forEach.call(tabpanels.querySelectorAll('content[anonid="content'+tabpanels.tagUID+'"] > cp\\:tabpanel'),function(el, i){
							if(i == value)
								el.setAttribute('selected', true);
							else
								el.removeAttribute('selected');
							[].forEach.call(tabpanels.querySelectorAll('cp\\:hbox[last="true"]'),function(_el){
								_el.resizeHbox();
							});
						});

						var event = document.createEvent("CustomEvent");
						event.initCustomEvent('change', true, true, {
							selectedindex : value, element : selectedElTab
						});
						this.dispatchEvent(event);
					}
				}
			}
		};
		JSElem.register('http://www.components.org','tabbox',cp_tabbox);

		/* -------------------  tabs  ------------------- */
		var cp_tabs = {
			template : '<content/>',
			methods : {
			    domString : function () {
					return '<cp:tabs>' + this.getAnonid('content').innerComponent + '</cp:tabs>';
				}
			}
		};
		JSElem.register('http://www.components.org','tabs',cp_tabs);

		/* -------------------  tab  ------------------- */
		var cp_tab = {
			template : '<span anonid="label"><content/></span>',
			attributes : {
				selected : {}
			},
			methods : {
			    domString : function () {
					return '<cp:tab>' + this.getAnonid('content').innerComponent + '</cp:tab>';
				}
			},
			events : {
			    click : function (event) {
					//event.stopPropagation();
					this.focus();
					var tabs = this.parentNode.parentNode.parentNode;
					var _tabs = [];
					var queryTabs = tabs.querySelectorAll('cp\\:tab');
					for (var i = 0; i < queryTabs.length; i++)
						_tabs.push(queryTabs[i]);

					this.parentNode.parentNode.parentNode.parentNode.setAttribute('selectedindex',_tabs.indexOf(this));
			    }
			}
		};
		JSElem.register('http://www.components.org','tab',cp_tab);

		/* -------------------  tabpanels  ------------------- */
		var cp_tabpanels = {
			template : '<content/>',
			methods : {
			    domString : function () {
					return '<cp:tabpanels>' + this.getAnonid('content').innerComponent + '</cp:tabpanels>';
				}
			}
		};
		JSElem.register('http://www.components.org','tabpanels',cp_tabpanels);

		/* -------------------  tabpanel  ------------------- */
		var cp_tabpanel = {
			template : '<div anonid="tabpanel" class="innertabpanel"><content/></div>',
			attributes : {
				selected : {},
				innerstyle : {
					get : function () {
						return this.getAnonid('tabpanel').getAttribute('style');
					},
					set : function (value) {
						this.getAnonid('tabpanel').setAttribute('style',value);
					}
				}
			},
			methods : {
			    domString : function () {
					return '<cp:tabpanel>' + this.getAnonid('content').innerComponent + '</cp:tabpanel>';
				}
			}
		};
		JSElem.register('http://www.components.org','tabpanel',cp_tabpanel);
	}());
});
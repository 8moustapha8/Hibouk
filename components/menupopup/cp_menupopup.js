/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composants menupopup, menuitem
 * namespace : http://www.components.org
 */
define('cp/menupopup/cp_menupopup', function() {
	(function() {

		// coordonnées de la souris
		var coord = function(ev) {
			scr = ev.target;
			var x = ev.clientX,
				y = ev.clientY;
			while ((scr = scr.parentNode) && scr != document.body) {
				x += scr.scrollLeft || 0;
				y += scr.scrollTop || 0;
			}
			x += document.body.scrollLeft + document.documentElement.scrollLeft;
			y += document.body.scrollTop + document.documentElement.scrollTop;
			/*
			el = ev.target;;
			var L = 0;
			while (el) {
				L += el.offsetLeft;
				el = el.offsetParent;
			}
			x = x - L;*/
			return {
				x: x,
				y: y
			};
		};

		var cp_menupopup = {

			methods: {
				show: function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					var _this = this;

					// cacher le popup
					var hide = function() {
						document.documentElement.removeEventListener('click', hide, false);
						_this.style.display = 'none';
					};
					document.documentElement.removeEventListener('click', hide, false);
					document.documentElement.addEventListener('click', hide, false);
					var c = coord(ev);

					this.style.visibility = 'hidden';
					this.style.display = 'block';
					// positionnement du popup
					var LP = 0;
					if (window.innerWidth - (ev.clientX + this.offsetWidth) < 20) {
						this.style.left = (c.x - this.offsetWidth) + 'px';
						LP = c.x;
					} else {
						this.style.left = c.x + 'px';
						LP = c.x + this.offsetWidth;
					}
					if (window.innerHeight - (ev.clientY + this.offsetHeight) < 20) this.style.top = (c.y - this.offsetHeight) + 'px';
					else this.style.top = c.y + 'px';

					// positionnement des sous menus
					var dir = 'right';

					[].forEach.call(this.querySelectorAll('cp\\:submenu'), function(el, i) {
						// flèche des subitems
						el.parentNode.getAnonid('sub').style.display = 'inline';

						LP += el.offsetWidth;

						if (window.innerWidth - (LP) < 20) dir = 'left';
					});
					[].forEach.call(this.querySelectorAll('cp\\:submenu'), function(el, i) {
						el.style.top = '0';
						var t = el,
							T = 0;
						while (t) {
							T += t.offsetTop;
							t = t.offsetParent;
						}
						T -= document.body.scrollTop + document.documentElement.scrollTop;

						var cT = window.innerHeight - (el.offsetHeight + T);

						if (window.innerHeight - (el.offsetHeight + T) < 0) el.style.top = (cT - 10) + 'px';

						if (dir == 'left') el.style.left = -el.offsetWidth + 'px';
						else el.style.left = el.parentNode.offsetWidth + 'px';
					});

					this.style.visibility = 'visible';
				}
			}
		};

		JSElem.register('http://www.components.org', 'menupopup', cp_menupopup);

		var cp_menuitem = {

			template: '<span anonid="label"></span><span anonid="sub" class="submenuitem">&#160;➤</span>',

			methods: {

			},

			attributes: {
				label: {
					set: function(value) {
						value = value.replace(/ /g, '&#160;');
						this.getAnonid('label').innerHTML = value;
					}
				}
			},

			properties: {
				command: {
					set: function(fnc) {
						var _this = this;
						var _fnc = function(event) {
							if (_this.getAttribute('inactivated') != 'true') {
								fnc.call(_this, event);
							}
						}
						this.addEventListener('click', _fnc, false);
					}
				}
			}
		};

		JSElem.register('http://www.components.org', 'menuitem', cp_menuitem);
	}());
});
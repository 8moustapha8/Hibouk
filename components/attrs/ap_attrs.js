/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composants attrs, attr
 * namespace : http://www.components.org
 */
define('cp/attrs/ap_attrs',function() {
	(function() {

		var cp_attrs = {

			methods : {

				show : function (el) {
					var _this =this;
					this.innerHTML = '';
					this.elementTarget = el;
					if(el!=null){
						[].forEach.call(el.attributes, function(attr) {
							var attrName = attr.nodeName.toLowerCase();
							if(_this._filters.indexOf(attrName)==-1){
								var at = document.createElement('cp:attr');
							at.setAttribute('name',attrName);
							at.setAttribute('value',attr.value);
							_this.appendChild(at);
						}
						});
					}
				},

				newAttr : function () {
					var at = document.createElement('cp:attr');
					this.appendChild(at);
				}
			},

			properties : {
            /**
            */
			filters : {
				get : function () {
					return this._filters;
				},
				set : function (value) {
					this._filters = value;
				}
			}
		},
		};

		JSElem.register('http://www.components.org','attrs',cp_attrs);

		var cp_attr = {

			template : '<span class="cp_attr_close" anonid="close">x</span><span class="cp_attr_name" anonid="name"></span><span class="cp_attr_value" anonid="value"></span>',

			methods : {

				getAttrProperties : function () {
					return {
						element : this.parentNode.elementTarget,
						attrName : this.getAttribute('name'),
						value : this.getAttribute('value')
					};
				},
				domInsert : function () {
					var _this = this;
					this.getAnonid("close").addEventListener('click', function() {
						var p = _this.getAttrProperties();
						p.element.removeAttribute(p.attrName);
						_this.parentNode.removeChild(_this);
					});

					this.getAnonid("name").addEventListener('click', function(ev) {
						ev.preventDefault();
						this.setAttribute('contenteditable','true');
					});

					this.getAnonid("name").addEventListener('keydown', function(ev) {
						if(ev.keyCode==13) {
							ev.preventDefault();
							this.setAttribute('contenteditable','false');
							var c = this.innerHTML.trim();
							var patt = /^[A-Za-z]*[:]?[A-Za-z_]+[A-Za-z0-9_-]*$/g;
							var p = _this.getAttrProperties();
							if(patt.test(c)){
								this.innerHTML = c;
								p.element.removeAttribute(p.attrName);
								p.element.setAttribute(c,p.value);
								_this.setAttribute('name',c);
							} else {
								this.innerHTML = p.attrName;
							}
							this.blur();
						}
					});

					this.getAnonid("value").addEventListener('click', function(ev) {
						ev.preventDefault();
						this.setAttribute('contenteditable','true');
					});

					this.getAnonid("value").addEventListener('keydown', function(ev) {
						if(ev.keyCode==13) {
							ev.preventDefault();
							this.setAttribute('contenteditable','false');
							var c = this.innerHTML;
							var p = _this.getAttrProperties();
							p.element.removeAttribute(p.attrName);
							p.element.setAttribute(p.attrName,c);
							_this.setAttribute('value',c);
							this.blur();
						}
					});
				},
			},

			attributes : {

				name : {
					set : function (value) {
						this.getAnonid('name').innerHTML = value;
					}
				},

				value : {
					set : function (value) {
						this.getAnonid('value').innerHTML = value;
					}
				},
			},
		};

		JSElem.register('http://www.components.org','attr',cp_attr);

	}());
});
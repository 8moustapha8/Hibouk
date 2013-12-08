/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant command
 * namespace : http://www.components.org
 */
define('cp/command/cp_command',function() {
	(function() {

		var cp_command = {

			methods : {

				domInsert : function () {
					var elSetAttribute = this.setAttribute;
					var setAllAttributes = this.setAllAttributes;
					this.setAttribute = function() {
						setAllAttributes.apply(this, arguments);
						elSetAttribute.apply(this, arguments);
					};
					this._elements = [];
					this._events = {};
				},

				addObserved : function (el) {
					this._elements.push(el);
					var _this = this;
					setTimeout(function(){
						[].forEach.call(_this.attributes, function(_at) {
							var n = _at.nodeName.toLowerCase()
							if(n!='id')
								_this.setAllAttributes.call(_this, _at.nodeName, _at.value );

						});
						for (var name in _this._events)
							_this.updateEvent(name);
					}, 200);
				},

				setAllAttributes : function ( attr, value ) {
					var tmpEls = [];
					this._elements.forEach( function (el) {
						if(el.parentNode!=null){
							el.setAttribute(attr,value);
							tmpEls.push(el);
						}
					});
					this._elements = tmpEls;
				},

				addEvent : function (name, handler, useCapture) {
					this._events[name] = {
						handler : handler,
						useCapture : useCapture
					};
					this.updateEvent(name);
				},

				updateEvent : function ( name ) {
					var _this = this;
					var tmpEls = [];
					this._elements.forEach( function (el) {
						if (el.parentNode!=null) {
							var _addEvent = false;
							if(el.eventListenerList==undefined) {
								el.eventListenerList = [name];
								_addEvent = true;
							} else if(el.eventListenerList.indexOf(name)==-1) {
								el.eventListenerList.push(name);
								_addEvent = true;
							}
							if (_addEvent) {
								var _fnc = function (event) {
									if(_this.getAttribute('inactivated')!='true')
										_this._events[name].handler.call(el,event);
								};
								el.addEventListener(name, _fnc, _this._events[name].useCapture);
							}
							tmpEls.push(el);
						}
					});
					this._elements = tmpEls;
				}
			}
		};

		JSElem.register('http://www.components.org','command',cp_command);
	}());
});
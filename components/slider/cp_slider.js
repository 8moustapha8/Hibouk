/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant slider
 * namespace : http://www.components.org
 */
define('cp/slider/cp_slider', function() {
	(function() {
		var coord = function (ev,el) {
			var scr = ev.target;
			var x = ev.clientX;
			while ((scr = scr.parentNode) && scr != document.body)
				x += scr.scrollLeft || 0;
			x += document.body.scrollLeft + document.documentElement.scrollLeft;
			var L = 0;
			while (el) {
				L += el.offsetLeft;
				el = el.offsetParent;
			}
			x = x - L;
			return x;
		};

		var slider = {

			template : '<div class="slider_button" anonid="button"></div>',

			methods : {
				/**
				*/
				domString : function () {
					return '<cp:slider' + this.attrToString('id')+ '></cp:slider>';
				},
				/**
				*/
				domCreate : function () {
					var def = {
						max : 100,
						min : 0,
						step : 1,
						value : 0
					};
					for(var o in def){
						if(this.getAttribute(o)===undefined)
							this.setAttribute(o,def[o]);
					}
				},
				/**
				*/
				domInsert : function () {
					var b = this.getAnonid('button');
					var _this = this;
					b.addEventListener('dragstart',function(event){
						return false;
					});
					b.addEventListener('mousedown',function(event){
						_this.select = true;
					});
					b.addEventListener('mouseup',function(event){
						_this.select = false;
					});
					this.init();
				},
				init : function () {
					var _this = this;
					var calc = function (){
						var b = _this.getAnonid('button');
						var bw = b.offsetWidth;
						var bw2 = bw/2;
						var unit = (_this._max-_this._min);
						var unitPix = (_this.offsetWidth/unit);//  unités equivalent pixel
						return {
							toValue:function (v) {
								b.style.marginLeft = (((v*unitPix)-(_this._min*unitPix))- bw2)  + 'px';
							},
							range:function (px) {
								if( (px>=bw2) && (px<=_this.offsetWidth+bw2) )
									return true;
								else
									return false;
							},
							position:function (px) {
								return Math.round( (px-bw2)/unitPix);
							},
							draw:function (px,position) {
								b.style.marginLeft = ((position*unitPix)-bw2)  + 'px';
							}
						}
					};
					this.calc = calc();
					setTimeout(function(){
						_this.calc.toValue(_this.getAttribute('value'));
					}, 100);
				}
			},

			attributes : {
				/**
				*/
				value : {
					set : function (value) {
						var v = parseInt(this.getAttribute('value'));
						if(v != value) {
							var _event = document.createEvent("CustomEvent");
							_event.initCustomEvent('change', true, true, {value:value});
							this.dispatchEvent(_event);
							this.calc.toValue(value);
						}
					}
				},
				width : {
					set : function (value) {
						this.style.width = value + 'px';
						this.init();
					}
				},
				step : {
					get : function () {
						return this._step;
					},
					set : function (value) {
						this._step = parseInt(value);
						this.init();
					}
				},
				min : {
					get : function () {
						return this._min;
					},
					set : function (value) {
						this._min = parseInt(value);
						this.init();
					}
				},
				max : {
					get : function () {
						return this._max;
					},
					set : function (value) {

						this._max = parseInt(value);
						this.init();
					}
				}
			},

			events : {
				mousemove : function (event) {
					if(this.select) {
						var px = coord(event,this);
						if(this.calc.range(px)){
							var position = this.calc.position(px) + this._min;
							var v = parseInt(this.getAttribute('value'));
							if(v != position) {
								this.calc.draw(px,position - this._min);
								this.setAttribute('value',position);
							}
						}
					}
				},
				mouseup : function (event) {
					this.select = false;
				},
				/*
				mouseout : function (e) {
					// emulate mousleave
					var parent = e.relatedTarget;
					while (parent && parent != this) {
					  try {
						parent =  parent.parentNode;
					  } catch (e) { break; }
					}
					if (parent != this)
						this.select = false;
				}*/
			}
		};

		JSElem.register('http://www.components.org','slider',slider);
	}());
});
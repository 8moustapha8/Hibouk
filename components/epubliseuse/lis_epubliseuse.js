/**
 * @package Liseuse
 * @subpackage liseuse (lis_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant epubliseuse
 * namespace : http://www.components.org
 */
define('cp/epubliseuse/lis_epubliseuse', function() {
	(function() {

		// pair ?
		var even = function(v){
			return ((v)%2===0)?false:true;
		};

		var showPosition = function(position,max,files,positionFiles){
			if(files!=undefined) {
				return position+'/'+max+' − '+positionFiles+'/'+files.length;
			} else {
				return position+'/'+max;
			}
		};

		var getprop = function(proparray) {
			var root = document.documentElement;
			for (var i = 0; i < proparray.length; i++)
			if (typeof root.style[proparray[i]] == "string") return proparray[i];
		};

		var setEvent = function(el,eventName) {
			var _event = document.createEvent("HTMLEvents");
			_event.initEvent(eventName, true, true);
			el.dispatchEvent(_event);
		};

		var setValAndChange = function(el,val) {
			el.value = val;
			setEvent(el,'change');
		};

		var whichTransitionEvent = function (){
			var t;
			var el = document.createElement('div');
			var transitions = {
				'transition':'transitionend',
				'OTransition':'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			}

			for(t in transitions){
				if( el.style[t] !== undefined )
					return transitions[t];
			}
		};

		var afterTransition = null;

		var epubliseuse = {
			template : '<div class="liseuse_nav" anonid="liseuse_nav"></div><div class="liseuse_liseuse" anonid="liseuse"><div class="liseuse_bl" anonid="bl">❰</div><div class="liseuse_v" anonid="v"></div><div class="liseuse_br" anonid="br">❱</div><div anonid="screen"><iframe anonid="liseuse_iframe" class="liseuse_iframe" scrolling="no"/></div><div class="liseuse_tools" anonid="tools"><div class="liseuse_button" anonid="liseuse_switch" style="font-size:22px;"></div><div class="liseuse_button" anonid="liseuse_Nav" style="display:none;"><span style="font-size:15px;line-height:30px;">☰</span></div><div class="liseuse_button" anonid="liseuse_Cp"><span style="font-size:15px;line-height:30px;">A</span></div><div class="liseuse_button" anonid="liseuse_Cm"><span style="font-size:10px;line-height:28px;">A</span></div><input type="range" anonid="liseuse_slider" value="1" min="1" step="1"/><input type="range" anonid="liseuse_sliderFiles" value="1" min="1" step="1" style="display:none;"/></div></div>',

			methods : {
				/**
				*/
				domString : function () {
					return '<cp:epubliseuse' + this.attrToString('id')+ '></cp:epubliseuse>';
				},
				/**
				*/
				domCreate : function () {},
				/**
				*/
				domInsert : function () {
					var _this = this;
					this.pageFontSize = 11;
					this.prop = {};
					this.nav = false;

					var b = this.getAnonid('liseuse_switch');
					var slider = this.getAnonid('liseuse_slider');

					var sliderFiles = this.getAnonid('liseuse_sliderFiles');
					var iframe = this.getAnonid('liseuse_iframe');
					var nav = this.getAnonid('liseuse_nav');

					this.prop['transform'] = getprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);

					b.addEventListener('click', function (ev) {
						var l = _this.getAttribute('landscape');
						if(l=="false")
							_this.setAttribute('landscape','true');
						else
							_this.setAttribute('landscape','false');
					});

					if(this.getAttribute('landscape')==undefined)
						_this.setAttribute('landscape','false');

					document.body.insertComponent('beforeend', '<cp:menupopup id="menupopup_liseuse_options"><cp:menuitem label="Liseuses"><cp:submenu label="Liseuses"><cp:menuitem label="Ipad" id="m_ipad"/><cp:menuitem label="Fire" id="m_fire"/></cp:submenu></cp:menuitem></cp:menupopup>');

					var transitionend = whichTransitionEvent();

					this._rightDirection = true;
					iframe.addEventListener('load', function() {
						if(iframe.getAttribute('src')!=null){

							var doc = iframe.contentWindow.document;
							doc.body.parentNode.setAttribute('lang',_this.getAttribute('lang'));
							doc.body.insertAdjacentHTML('afterbegin', '<div id="__starttag__"></div>');
							doc.body.insertAdjacentHTML('beforeend', '<div id="__endtag__" style="margin:0;">&#160;</div>');
							var background = iframe.contentWindow.getComputedStyle(doc.body,null).getPropertyValue("background-color");

							slider.value = 1;

							if(background!='transparent' && background!='rgba(0, 0, 0, 0)')
								_this.getAnonid('screen').style.backgroundColor = background;

							[].forEach.call(doc.querySelectorAll('body > *'), function (element) {
								var styleC = iframe.contentWindow.getComputedStyle(element,null);
								var padL = parseInt(styleC.getPropertyValue("margin-left"));
								var padR = parseInt(styleC.getPropertyValue("margin-right"));
								if(padL<10)
									element.style.marginLeft = '10px';
								if(padR<10)
									element.style.marginRight = '10px';
							});

							[].forEach.call(doc.querySelectorAll('a'), function (element) {
								var href = element.getAttribute('href');
								element.setAttribute('_href',href);
								element.removeAttribute('href');
								element.style.cursor = 'pointer';
								if(href.split(':').length>1) {
									//element.setAttribute('target','_blank');
									// TODO see exterior link !!!
									element.addEventListener('click',function(){
										alert('outdoors link');
									});
								} else {
									element.addEventListener('click',function(){
										var href = element.getAttribute('_href');
										if(href.substring(0,1)=='#'){// #anchor
											setValAndChange(slider,_this.getPageElement(href.substring(1,href.length)));
										} else { // link and link#anchor
											var link = href;
											_this._gotoAnchor = undefined;
											href = href.split('#');
											if(href.length>1) {
												link = href[0];
												_this._gotoAnchor = href[1];
											}
											link = link.replace(/\.\.\//g,'');
											link = _this._relativeDir+link;

											_this._multifiles.forEach(function(file,i){
												if(file==link)
													setValAndChange(sliderFiles,i+1);
											});
										}
									});
								}
							});

							afterTransition = function(){
								var x = _this.getPageElement('__endtag__');
								slider.setAttribute('max', x);
								if(_this._rightDirection==false){
									_this._rightDirection = true;

									if(_this.getAttribute('landscape')=='true')
										slider.value = x-1;
									else
										slider.value = x;
									setEvent(slider,'change');
								} else if(_this._gotoAnchor!=undefined) {
										var pElem = _this.getPageElement(_this._gotoAnchor);
										_this._gotoAnchor = undefined;
										setValAndChange(slider,pElem);
								} else {
									var v = parseInt(slider.value);
									if(v>x) {
										if(x>1 && !even(x) && _this.getAttribute('landscape')=='true')
											x = x-1;
										slider.value = x;
									}
									_this.getAnonid('v').innerHTML = showPosition(slider.value,slider.getAttribute('max'),_this._multifiles,sliderFiles.value);
								}
							};

							doc.addEventListener(transitionend, function() {
								afterTransition();
							}, false);

							_this.fileUdapte(_this);
						}
					});

					this.getAnonid('bl').addEventListener('click', function() {
						var min = parseInt(slider.getAttribute('min'));
						var v = parseInt(slider.value)-1;

						if(_this.getAttribute('landscape')=='true' && !even(v))
							v = v-1;

						if(v>=min) {
							setValAndChange(slider,v);
						} else if(_this._multifiles!=undefined) {
							var vFiles = parseInt(sliderFiles.value)-1;
							if(vFiles>=1) {
								_this._rightDirection = false;
								setValAndChange(sliderFiles,vFiles);
							}
						}
					});

					this.getAnonid('br').addEventListener('click', function() {

						var max = parseInt(slider.getAttribute('max'));
						var v = parseInt(slider.value)+1;
						if(_this.getAttribute('landscape')=='true' && !even(v))
							v = v+1;

						if(v<=max) {
							setValAndChange(slider,v);
						} else if(_this._multifiles!=undefined) {
							var maxFiles = _this._multifiles.length;
							var vFiles = parseInt(sliderFiles.value)+1;
							if(vFiles<=maxFiles) {
								_this._rightDirection = true;
								setValAndChange(sliderFiles,vFiles);
							}
						}
					});

					this.getAnonid('liseuse_Cp').addEventListener('click', function() {
						if (_this.pageFontSize < 20) {
							_this.pageFontSize++;
							iframe.contentWindow.document.body.style.fontSize = _this.pageFontSize + 'px';
						}
					});

					this.getAnonid('liseuse_Cm').addEventListener('click', function() {
						if (_this.pageFontSize > 5) {
							_this.pageFontSize--;
							iframe.contentWindow.document.body.style.fontSize = _this.pageFontSize + 'px';
						}
					});

					this.getAnonid('liseuse_Nav').addEventListener('click', function() {
						if(_this.nav) {
							_this.nav = false;
							nav.style.display = 'none';
						} else {
							_this.nav = true;
							nav.style.display = 'block';
						}
						_this._width = parseInt(_this.getAnonid('liseuse').style.width);
					});

					var calcLiseuse = function (Lh,Lw) {
						var w = parseInt(_this.getAttribute('width'));
						var h = parseInt(_this.getAttribute('height'));
						if(w>h)
							h = w;
						w = (h*Lw)/Lh;
						_this.setAttribute('width', w);
						_this.setAttribute('height',h);
						_this.setAttribute('landscape','false');
					};
/*
					document.getElementById('m_ipad').addEventListener('click', function (ev) {
						calcLiseuse(1024,768);
					}, false);
					document.getElementById('m_fire').addEventListener('click', function (ev) {
						calcLiseuse(1920,1200);
					}, false);
*/
					sliderFiles.addEventListener('change', function(evt) {
						if(_this._multifiles)
							_this.setAttribute('src',_this._multifiles[parseInt(sliderFiles.value)-1]);
					});

					slider.addEventListener('change', function(evt) {
						_this.slide((slider.value * -_this.pageWidth) + _this.pageWidth);
					});
				},

				fileUdapte : function (_this) {
					var iframe = _this.getAnonid('liseuse_iframe');
					var doc = iframe.contentWindow.document;
					var width = _this.pageWidth;
					var height = iframe.offsetHeight;

					/*
						IE : all 0.01s ease; !!!!!!!
						other : all 0.0001s ease;
					*/
					var style = '<style type="text/css" id="liseuse_style">'
							+'body {'
							+'margin:0px;padding:0px;'
							+'-webkit-transition: all 0.0001s ease;-moz-transition: all 0.0001s ease;-ms-transition: all 0.0001s ease;-o-transition: all 0.0001s ease;transition: all 0.01s linear;'
							+'font-size:'+_this.pageFontSize+'px;'
							+'height:'+height+'px;'
							+'-moz-column-width:'+width+'px;-webkit-column-width:'+width+'px;column-width:'+width+'px;'
							+'-moz-column-gap: 0px;-webkit-column-gap: 0px;column-gap: 0px;'
							+'-moz-hyphens: auto;-webkit-hyphens: auto;-ms-hyphens: auto;-O-hyphens: auto;hyphens: auto;'
							+'}'
							+'#__starttag__ {'
							+'display:none;width:100%;'
							+'}'
							+ 'img {max-height:'+(height-5)+'px !important;max-width:100%;}'
							+'</style>';
					var liseuse_style = doc.getElementById('liseuse_style');
					if(liseuse_style!=undefined)
						liseuse_style.parentNode.removeChild( liseuse_style );

					doc.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', style);

					var startTagStyle = 'display:none;'
					if(_this.getAttribute('landscape')=='true')
						startTagStyle = 'display:block;height:'+height+'px;';
					if(doc.getElementById('__starttag__'))
						doc.getElementById('__starttag__').setAttribute('style',startTagStyle);
				},

				slide : function( newX ) {
					var style = this.getAnonid('liseuse_iframe').contentWindow.document.body.style;
					style[this.prop.transform] = 'translateX(' + newX + 'px)';
					style.fontSize = this.pageFontSize + 'px';
				},

				setMultifiles : function( files, relativeDir ) {
					this._multifiles = files;
					this._relativeDir = relativeDir;
					this.getAnonid('liseuse_slider').style.display = 'none';
					var sliderFiles = this.getAnonid('liseuse_sliderFiles');
					sliderFiles.setAttribute('max',files.length);
					sliderFiles.style.display = 'block';
					sliderFiles.setAttribute('value',1);
					this.setAttribute('src',files[0]);
				},

				initNav : function( navMap ) {
					var _this = this;
					this.getAnonid('liseuse_Nav').style.display = 'block';
					var liseuse_nav = this.getAnonid('liseuse_nav');
					liseuse_nav.insertComponent('replace',navMap);
					var navMap = liseuse_nav.querySelector('ncx\\:navMap');
					var slider = this.getAnonid('liseuse_slider');

					var sliderFiles = this.getAnonid('liseuse_sliderFiles');
					navMap.addEventListener('selectedNavPoint', function (ev) {

						if (ev.detail.id!=null){

							var link = ev.detail.src;
							var href = link;

							_this._gotoAnchor = undefined;
							href = href.split('#');
							if(href.length>1)
								link = href[0];
							link = link.replace(/\.\.\//g,'');
							link = _this._relativeDir+link;

							var actualLink = _this._src;
							if(link==actualLink && href[1]!=undefined) {
								setValAndChange(slider,_this.getPageElement(href[1]));
							} else {
								_this._multifiles.forEach(function(file,i){
									if(file==link){
										if(href[1]!=undefined)
											_this._gotoAnchor = href[1];
										setValAndChange(sliderFiles,i+1);
									}
								});
							}
						}
					}, false);
				},

				getPageElement : function(id) {
					var iframe = this.getAnonid('liseuse_iframe');
					var left = iframe.contentWindow.document.getElementById(id).getBoundingClientRect().left;
					var style = iframe.contentWindow.document.body.style[this.prop.transform];
					if(style!='')
						left = left - parseFloat(style.split('translateX(')[1].split('px'));
					return Math.abs(parseInt(left / this.pageWidth, 10)) + 1;
				},
				refrech : function(){
					// TODO: bug width firefox getComputedStyle
					/*
					var random = '?random='+(new Date()).getTime()+Math.floor(Math.random()*1000000);
					this.getAnonid('liseuse_iframe').src = this._src+random;
					*/
				}
			},

			attributes : {
				src : {
					get : function () {
						return this.getAnonid('liseuse_iframe').src;
					},
					set : function (value) {
						this._src = value;
						this.getAnonid('liseuse_iframe').src = value;
					}
				},
				landscape : {
					set : function (value) {
						var _this =this;
						var w = parseInt(this.getAttribute('width'));
						var h = parseInt(this.getAttribute('height'));
						var b = this.getAnonid('liseuse_switch');
						var slider = this.getAnonid('liseuse_slider');
						var sliderFiles = this.getAnonid('liseuse_sliderFiles');
						var toogle = function(el,_w,_h){
							setTimeout(function(){
								el.setAttribute('width',_w);
								el.setAttribute('height',_h);
								_this.fileUdapte(_this);
								setTimeout(function(){
									setEvent(sliderFiles,'change');
								}, 200);
							}, 200);
						};
						if(value=='false'){// portrait
							b.innerHTML = '▬';
							slider.setAttribute('step',1);
							if(w>=h)
								toogle(this,h,w);
							else
								toogle(this,w,h);
						} else {
							b.innerHTML = '▮';
							slider.setAttribute('step',1);
							if(h>=w)
								toogle(this,h,w);
							else
								toogle(this,w,h);
						}
					}
				},
				width : {
					set : function (value) {
						this._width = parseInt(value);
					}
				},
				height : {
					set : function (value) {
						this._height = parseInt(value);
					}
				}
			},

			properties : {
				_height : {
					set : function (h) {
						var bw = this.getAnonid('bl').offsetWidth;
						var toolsH = this.getAnonid('tools').offsetHeight;

						this.getAnonid('liseuse').style.height = h+'px';
						this.getAnonid('liseuse_nav').style.height = h+'px';

						this.style.height = h+'px';

						var screenH = (h-(toolsH+bw));
						this.getAnonid('screen').style.height = screenH + 'px';
						var t = ((h-toolsH + bw)/2);
						this.getAnonid('bl').style.marginTop = t + 'px';
						this.getAnonid('br').style.marginTop = t + 'px';
						var iframe = this.getAnonid('liseuse_iframe');
						iframe.style.height = (screenH - 40) + 'px';
						iframe.style.marginTop = 20 +'px';
					}
				},
				_width : {
					set : function (w) {
						var bw = this.getAnonid('bl').offsetWidth;
						this.getAnonid('liseuse').style.width = w+'px';
						if(this.nav)
							this.style.width = (w+355)+'px';
						else
							this.style.width = w+'px';

						var screenWidth = (w-(bw*2));
						var screen = this.getAnonid('screen');
						screen.style.width = screenWidth + 'px';
						this.getAnonid('tools').style.width = screenWidth + 'px';
						this.getAnonid('v').style.width = screenWidth + 'px';
						this.pageWidth = screenWidth-20;
						var iframe = this.getAnonid('liseuse_iframe');
						iframe.style.width = this.pageWidth + 'px';
						iframe.style.marginLeft = 10 + 'px';
						if(this.getAttribute('landscape')=='true')
							this.pageWidth = this.pageWidth/2;
						var switchb = this.getAnonid('liseuse_switch');
						var sliderW = screenWidth - ( (4*switchb.offsetWidth) +25  );
						this.getAnonid('liseuse_slider').style.width = sliderW + 'px';
						this.getAnonid('liseuse_sliderFiles').style.width = sliderW + 'px';
					}
				}
			}
		};

		JSElem.register('http://www.components.org','epubliseuse',epubliseuse);
	}());
});
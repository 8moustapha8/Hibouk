/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor - partie dom
 * namespace : http://www.components.org
 */
define('cp/editor/cp_dom',function() {
	(function() {

		// étend un tableau avec un autre tableau
		var extend = function(a,x) {
		  x.forEach(function(i){a.push(i)});
		  return a;
		};

		var dom = function (selector, context) {
			return new dom.prototype.init(selector,context);
		};

		// Convertit les caractères éligibles en entités HTML
		var _htmlEntities = function (str) {
			return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		};

		var _surround = function(range, _createWrapper, record) {
			if(range.collapsed)
				return;

			var startSide = range.startContainer;
			var endSide = range.endContainer;
			var ancestor = range.commonAncestorContainer;
			var dirIsLeaf = true;

			if(range.endOffset == 0) {
				while(!endSide.previousSibling && endSide.parentNode != ancestor) {
					endSide = endSide.parentNode;
				}
				endSide = endSide.previousSibling;
			} else if(endSide.nodeType == Node.TEXT_NODE) {
				if(range.endOffset < endSide.nodeValue.length) {
					endSide.splitText(range.endOffset);
				}
			} else if(range.endOffset > 0) {
				endSide = endSide.childNodes.item(range.endOffset - 1);
			}

			if(startSide.nodeType == Node.TEXT_NODE) {
				if(range.startOffset == startSide.nodeValue.length) {
					dirIsLeaf = false;
				} else if(range.startOffset > 0) {
					startSide = startSide.splitText(range.startOffset);
					if(endSide == startSide.previousSibling)endSide = startSide;
				}
			} else if(range.startOffset < startSide.childNodes.length) {
				startSide = startSide.childNodes.item(range.startOffset);
			} else {
				dirIsLeaf = false;
			}

			range.setStart(range.startContainer, 0);
			range.setEnd(range.startContainer, 0);

			var done = false;
			var node = startSide;
			var tmp;

			do {
				if(dirIsLeaf && node.nodeType == Node.TEXT_NODE &&
					!((tmp = node.parentNode) instanceof HTMLTableElement ||
						tmp instanceof HTMLTableRowElement ||
						tmp instanceof HTMLTableColElement ||
						tmp instanceof HTMLTableSectionElement)) {
					var wrap = node.previousSibling;
					if(!wrap || wrap != record.lastNode) {
						wrap = _createWrapper(node);
						node.parentNode.insertBefore(wrap, node);
					}
					wrap.appendChild(node);

					node = wrap.lastChild;
					dirIsLeaf = false;
				}

				if(node == endSide && (!endSide.hasChildNodes() || !dirIsLeaf))
					done = true;

				if(node instanceof HTMLScriptElement ||
					node instanceof HTMLStyleElement ||
					node instanceof HTMLSelectElement) {
					dirIsLeaf = false;
				}

				if(dirIsLeaf && node.hasChildNodes()) {
					node = node.firstChild;
				} else if(node.nextSibling != null) {
					node = node.nextSibling;
					dirIsLeaf = true;

				} else if(node.nextSibling == null) {
				node = node.parentNode;
				dirIsLeaf = false;
				}
			} while(!done);
		};

		dom.fn = dom.prototype = {
			init : function (selector, context) {
				this.contentWindow = this.getComposerElement().contentWindow;
				this.document = this.contentWindow.document;
				if (!selector)
					return this;
				this.sel(selector,context);
			},

			sel : function (selector, context) {
				if (selector.nodeType) {
					this.elems = [selector];
				} else if (selector === "selectedNodes") {
					this.elems = this.getSelectedNodes();
				} else if (selector === "body" && !context && this.document.body) {
					this.elems = [this.document.body];
				} else if (typeof selector === "string"){
					if(context)
						this.elems = context.querySelectorAll(selector);
					else
						this.elems = this.document.querySelectorAll(selector);
				} else if (typeof selector === "object"){
					this.elems = selector.elems;
				}
				return this;
			},

			each : function (callback) {
				var x = 0;
				[].forEach.call(this.elems,
					function (el) {
							callback(el,x);
							x++;
					}
				);
				return this;
			},

			length : function (){
				return this.elems.length;
			},

			toCamelCase : function (v) {
				return v.replace(/\W+(.)/g,function (s,l) {
					return l.toUpperCase();
				});
			},

			filterTagName : function (nameList) {
				var elems = [];
				var nameList = nameList.split(/,/);
				this.each( function (el) {
					nameList.forEach( function (name) {
						if(el.nodeName.toLowerCase()== name)
							elems.push(el);
					});
				});
				this.elems = elems;
				return this;
			},

			css : function (key, value) {
				var _this = this;
				if (value || typeof key === "object") {
					if (value) {
						return this.each( function (el) {
							el.style[_this.toCamelCase(key)] = value;
						});
					} else {
						return this.each( function (el) {
							for (var k in key)
								el.style[k] = key[k];
						});
					}
				} else {
					return this.elems[0].style[_this.toCamelCase(key)];
				}
			},

			rmCss : function (key) {
				return this.each( function (el) {
					el.style.removeProperty(key);
				});
			},

			toogleCss : function (key, value1, value2) {
				var r = this.toCamelCase(key);
				return this.each( function (el) {
					var v = el.style[r];
					if (value2 && v==value1)
						el.style[r] = value2;
					else if (value2 && v==value2)
						el.style[r] = value1;
					else if (v=='')
						el.style[r] = value1;
					else
						el.style.removeProperty(key);
				});
			},

			addClass : function(cl) {
				var clA = cl.split(/\s+/);
				return this.each( function (el) {
					clA.forEach( function (_cl) {
						el.classList.add(_cl);
					});
				});
			},

			rmClass : function (cl) {
				var clA = cl.split(/\s+/);
				return this.each( function (el) {
					clA.forEach( function (_cl) {
						el.classList.remove(_cl);
					});
				});
			},

			toggleClass : function (cl) {
				var clA = cl.split(/\s+/);
				return this.each( function (el) {
					clA.forEach( function (_cl) {
						el.classList.toggle(_cl);
					});
				});
			},

			filterClassName : function (cl) {
				var elems = [];
				var clA = cl.split(/\s+/);
				this.each( function (el) {
					clA.forEach( function (_cl) {
						if(el.classList.contains(cl))
							elems.push(el);
					});
				});
				this.elems = elems;
				return this;
			},

			filterComputedStyle : function (obj) {
				//var defaultView = this.document.defaultView
				var elems = [];
				var _this = this;
				this.each( function (el) {
					var value = _this.contentWindow.getComputedStyle(el, null).getPropertyValue(obj.key);
					if(value==obj.value)
						elems.push(el);
				});
				this.elems = elems;
				return this;
			},

			reduce : function(index) {
				this.elems = Array.prototype.slice.call( this.elems );
				this.elems = this.elems.slice(0,index+1);
				return this;
			},

			html : function (position, html, callback) {
				// - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
				// inner and outer
				if (html) {
					return this.each( function (el) {
						if (position=='inner')
							el.innerHTML = html;
						else if (position=='outer')
							el.outerHTML = html;
						else
							el.insertAdjacentHTML(position, html);

						if (callback)
							window.setTimeout(callback,100);
					});
				} else {
					if (this.elems[0]){
						if (position=='inner')
							return this.elems[0].innerHTML;
						else if (position=='outer')
							return this.elems[0].outerHTML;
					}
				}
			},

			rm : function () {
				return this.each( function (el) {
						if ( el.parentNode )
							el.parentNode.removeChild( el );
				});
			},

			last : function (){
				this.elems = [this.elems[this.elems.length-1]];
				return this;
			},

			toogleTag : function(tagStart,tagEnd) {
				return this.each( function (el) {
					if ( el.parentNode ){
						var html = el.innerHTML;
						el.insertAdjacentHTML('afterend', tagStart+html+tagEnd);
						el.parentNode.removeChild( el );
					}
				});
			},

			get : function(position,selector){
				var elems = [];
				if (position == undefined){
					return this.elems;
				} else if (typeof position === 'number'){
					if (this.elems[position])
						elems.push(this.elems[position]);
				} else {
					this.each( function (el) {
						var _el;
						switch(position){
							case 'parent' :
								_el = el.parentNode;
							break;
							case 'next' :
								_el = el.nextElementSibling;
							break;
							case 'prev' :
								_el = el.previousElementSibling;
							break;
							case 'firstChild' :
								_el = el.firstElementChild;
							break;
							case 'lastChild' :
								_el = el.lastElementChild;
							break;
							case 'children' :
								elems = extend(elems, Array.prototype.slice.call( el.children ) );
							break;
							case 'find' : {
								elems = extend(elems, Array.prototype.slice.call( el.querySelectorAll(selector) ) );
							}
						}
						if (_el)
								elems.push(_el);
					});
					this.elems = elems;
					return this;
				}
			},

			attr : function (key, value) {
				if (value || typeof key === "object") {
					if (value) {
						return this.each( function (el) {
							el.setAttribute(key, value);
						});
					} else {
						return this.each( function (el) {
							for (var k in key)
								el.setAttribute(k, key[k]);
						});
					}
				} else {
					return this.elems[0].getAttribute(key);
				}
			},

			// renvoie les attributs d'un élément sous forme d'une chaîne
			attrToString : function (excludes) {
				if(excludes==undefined)
					excludes = [];
				var string = '';
				[].forEach.call(this.elems[0].attributes, function(attr) {
					var attrName = attr.nodeName.toLowerCase();
					if(excludes.indexOf(attrName)==-1 && attr.value!='')
						string += ' ' + attrName + '="' + _htmlEntities(attr.value) + '"';
				});
				return string;
			},

			rmAttr : function (key) {
				return this.each( function (el) {
					el.removeAttribute(key);
				});
			},

			datAttr : function (key, value) {
				var _this = this;
				if (value || typeof key === "object") {
					if (value) {
						var CamelCase = _this.toCamelCase(key);
						return this.each( function (el) {
							el.dataset[CamelCase] = value;
						});
					} else {
						return this.each( function (el) {
							for (var k in key)
								el.dataset[k] = key[k];
						});
					}
				} else {
					return this.elems[0].dataset[_this.toCamelCase(key)];
				}
			},

			rmDatAttr : function (key) {
				var CamelCase = this.toCamelCase(key);
				return this.each( function (el) {
					delete el.dataset[CamelCase];

				});
			},

			getSelection : function(){
				return this.contentWindow.getSelection();
			},

			surroundSelection : function(element) {
				var sel = this.contentWindow.getSelection();
				var record = {offsetY:Number.NaN, firstNode:null, lastNode:null};

				var _createWrapper = function(n) {
					var e = element.cloneNode(false);
					e.classList.add('__SURTMP__');
					if(!record.firstNode)record.firstNode = e;
					if(record.lastNode)record.lastNode.nextHighlight = e;
					record.lastNode = e;
					var posTop = n.parentNode.getBoundingClientRect().top;
					var pageTop = parseInt(window.pageYOffset);
					if(!posTop || posTop < pageTop) {
						record.offsetY = pageTop;
					} else {
						if(!(posTop > record.offsetY))record.offsetY = posTop;
					}
					return e;
				};
				for(var i=0, sel = this.contentWindow.getSelection(); i<sel.rangeCount; i++) {
					_surround(sel.getRangeAt(i), _createWrapper, record);
				}
				this.elems = this.document.querySelectorAll('.__SURTMP__');
				[].forEach.call(this.elems, function (el) {
					el.classList.remove('__SURTMP__');
				});
				return this;
			},

			unwarp : function() {
				return this.each( function (el) {
						if ( el.parentNode ){
							var html = el.innerHTML;
							el.insertAdjacentHTML('afterend', html);
							el.parentNode.removeChild( el );
						}
					});
			}
		};

		dom.fn.init.prototype = dom.fn;

		var loader = function(editor) {
			return {
				init : function(){
					dom.prototype.getComposerElement = editor.composer.getComposerElement;
					dom.prototype.getSelectedNodes = editor.composer.getSelectedNodes;
					dom.prototype.getTreeNodes = editor.composer.getTreeNodes;
					dom.prototype.contentWindow = null;
					dom.prototype.document = null;
					editor.dom = dom;
				}
			}
		};

		JSElem.extendComponent('http://www.components.org','editor',{dom :loader});
	}());
});
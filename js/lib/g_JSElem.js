/**
 * JSElem V0.4Beta
 *
 * Copyright 2013 David Dauvergne
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 **/
(function() {

	// nouvelle définition de innerComponent pour tous les éléments
	Object.defineProperty(window.Element.prototype, 'innerComponent', {
		get: function() {
			return innerComponent.getter(this);
		},
		set: function(html) {
			innerComponent.setter(this, html);
		},
	});

	var subOject = ['methods', 'events', 'properties', 'template'];

	// fonctions natives de l'élément domCreate, domInsert, domString, getAnonid, attrToString
	var prepareElement = function(el, contentLoaded) {
		// appendChild
		var elAppendChild = el.appendChild;
		// nom du composant
		var elName = el.tagName.toLowerCase().split(':');
		var name = components.namespace.getComponentName(components.namespace.getNamespace(elName[0]), elName[1]);

		// composant non initialisé
		if (components.tags[name] && !el.tagUID) {
			// id
			el.tagUID = components.UID++;

			// appendChild
			el.appendChild = function() {
				var content = this.getAnonid('content');
				if (content) {
					if (arguments[0] == 'insertAfterContent') { // insertion d'éléments après le content
						elAppendChild.apply(this, [arguments[1]]);
						insertHtml(this, [arguments[1]]);
					} else {
						content.appendChild(arguments[0]);
					}
				} else {
					elAppendChild.apply(this, arguments);
					insertHtml(this, arguments);
				}
			};

			// setAttribute
			var elSetAttribute = el.setAttribute;
			el.setAttribute = function() {
				var attrs = components.tags[name].attributes;
				if (attrs) {
					var attr = attrs[arguments[0]];
					if (attr && attr.set)
						attr.set.apply(this, [arguments[1]]);
				}

				if (arguments[0] == 'command')
					document.getElementById(arguments[1]).addObserved(this);
				elSetAttribute.apply(this, arguments);
			};

			// getAttribute
			var elGetAttribute = el.getAttribute;
			el.getAttribute = function() {
				var attrs = components.tags[name].attributes;
				if (attrs) {
					var attr = attrs[arguments[0]];
					if (attr && attr.get)
						return attr.get.apply(this);
				}
				return elGetAttribute.apply(this, arguments);
			};

			// base du composant
			for (var a in components.component)
				el[a] = components.component[a];

			// méthodes
			for (var a in components.tags[name].methods)
				el[a] = components.tags[name].methods[a];

			// setter/getter (considérant que pour un setter on a obligatoirement un getter)
			for (var a in components.tags[name].properties)
				Object.defineProperty(el, a, components.tags[name].properties[a]);

			// events
			for (var a in components.tags[name].events)
				el.addEventListener(a, components.tags[name].events[a], false);

			// insertion du contenu du composant
			if (components.tags[name].template)
				el.innerComponent = components.tags[name].template.replace(/anonid="([\w|_|-]*)"/g, 'anonid="$1' + el.tagUID + '"').replace(/<content\s*/, '<content anonid="content' + el.tagUID + '" ');

			// Synchronisation des attributs après DOMContentLoaded
			if (contentLoaded) {
				for (var a in components.tags[name].attributes) {
					var attValue = elGetAttribute.apply(el, [a]);
					if (attValue !== null)
						el.setAttribute(a, attValue);
				}
			}
			// creat
			if (el.domCreate)
				el.domCreate();
			// initialisation pour les object étendus
			initElement(el,components.tags[name]);
		} else {
			el.appendChild = function() {
				elAppendChild.apply(this, arguments);
				insertHtml(this, arguments);
			};
		}
		// insertBefore
		var elInsertBefore = el.insertBefore;
		el.insertBefore = function() {
			var _el = elInsertBefore.apply(this, arguments);
			insertHtml(this, [arguments[0]]);
			return _el;
		}
		// insertComponent - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
		el.insertComponent = function() {
			var _this = this;
			switch (arguments[0].toLowerCase()) {
				case "beforebegin":
					innerComponent.xmlToJson(arguments[1]).forEach(function(el) {
						_this.parentNode.insertBefore(components.domCreat(el), _this);
					});
					break;
				case "afterbegin":
					var first_child = _this.firstChild;
					innerComponent.xmlToJson(arguments[1]).forEach(function(el) {
						first_child = _this.insertBefore(components.domCreat(el), first_child);
					});
					break;
				case "beforeend":
					innerComponent.xmlToJson(arguments[1]).forEach(function(el) {
						_this.appendChild(components.domCreat(el));
					});
					break;
				case "afterend":
					var next_sibling = _this.nextSibling;
					innerComponent.xmlToJson(arguments[1]).forEach(function(el) {
						next_sibling = _this.parentNode.insertBefore(components.domCreat(el), next_sibling);
						next_sibling = next_sibling.nextSibling;
					});
					break;
				case "inner":
					_this.innerComponent = arguments[1];
					break;
				case "replace":
					if (_this.hasChildNodes()) {
						while (_this.childNodes.length >= 1)
							_this.removeChild(_this.firstChild);
					}
					_this.innerComponent = arguments[1];
					break;
			}
		};
	};

	// initialisation des éléments pour les object étendu
	var initElement = function(element,obj){
		if(obj._initList!=undefined){
			obj._initList.forEach(function(name) {
				element[name] = obj[name](element);
			});
			obj._initList.forEach(function(name) {
				if(element[name].init)
					element[name].init();
			});
		}
	};
	// comportements pour innerComponent
	var innerComponent = {
		// nouveau setter
		setter : function (element, xml) {
			var innerElement = [];
			if ( element.hasChildNodes() )
				[].forEach.call(element.childNodes, function(child) {
					innerElement.push(child);
				});
			if (xml != '') {
				var ct = false;
				innerComponent.xmlToJson(xml).forEach( function (el) {
					var elInsert = components.domCreat(el, innerElement);
					if(el[0]=='content') {
						ct = true;
						element.appendChild(elInsert);
					} else {
						if(ct)
							element.appendChild('insertAfterContent',elInsert);
						else
							element.appendChild(elInsert);
					}
				});
			}
		},
		// nouveau getter, sérialisation du DOM
		getter : function (el) {
			var parseDOM = function (node) {
				var string = '';
				[].forEach.call(node.childNodes, function(child) {
					if (child.domString) {
						string += child.domString();
					} else {
						if (child.nodeType ==1 ) {
							var tagName = child.nodeName.toLowerCase();
							string += '<' + tagName + innerComponent.attrToString(child,[]) + '>' + parseDOM(child) + '</' + tagName + '>';
						} else {
							string += innerComponent.htmlEntities(child.nodeValue);
						}
					}
				});
				return string;
			};
			return parseDOM(el);
		},
		// transformation d'une chaîne XML en objet JSON compatible avec domCreat (DOM Builder)
		xmlToJson : function (xml) {
			var domToJSON = function (dom) {
				var obj = [];
				// élément
				if (dom.nodeType == 1) {
					obj.push(dom.nodeName);
					// attributs
					if (dom.attributes.length > 0) {
						var attributes = {};
						[].forEach.call(dom.attributes, function(att) {
							attributes[att.nodeName] = att.value;
						});
						obj.push(attributes);
					}
				} else if (dom.nodeType == 3)
					obj.push({'#textContent' : dom.nodeValue});

				// enfants
				if ( dom.hasChildNodes() )
					[].forEach.call(dom.childNodes, function(child) {
						if(child.nodeType == 3)
							obj.push(child.nodeValue);
						else
							obj.push(domToJSON(child));
					});
				return obj;
			};

			var domArr = [];
			if (window.DOMParser) {
				var dom = new DOMParser().parseFromString('<div '+components.namespace.attributes+'>' + xml + '</div>', "text/xml").documentElement;
			} else if (window.ActiveXObject) {
				var dom = new ActiveXObject("Microsoft.XMLDOM");
				dom.async = false;
				dom.loadXML('<div '+components.namespace.attributes+'>' + xml + '</div>');
				dom = dom.firstChild;
			}
			[].forEach.call(dom.childNodes, function(child) {
				domArr.push(domToJSON(child));
			});
			return domArr;
		},
		// Convertit les caractères éligibles en entités HTML
		htmlEntities : function (str) {
			return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		// renvoie les attributs d'un élément sous forme d'une chaîne
		attrToString : function (el, excludes) {
			var string = '';
			[].forEach.call(el.attributes, function(attr) {
				var attrName = attr.nodeName.toLowerCase();
				if(excludes.indexOf(attrName)==-1 && attr.value!='')
					string += ' ' + attrName + '="' + innerComponent.htmlEntities(attr.value) + '"';
			});
			return string;
		}
	};

	// recherche si l'insertion d'un élément se fait dans le document html
	var insertHtml = function(node, elInsert) {
		while (node) {
			if (node.nodeName.toLowerCase() == 'html') {
				node = null;
				_insertHtml(elInsert);
			} else {
				node = node.parentNode;
			}
		}
	};
	// scanne les enfants d'éléments
	// pour vérifier si l'insertion d'un élément se fait dans le document html
	var _insertHtml = function(elements) {
		[].forEach.call(elements, function(el) {
			if (el.domInsert)
				el.domInsert();
			var _elements = el.childNodes;
			if (_elements)
				_insertHtml(_elements);
		});
	};
	// enregistrement des composants et domCreat (DOM Builder)
	var components = {
		// Unique identifiant pour chaque nouveau composant
		UID: 1,
		// tous les nouveaux composants
		tags: {},
		// composant par défaut
		component: {
			domString: function() {
				return this.outerHTML;
			},
			// méthodes pratique !
			getAnonid: function(anonid) {
				return this.querySelector("*[anonid='" + anonid + this.tagUID + "']");
			},
			attrToString: function() {
				return innerComponent.attrToString(this, Array.prototype.slice.call(arguments));
			},
			getPrefix: function() {
				return this.tagName.toLowerCase().split(':')[0];
			}
		},
		// gestion des namespace
		namespace: {
			attributes: 'xmlns:cp="http://www.components.org"',
			names: {
				'cp': 'http://www.components.org'
			},
			add: function(prefix, namespace) {
				if (components.namespace.names[prefix]) {
					if (components.namespace.names[prefix] !== namespace) {
						var msg = "Prefix already exists with a different namespace (";
						throw msg + components.namespace.names[prefix] + ',' + namespace + ')';
					}
				} else {
					components.namespace.attributes = components.namespace.attributes + ' xmlns:' + prefix + '="' + namespace + '"';
					components.namespace.names[prefix] = namespace;
				}
			},
			getComponentName: function(namespace, name) {
				return namespace + '#' + name;
			},
			getNamespace: function(prefix) {
				if (components.namespace.names[prefix])
					return components.namespace.names[prefix];
				else return null;
			}
		},
		// enregistrement des nouveaux composants
		register: function(namespace, name, obj) {
			var componentName = components.namespace.getComponentName(namespace, name);
			if (componentName) {
				if (!components.tags[componentName]) components.tags[componentName] = {};
					components.tags[componentName] = components._merge(components.tags[componentName], obj);
				return true;
			} else {
				return false;
			}
		},
		// composant enregistré
		registered: function(namespace, name) {
			var componentName = components.namespace.getComponentName(namespace, name);
			if (components.tags[componentName])
				return true;
			else
				return false;
		},
		// extension d'un composant vers un nouveau composant
		extend: function(namespace1, nameCp1, namespace2, nameCp2, objCp2) {
			var componentName1 = components.namespace.getComponentName(namespace1, nameCp1);
			var componentName2 = components.namespace.getComponentName(namespace2, nameCp2);
			components.tags[componentName2] = components._merge(components.tags[componentName1], objCp2);
		},
		// extension d'un même composant
		extendComponent: function(namespace, name, obj) {
			components.register(namespace, name, obj);
			var componentName = components.namespace.getComponentName(namespace, name);

			if(components.tags[componentName]._initList==undefined)
				components.tags[componentName]._initList = [];

			for(var initName in obj){
				if(subOject.indexOf(initName) == -1)
					components.tags[componentName]._initList.push(initName);
			}
		},
		// fusion de deux object
		_merge: function(obj1, obj2) {
			var x = Object.create(obj1);
			var y = Object.create(obj2);
			for (var name in y)
			if (typeof y[name] === 'object' && x[name] !== undefined)
				x[name] = components._merge(x[name], y[name]);
			else
				x[name] = y[name];
			return x;
		},
		parentNode: function(element) {
			var p = element.parentNode;
			if (p.nodeName.toLowerCase() == 'content')
				return p.parentNode;
			else
				return p;
		},

		// dom Builder
		domCreat : function (arr, innerElement) {
			var element;
			arr.forEach( function(item, i) {
				switch (Object.prototype.toString.call(item)[8]) {
					case 'S' :
						if (i==0) {
							if ($params.UIType=='xul')
								element = document.createElementNS("http://www.w3.org/1999/xhtml",item);
							else
								element = document.createElement(item);
							if (item=='content') {
								[].forEach.call(innerElement, function(child) {
									element.appendChild(child);
								});
							}
						} else {
							element.appendChild(document.createTextNode(item));
						}
					break;
					case 'O' :
						for (var key in item){
							switch (key) {
								case 'events' :
									for (var e in item[key])
										element.addEventListener(e, item[key][e], false);
								break;
								case '#textContent' :
									element = document.createTextNode(item[key]);
								break;
								default :
									element.setAttribute(key, item[key]);
								break;
							}
						}
					break;
					case 'A' :
						element.appendChild(components.domCreat(item, innerElement));
					break;
				}
			});
			return element;
		},

		// préparation des composants au démarrage
		DOMContentLoaded: function(bootstrap) {
			[].forEach.call(document.querySelectorAll('*'), function(element) {
				prepareElement(element, true);
				if (element.domInsert)
					element.domInsert();
			});
			if (bootstrap != undefined)
				bootstrap();
		}
	};

	window.JSElem = components;

	// bifurcation de createElement & createElementNS
	var createElement = document.createElement;
	var createElementNS = document.createElementNS;

	document.createElement = function(tag) {
		var element = createElement.call(this, tag);
		prepareElement(element, false);
		return element;
	};

	document.createElementNS = function(ns, tag) {
		var element = createElementNS.call(this, ns, tag);
		prepareElement(element, false);
		return element;
	};
}());
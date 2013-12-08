/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composants ncx - navmap, navpoint, navlabel, text, content
 * namespace : http://www.daisy.org/z3986/2005/ncx/
 */
define('cp/ncx/navmap/ap_navmap', function() {
	(function() {

		var _epubController = null;
		var _notifySaveNCX = null;
		var _href = null;

		// --------------------------------- navMap
		var ncx_navmap = {

			template: '<content/>',

			methods: {
				domString: function() {
					return '<ncx:navMap' + this.attrToString() + '>' + this.getAnonid('content').innerComponent + '</ncx:navMap>';
				},

				domToc: function() {
					var parseDOM = function (node) {
						var string = '';
							[].forEach.call(node.childNodes, function(child) {
								if (child.domToc)
									string += child.domToc();
								string += parseDOM(child);
							});
						return string;
					};
					return parseDOM(this);
				},

				setHref: function(href) {
					_href = href;
				},

				init: function(epubController) {
					var _this = this;

					if (_epubController != null)
						this.close();
					_epubController = epubController;
					_epubController.register('ncx', _this);

					// pour la génération de la toc
					_notifySaveNCX = $notify.sub(_epubController.getTargetSave(), function(obj) {

						_this.updatePlayorder();

						var metadata = _epubController.getRegister('metadata');

						// title
						var title = metadata.getMetaData('title');
						var tille_txt = '';
						if (title[0] != undefined) tille_txt = title[0].val;

						// author
						var author = metadata.getMetaData('creator');
						var author_txt = '';
						if (author[0] != undefined) author_txt = author[0].val;

						// identifier - uid
						var uid = metadata.getMetaData('identifier');
						var uid_txt = '';

						uid.forEach(function(identifier) {
							if (identifier.attributes['opf:scheme'] != undefined && identifier.attributes['opf:scheme'] == 'UUID') {
								var i = identifier.val.split(':');
								uid_txt = i[2];
							}
						});

						var ncx = '<?xml version="1.0" encoding="UTF-8"?>\n';
						ncx += '<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">\n';
						ncx += '<ncx version="2005-1" xml:lang="en" xmlns="http://www.daisy.org/z3986/2005/ncx/">\n';
						ncx += '<ncx:head>\n'
						ncx += '<ncx:meta name="dtb:uid" content="' + uid_txt + '"></ncx:meta>\n';
						ncx += '<ncx:meta name="dtb:depth" content="1"></ncx:meta>\n';
						ncx += '<ncx:meta name="dtb:totalPageCount" content="0"></ncx:meta>\n';
						ncx += '<ncx:meta name="dtb:maxPageNumber" content="0"></ncx:meta>\n';
						ncx += '</ncx:head>\n';
						ncx += '<ncx:docTitle><ncx:text>' + tille_txt + '</ncx:text></ncx:docTitle>\n';
						ncx += '<ncx:docAuthor><ncx:text>' + author_txt + '</ncx:text></ncx:docAuthor>\n';
						ncx += _this.domString();
						ncx += '</ncx>'

						ncx = ncx.replace(/ncx:/g, '').replace(/ playorder=/g, ' playOrder=');
						if (_href == null) _href = 'toc.ncx';

						var objNCX = _epubController.getNcx();
						var idNCX = objNCX.id;

						if (objNCX == null) idNCX = 'ncx';

						obj.manifest[_href] = {
							id: idNCX,
							href: _href,
							'media-type': 'application/x-dtbncx+xml'
						};

						obj['ncx'] = {
							href: _href,
							content: ncx
						};

						return [obj];
					});
				},

				close: function() {
					$notify.unSub(_notifySaveNCX[0], _notifySaveNCX);
					_notifySaveNCX = null;
					_epubController = null;
					_href = null;
				},

				delItem: function() {
					if (this.selectedNavPoint != null) {
						var el = this.querySelector('ncx\\:navPoint[id="' + this.selectedNavPoint + '"]');
						el.parentNode.removeChild(el);
						var event = document.createEvent("CustomEvent");
						event.initCustomEvent('selectedNavPoint', true, true, {
							id: null
						});
						this.dispatchEvent(event);
					}
				},

				addItem: function() {
					var UID = new Date().getTime();
					var t = '<ncx:navPoint id="' + UID + '" playOrder=""><ncx:navLabel><ncx:text>xx</ncx:text></ncx:navLabel><ncx:content src=""></ncx:content></ncx:navPoint>';
					if (id != null) {
						var el = this.querySelector('ncx\\:navPoint[id="' + this.selectedNavPoint + '"]');
						el.insertComponent('beforeend', t);
					} else {
						this.insertComponent('beforeend', t);
					}
				},

				updatePlayorder: function() {
					[].forEach.call(this.querySelectorAll('ncx\\:navPoint'), function(element, i) {
						element.setAttribute('playorder', i + 1);
					});
				}
			},

			events: {
				selectedNavPoint: function(ev) {
					ev.stopPropagation();
					[].forEach.call(this.querySelectorAll('ncx\\:navPoint[selected="true"]'), function(element) {
						element.removeAttribute('selected');
					});

					if (ev.detail.id != null) ev.target.setAttribute('selected', 'true');

					this.selectedNavPoint = ev.detail.id;
				}
			}
		};

		JSElem.register('http://www.daisy.org/z3986/2005/ncx/', 'navmap', ncx_navmap);

		// --------------------------------- navPoint
		var ncx_navpoint = {

			template: '<div class="ncxnavpointghost" anonid="top"></div><content/><div class="ncxnavpointghost" anonid="bottom"></div><div class="ncxnavpointghostR" anonid="right"></div>',

			_hide: function(_this, _display) {
				['bottom', 'top', 'right'].forEach(function(d) {
					var a = 'none';
					if (_display == d) a = 'block';
					_this.getAnonid(d).style.display = a;
				});
			},

			methods: {
				domString: function() {
					return '<ncx:navPoint' + this.attrToString('draggable', 'style', 'selected') + '>' + this.getAnonid('content').innerComponent + '</ncx:navPoint>';
				},

				domString2: function() {
					return '<ncx:navPoint' + this.attrToString('draggable', 'style', 'selected') + '>' + this.getAnonid('content').innerComponent + '</ncx:navPoint>';
				},

				domToc: function() {
					var count = 1;
					var el = this.parentNode;
					var elName = el.tagName.toLowerCase();
					while(elName!='ncx:navmap') {
						el = el.parentNode;
						elName = el.tagName.toLowerCase();
						if(elName=='ncx:navpoint')
							count++;
					}
					var link = '';
					[].forEach.call(this.getAnonid('content').childNodes, function(el) {
						if (el.nodeType ==1 ) {
							var elName = el.nodeName.toLowerCase();
							if(elName=='ncx:content')
								link = el.getAttribute('src');
						}
					});
					return '<div class="toc_'+count+'"><a href="'+link+'">';
				},

				domInsert: function() {
					this.setAttribute('draggable', 'true');
				},

				getElemCoord: function(ev) {
					var scr = _this = this;
					ev.elemX = ev.elemY = 0;
					while ((scr = scr.parentNode) && scr != document.body) {
						ev.elemX -= scr.scrollLeft || 0;
						ev.elemY -= scr.scrollTop || 0;
					}
					do {
						ev.elemX += _this.offsetLeft;
						ev.elemY += _this.offsetTop;
					} while (_this = _this.offsetParent);

					ev.elemX = ev.pageX - ev.elemX;
					ev.elemY = ev.pageY - ev.elemY;
					return ev;
				}
			},

			events: {

				click: function(ev) {
					ev.stopPropagation();
					var id = this.getAttribute('id');
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('selectedNavPoint', true, true, {
						id: id
					});
					this.dispatchEvent(event);
				},

				mouseover: function(ev) {
					this.style.outline = '1px solid #51A3BA';
					ev.stopPropagation();
				},

				mouseout: function(ev) {
					this.style.outline = '';
				},

				dragstart: function(ev) {
					this.style.opacity = '0.4';
					ev.stopPropagation();
					ev.dataTransfer.setData('navpoint_id', this.getAttribute('id'));
					var _this = this;
					setTimeout(function() {
						_this.style.display = 'none';
					}, 50);
				},

				dragend: function(ev) {
					this.style.display = 'block';
					this.style.opacity = '1';
				},

				dragleave: function(ev) {
					if (ev.target == this) ncx_navpoint._hide(this);
				},

				dragover: function(ev) {
					ev = this.getElemCoord(ev);
					ev.preventDefault();
					ev.stopPropagation();
					if ((ev.elemY + 5) > 20) {
						if (ev.elemX > 100) ncx_navpoint._hide(this, 'right');
						else ncx_navpoint._hide(this, 'bottom');
					} else {
						ncx_navpoint._hide(this, 'top');
					}
				},

				drop: function(ev) {
					ev = this.getElemCoord(ev);
					ev.preventDefault();
					ev.stopPropagation();
					var pos = 'top';
					if (this.getAnonid('bottom').style.display == 'block') pos = 'bottom';
					else if (this.getAnonid('right').style.display == 'block') pos = 'right;'
					ncx_navpoint._hide(this);
					var parent = this.parentNode;
					while (parent.nodeName.toLowerCase() != 'ncx:navmap') {
						parent = parent.parentNode;
						if (parent.nodeName.toLowerCase() == 'ncx:navpoint') ncx_navpoint._hide(parent);
					}
					var id = ev.dataTransfer.getData('navpoint_id');
					var el = parent.querySelector('ncx\\:navPoint[id="' + id + '"]');

					if (pos == 'top') this.insertComponent('beforebegin', el.domString2());
					else if (pos == 'bottom') this.insertComponent('afterend', el.domString2());
					else this.insertComponent('beforeend', el.domString2());

					[].forEach.call(parent.querySelectorAll('ncx\\:navPoint'), function(element) {
						ncx_navpoint._hide(element);
					});

					el.parentNode.removeChild(el);

					var event = document.createEvent("CustomEvent");
					event.initCustomEvent('selectedNavPoint', true, true, {
						id: null
					});
					this.dispatchEvent(event);
				}
			}
		};

		JSElem.register('http://www.daisy.org/z3986/2005/ncx/', 'navpoint', ncx_navpoint);

		// --------------------------------- navLabel
		var ncx_navlabel = {

			template: '<content/>',

			methods: {
				domString: function() {
					return '<ncx:navLabel' + this.attrToString() + '>' + this.getAnonid('content').innerComponent + '</ncx:navLabel>';
				}
			}
		};

		JSElem.register('http://www.daisy.org/z3986/2005/ncx/', 'navlabel', ncx_navlabel);

		// --------------------------------- text
		var ncx_text = {

			template: '<input class="ncxntextinput" style="display:none;" type="text" anonid="editext"></input><content/>',

			methods: {
				domString: function() {
					return '<ncx:text' + this.attrToString() + '>' + this.getAnonid('content').innerComponent + '</ncx:text>';
				},

				domToc: function() {
					return this.getAnonid('content').innerHTML+"</a></div>\n";
				},

				domInsert: function() {
					var _this = this;
					var i = _this.getAnonid('editext');
					i.addEventListener('keyup', function(ev) {
						if (ev.keyCode == 13) {
							var c = _this.getAnonid('content');

							c.innerHTML = i.value;
							i.style.display = 'none';
							c.style.display = 'inline-block';

							var el = this.parentNode;
							while (el.nodeName.toLowerCase() != 'ncx:navmap') {
								if (el.nodeName.toLowerCase() == 'ncx:navpoint') el.setAttribute('draggable', 'true');
								el = el.parentNode;
							}
						}
					}, false);
				}
			},

			events: {
				dblclick: function(ev) {
					var i = this.getAnonid('editext');
					if (i.style.display == 'none') {
						var c = this.getAnonid('content');
						i.value = c.innerComponent;
						i.style.display = 'inline-block';
						c.style.display = 'none';

						var el = this.parentNode;
						while (el.nodeName.toLowerCase() != 'ncx:navmap') {
							if (el.nodeName.toLowerCase() == 'ncx:navpoint') el.setAttribute('draggable', 'false');
							el = el.parentNode;
						}
					}
				}
			}
		};

		JSElem.register('http://www.daisy.org/z3986/2005/ncx/', 'text', ncx_text);

		// --------------------------------- content
		var ncx_content = {

			template: '<input class="ncxntextinputC" style="display:none;" type="text" anonid="editsrc"></input><div class="ncxsrc" anonid="src"></div>',

			methods: {
				domString: function() {
					return '<ncx:content' + this.attrToString() + '></ncx:content>';
				},

				domInsert: function() {
					var _this = this;
					var i = _this.getAnonid('editsrc');
					i.addEventListener('keyup', function(ev) {
						if (ev.keyCode == 13) {
							var c = _this.getAnonid('src');

							c.innerHTML = i.value;
							i.style.display = 'none';
							c.style.display = 'inline-block';

							var el = this.parentNode;
							while (el.nodeName.toLowerCase() != 'ncx:navmap') {
								if (el.nodeName.toLowerCase() == 'ncx:navpoint') el.setAttribute('draggable', 'true');
								el = el.parentNode;
							}
						}
					}, false);
				}
			},

			attributes: {
				src: {
					set: function(value) {
						this.getAnonid('src').innerHTML = value;
					}
				}
			},

			events: {
				dblclick: function(ev) {
					var i = this.getAnonid('editsrc');
					if (i.style.display == 'none') {
						var c = this.getAnonid('src');
						i.value = c.innerComponent;
						i.style.display = 'inline-block';
						c.style.display = 'none';

						var el = this.parentNode;
						while (el.nodeName.toLowerCase() != 'ncx:navmap') {
							if (el.nodeName.toLowerCase() == 'ncx:navpoint') el.setAttribute('draggable', 'false');
							el = el.parentNode;
						}
					}
				}
			}
		};

		JSElem.register('http://www.daisy.org/z3986/2005/ncx/', 'content', ncx_content);
	}());
});
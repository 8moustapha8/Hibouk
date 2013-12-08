/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant splitter
 * namespace : http://www.components.org
 */
define('cp/splitter/cp_splitter', function() {
	(function() {

		var cp_splitter = {

			/**
			 * Détermine si un nœud devrait être ignoré par les fonctions itérateurs.
			 */
			isIgnorable: function(nod) {
				// Détermine si un nœud texte est entièrement composé de blancs
				var isAllWs = function(_nod) {
					return !(/[^\t\n\r ]/.test(_nod.data));
				}
				return (nod.nodeType == 8) || ((nod.nodeType == 3) && isAllWs(nod));
			},

			/**
			 * Version de |previousSibling| qui passe les nœuds entièrement constitués
			 * de blancs ou les commentaires.              2) null si un tel nœud n'existe pas.
			 */
			nodeBefore: function(sib) {
				while ((sib = sib.previousSibling)) {
					if (!cp_splitter.isIgnorable(sib)) return sib;
				}
				return null;
			},

			/**
			 * Version de |nextSibling| qui passe les nœuds qui sont entièrement constitués de
			 * blancs ou les commentaires.
			 */
			nodeAfter: function(sib) {
				while ((sib = sib.nextSibling)) {
					if (!cp_splitter.isIgnorable(sib)) return sib;
				}
				return null;
			},

			resize: function(me) {
				[].forEach.call(document.querySelectorAll('cp\\:splitter[direction="vertical"]'), function(element) {
					cp_splitter.splitterHeight(element);
				});
				//cp_splitter.iframeResize();
			},
			/*
			iframeResize : function () {
				[].forEach.call(document.querySelectorAll('iframe'), function (element) {
					var t = element.offsetTop-element.parentNode.parentNode.parentNode.offsetTop;
					var h = element.parentNode.parentNode.parentNode.offsetHeight-t-4;
					element.style.height = h+'px';
				});
			},
 */
			splitterHeight: function(elSplitter) {
				elSplitter.style.height = elSplitter.parentNode.parentNode.parentNode.style.height;
			},

			init: function(elSplitter, direction) {
				var select = false;
				var top, offsetTop, height, min, max, after, before, shadow, splitter, move;
				var pSp = elSplitter.parentNode.parentNode;

				if (direction == 'vertical') setTimeout(function() {
					cp_splitter.splitterHeight(elSplitter);
				}, 100);


				if (pSp.d == undefined) {
					if (direction == 'horizontal') {
						pSp.d = {
							_strOffsetTL: 'offsetTop',
							_strClientHW: 'clientHeight',
							_strOffsetWH: 'offsetWidth',
							_strClientWH: 'clientWidth',
							_strHW: 'height',
							_strSadowHW: 'width',
							_strTL: 'top',
							_strClientXY: 'clientY',
							_shadowClass: 'cp_shadowSplitterH'
						};
					} else {
						pSp.d = {
							_strOffsetTL: 'offsetLeft',
							_strClientHW: 'offsetWidth',
							_strOffsetWH: 'offsetHeight',
							_strClientWH: 'clientHeight',
							_strHW: 'width',
							_strSadowHW: 'height',
							_strTL: 'left',
							_strClientXY: 'clientX',
							_shadowClass: 'cp_shadowSplitterV'
						};
					}
					pSp.addEventListener('mousedown', function(event) {
						var evt = event;
						if (!event) evt = window.event;
						splitter = evt.target || evt.srcElement;
						if (splitter.nodeName.toLowerCase() == "cp:splitter") {
							event.stopPropagation();
							event.preventDefault();
							select = true;
							offsetTL = splitter[pSp.d._strOffsetTL];
							before = cp_splitter.nodeBefore(splitter);
							after = cp_splitter.nodeAfter(splitter);
							shadow = document.createElement('p');
							shadow.setAttribute('class', pSp.d._shadowClass);
							move = false;

							if (direction == 'vertical') shadow.style[pSp.d._strSadowHW] = (before.clientHeight - 2) + 'px';

							splitter.appendChild(shadow);

							max = (after[pSp.d._strOffsetTL] + after[pSp.d._strClientHW]) - splitter[pSp.d._strClientHW];
							top = offsetTL - evt[pSp.d._strClientXY];
							min = before[pSp.d._strOffsetTL];
						}
					}, false);

					elSplitter.addEventListener("dragstart", function(event) {
						event.stopPropagation();
						event.preventDefault();
						return false;
					}, false);

					pSp.addEventListener("mouseup", function(event) {
						if (select) {
							var _event = event;
							if (!event) _event = window.event;
							splitter = _event.target || _event.srcElement;
							beforeHeight = before[pSp.d._strClientHW] + height;
							afterHeight = after[pSp.d._strClientHW] - height;
							if (beforeHeight > 0 && afterHeight > 0 && move) {
								var beforeHW = beforeHeight + 'px';
								var afterHW = after[pSp.d._strClientHW] - height + 'px';
								before.style[pSp.d._strHW] = beforeHW;
								after.style[pSp.d._strHW] = afterHW;

								if (direction == 'horizontal') {
									[].forEach.call(after.querySelectorAll('cp\\:vbox'), function(element) {
										element.resizeVboxHeight();
									});
									[].forEach.call(after.querySelectorAll('cp\\:splitter[direction="vertical"]'), function(element) {
										cp_splitter.splitterHeight(element);
									});
									[].forEach.call(before.querySelectorAll('cp\\:vbox'), function(element) {
										element.resizeVboxHeight();
									});
									[].forEach.call(before.querySelectorAll('cp\\:splitter[direction="vertical"]'), function(element) {
										cp_splitter.splitterHeight(element);
									});
								} else {
									[].forEach.call(after.querySelectorAll('cp\\:hbox[last="true"]'), function(element) {
										setTimeout(function() {
											element.resizeHbox();
										}, 200);
									});
								}
								// First create the event
								var splitEvent = document.createEvent('Event');
								splitEvent.initEvent('splitmove', true, true);
								splitter.dispatchEvent(splitEvent);
								var ev = document.createEvent('Event');
								ev.initEvent('resize', true, true);
								window.dispatchEvent(ev);
							}
							shadow.parentNode.removeChild(shadow);
							select = false;
						}
					}, false);

					pSp.addEventListener("mousemove", function(event) {
						if (select) {
							var evt = event;
							if (!event) evt = window.event;
							var y = evt[pSp.d._strClientXY] + top;

							if (y < max && y > min) {
								move = true;
								height = y - offsetTL;
								shadow.style[pSp.d._strTL] = height + 'px';
							}
						}
					}, false);
				}
			},

			methods: {
				domCreate: function() {
					window.addEventListener('resize', cp_splitter.resize, false);
				},
				domInsert: function() {
					// on recherche la direction du splitter
					var direction = this.getAttribute('direction');
					if (!direction) {
						direction = 'horizontal';
						var before = cp_splitter.nodeBefore(this);
						if (before) {
							if (before.nodeName.toLowerCase() == 'cp:vbox') direction = 'vertical';
						}
						this.setAttribute('direction', direction);
					}
					// initialisation
					cp_splitter.init(this, direction);
				},
				domString: function() {
					return '<cp:splitter' + this.attrToString() + '></cp:splitter>';
				}
			}
		};
		JSElem.register('http://www.components.org','splitter',cp_splitter);

	}());
});
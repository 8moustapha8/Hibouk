/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor - partie composer
 * namespace : http://www.components.org
 */
define('cp/editor/cp_composer',function() {
	(function() {

		var _composers = [];

		var _activeID = _activeElement = _editor = _treeNodes = null;
		var _selectedNodes = [];

		var TREELIST = '_treeList_';

		var _attrTmpList = [TREELIST];
		var _classTmpList = [];

		var _clearClass = function (doc, _class) {
			var __class = '.' + _class.join(', .') ;
			[].forEach.call(doc.querySelectorAll(__class),function(el) {
				_class.forEach(function(c){
					el.classList.remove(c);
				});
			});
		};

		var _clearAttr = function (doc, attrs) {
			var _attrs = '[' + attrs.join('], [') + ']';
			[].forEach.call(doc.querySelectorAll(_attrs),function(el) {
				attrs.forEach(function(attr){
					el.removeAttribute(attr);
				});
			});
		};

		var _clearContent = function (doc) {
			_clearAttr(doc,_attrTmpList);
			_clearClass(doc,_classTmpList);
		};

		var targetEvents = {
			over : function (event) {
				var node = event.target;
				if(node.nodeName.toLowerCase()!='body') {
					node.classList.add('__Pointer__');
				}
			},
			out : function (event) {
				var node = event.target;
				if(node.nodeName.toLowerCase()!='body') {
					node.classList.remove('__Pointer__');
				}
			},
			select : function(event) {
				var _target = event.target;
				var _id = _target.getAttribute('id');
				if(_id==undefined){
					_id = 'e_'+new Date().getTime();
					_target.setAttribute('id',_id);
				}
				targetEvents.remove(this);
				this._targetCallback(_id);
			},
			remove : function(body) {
				body.removeEventListener('mouseover', targetEvents.over);
				body.removeEventListener('mouseout', targetEvents.out);
				body.removeEventListener('mousedown', targetEvents.select);
				[].forEach.call(body.querySelectorAll('.__Pointer__'),function(el) {
					el.classList.remove('__Pointer__');
				});
				body._target = false;
			},
			add : function(body,callback){
				if(body._target==undefined || body._target==false) {
					body._target = true;
					body._targetCallback = callback;
					body.addEventListener("mouseover", targetEvents.over);
					body.addEventListener("mouseout", targetEvents.out);
					body.addEventListener("mousedown", targetEvents.select);
				}
			}
		};

		var _undoRedo = function(size) {

			// private
			var pile = [], index = -1, oldVal = null;

			// public
			return {
				save : function(val,callback,data) {
					if(val != oldVal){
						oldVal = val;
						pile = pile.slice(0,index+1);
						pile.push({val:val,callback:callback,data:data});
						index = pile.length-1;
						if(pile.length>size) {
							pile.shift();
							index--;
						}
					}
				},

				undo : function(){
					var x = 0;
					if( (index == pile.length-1) && (pile.length>1) )
						x = -1;

					var save = pile[(index+x)];
					if(!save)
						return;

					index = index-1+x;
					save.callback.apply(_editor, [save.val,save.data]);
					return index !== -1;
				},

				redo : function(){
					var x = 0;
					if( (index == -1) && (pile.length>1) )
						x = +1;

					var save = pile[index+1+x];
					if(!save)
						return;

					index = index+1+x;
					save.callback.apply(_editor, [save.val,save.data]);
					return index < (pile.length - 1);
				},

				hasUndo: function () {
					return index !== -1;
				},

				hasRedo: function () {
					return index < (pile.length - 1);
				}
			};
		};

		var _treeElements = function (doc, node) {
			_clearAttr(doc, [TREELIST]);
			while (node) {
				if(node.nodeName.toLowerCase()=='body') {
					node = null;
				} else {
					if(node.nodeName != "#text")
						node.setAttribute(TREELIST,'');
					node = node.parentNode;
				}
			}

			return doc.querySelectorAll('['+TREELIST+']');
		};

		var _defautValue = function (v,d) {
			return (v === undefined) ? d : v;
		};

		var _loadIframe = function ( event ) {

			var cw = this.contentWindow;
			var doc = cw.document;

			// insertion du css pour l'édition
			var cssfile = this.getAttribute('cssfile');
			if(cssfile!='') {
				var link = doc.createElement('link');
				link.setAttribute('rel','stylesheet');
				link.setAttribute('type','text/css');
				link.setAttribute('class','__editor__');
				link.setAttribute('href',cssfile);
				doc.querySelector('head').appendChild(link);
			}

			// mise en édition
			var edit = this.getAttribute('edit');
			if(edit!='false')
				doc.body.setAttribute('contenteditable',edit);

			// script js dans la source
			var scriptfile = this.getAttribute('scriptfile');

			if(scriptfile!='null') {
				var sc = document.createElement("script");
				sc.setAttribute("type", "text/javascript");
				sc.setAttribute('class','__editor__');
				sc.setAttribute("src", scriptfile);
				doc.querySelector('head').appendChild(sc);
			}

			// events
			var treeEvent = function (ev) {

				//var node = cw.getSelection().focusNode;
				var node = ev.target;

				if(node) {
					if(node.nodeName == "#text")
						node = node.parentNode;
				} else {
					node = null;
				}

				if(node != null && _selectedNodes[0]!=node) {
					_selectedNodes = [node];
					_treeNodes = _treeElements(doc,node);
					var i = _treeNodes.length-1;
					_editor.notify.pub('document:treeChange',[{nodes:_treeNodes,index:i}]);
					_editor.notify.pub('document:selectedNodesChange',[{nodes:_selectedNodes,index:i}]);
				}
			};
			var oldSel = null;
			var rangeEvent = function (ev) {
				var sel = cw.getSelection();
				if (!sel.isCollapsed) {// pas un seul point donc une selection
					oldSel = sel;
					_editor.notify.pub('document:rangeChange',[{selection:sel}]);
				} else if(oldSel!=null) {
					oldSel = null;
					_editor.notify.pub('document:rangeChange',[{selection:null}]);
				}
			};

			doc.body.addEventListener("keyup", function(event) {
				var charCode = (event.which) ? event.which : event.keyCode;
				treeEvent(event);
				rangeEvent(event);
				_editor.notify.pub('document:keyup',[{event:event,charCode:charCode}]);
				_editor.notify.pub('document:contentChange');
			});
			doc.body.addEventListener("keydown", function(event) {
				var charCode = (event.which) ? event.which : event.keyCode;

				// pour les touches Entrée et effacer on vide la liste de l'arbre
				if (charCode === _editor.keysCodes.ENTER_KEY || charCode === _editor.keysCodes.BACKSPACE_KEY || charCode === _editor.keysCodes.DELETE_KEY) {
					_clearAttr(doc, [TREELIST]);
					_selectedNodes = [];
				}
				// nouveau mot
				if (charCode === _editor.keysCodes.SPACE_KEY || charCode === _editor.keysCodes.ENTER_KEY)
						_editor.notify.pub('document:newword');
				_editor.notify.pub('document:keydown',[{event:event,charCode:charCode}]);
			});
			doc.body.addEventListener("keypress", function(event) {
				var charCode = (event.which) ? event.which : event.keyCode;
				_editor.notify.pub('document:keypress',[{event:event,charCode:charCode}]);
			});
			doc.body.addEventListener("mousedown", function(event) {
				_editor.notify.pub('document:mousedown',[{event:event}]);
			});
			doc.body.addEventListener("mouseup", function(event) {
				_editor.notify.pub('document:mouseup',[{event:event}]);
				treeEvent(event);
				rangeEvent(event);
			});
			doc.body.addEventListener("paste", function(event) {
				_editor.notify.pub('document:paste',[{event:event}]);
			});

			_editor.notify.pub('composer:load',[{composer:this}]);

			if(_editor.composer.target){
				if(doc.body._target==undefined || doc.body._target==false)
					targetEvents.add(doc.body,_editor.composer.targetCallback);
			}
		};

		var composer = function(editor) {
			_editor = editor;
			return {

				init : function(){
					editor.notify.sub('document:keyup',function(data){
						if (data.charCode === editor.keysCodes.SPACE_KEY || data.charCode === editor.keysCodes.ENTER_KEY)
							editor.notify.pub('document:newword');
						return [data];
					});

					editor.notify.sub('document:contentChange',function(){
						_composers[_activeID].change = true;
					});

					$req(['js/ace/ace'],function() {
						$req(['js/ace/ext-language_tools'],function() {
							ace.require("ace/ext/language_tools");
						});
					});
				},
				getResizeHeight : null,
				resize : function(height) {
					for(var id in _composers){
						var inspector = _composers[id].inspector;
						if(inspector.changeResize){
							inspector.changeResize(height);
							inspector.resize();
						}
					}
				},
				add : function ( file, href, edit, cssfile, scriptfile, typefile ) {
					// vérifier que fichier n'a pas déjà été édité
					if(_composers[href]==undefined) {
						var div = document.createElement('div');
						var inspector = document.createElement('cp:inspector');
						inspector.style.display = 'none';
						div.appendChild(inspector);
						var iframe = document.createElement('iframe');
						iframe.style.display = 'block';
						iframe.classList.add('editor_iframe');
						iframe.setAttribute('edit',_defautValue(edit,'false'));
						iframe.setAttribute('cssfile',_defautValue(cssfile,''));
						iframe.setAttribute('scriptfile',_defautValue(scriptfile,''));
						iframe.setAttribute('typefile',_defautValue(typefile,''));
						iframe.onload = _loadIframe;
						var random = '?random='+(new Date()).getTime()+Math.floor(Math.random()*1000000);
						iframe.src = file+random;
						div.style.display = 'none';
						div.appendChild(iframe);
						editor.appendChild(div);
						_composers[href] = {
							href : href,
							file : file,
							component : div,
							inspector : inspector,
							mode : 'edit',
							change : false,
							undoRedo : _undoRedo(editor.UNDOSIZE),
							undoState : false,
							redoState : false,
						};
						return true;
					} else {
						return false;
					}
				},

				del : function( id ) {
					if(_composers[id]!=undefined) {
						if(_activeID==id) {
							_activeID = null;
							_activeElement = null;
						}
						var oldKey = '', c = null, c_ok = false;


						for (var key in _composers) {
							if(key==id) {
								if(oldKey!='')
									c = oldKey;
								c_ok = true;
							} else {
								oldKey = key;
								if(c_ok) {
									c_ok = false;
									c = key;
								}
							}
						}

						editor.removeChild( _composers[id].component );
						delete _composers[id];
						editor.notify.pub('composer:destroy',[{id:id}]);
						if(c==null)
							editor.notify.pub('composer:empty');
						return c;
					} else {
						return false;
					}
				},

				closeAll : function () {
					for(var id in _composers)
						this.del(id);
				},

				show : function( id ) {
					var _return = false;
					if(_composers[id]!=undefined) {
						if(_activeID!=id) {
							// on cache le composer en édition
							if(_activeID!=null) {
								_composers[_activeID].component.style.display = 'none';
								editor.notify.pub('composer:hide',[_composers[_activeID]]);
							}
							_composers[id].component.style.display = 'block';
							_activeID = id;
							_activeElement = _composers[id].component.querySelector('iframe');
							this.unSelect();

							// target Event
							var _body = _activeElement.contentWindow.document.body;
							if(this.target){
								if(_body._target==undefined || _body._target==false)
									targetEvents.add(_body,this.targetCallback);
							} else {
								if(_body._target)
									targetEvents.remove(_body);
							}
							editor.notify.pub('composer:show',[_composers[_activeID]]);
							_return = true;
						}
					}
					return _return;
				},

				target : false,
				targetCallback : null,

				setTarget : function(callback) {
					var _this = this;
					this.target = true;
					if(_activeID!=null && this.target) {
						this.targetCallback = function(){
							 var args = Array.prototype.slice.call(arguments, 0);
							 args.push(_activeID);
							 _this.target = false;
							 callback.apply(_this, args);
						};
						targetEvents.add(_activeElement.contentWindow.document.body,this.targetCallback);
					}
				},

				toogleView : function () {
					if(_activeID!=null) {
						var doc = _activeElement.contentWindow.document;
						var body = doc.body;
						var inspector = _composers[_activeID].inspector;
						if(inspector.style.display=='none') {
							inspector.set(this._getContent(_activeID,null),editor);
							inspector.style.display='block';
							_activeElement.style.display='none';
							_composers[_activeID].mode = 'source';
						} else {
							var txt = inspector.get();
							inspector.style.display='none';
							_activeElement.style.display='block';
							_composers[_activeID].mode = 'edit';
							setTimeout(function(){
								var range = _activeElement.contentWindow.document.createRange();
								range.selectNodeContents(body);
								var sel = _activeElement.contentWindow.getSelection();
								sel.removeAllRanges();
								sel.addRange(range);
								_activeElement.contentWindow.document.execCommand('insertHTML', false, txt);
							}, 500);
						}
						this.unSelect();
						editor.notify.pub('composer:toogleView',[_composers[_activeID]]);
						editor.notify.pub('document:contentChange');
						return _composers[_activeID].mode;
					}
				},

				isAdd : function ( id ) {
					if(_composers[id]!=undefined)
						return true;
					else
						return false;
				},

				getContent : function( options ) {
					if(_activeID!=null) {
						return this._getContent(_activeID,options);
					} else {
						return null;
					}
				},

				_getContentFromIframe : function( id, options ) {
					var iframe = _composers[id].component.querySelector('iframe')
					var doc = iframe.contentWindow.document,
						contentSource = null;

					_clearContent(doc);

					var contenteditable = doc.body.getAttribute('contenteditable');
					if(contenteditable!=undefined)
							doc.body.removeAttribute('contenteditable');
					// suppression du css
					var cssfile = iframe.getAttribute('cssfile');
					// suppression du js
					var scriptfile = iframe.getAttribute('scriptfile');

					if(scriptfile!='') {
						// vérifier si une action de génération de la sortie n'est pas présente
						if(_activeElement.contentWindow.$getContent!=undefined)
							contentSource = _activeElement.contentWindow.$getContent(options);
					}

					if(contentSource==null)
						contentSource = new XMLSerializer().serializeToString(doc);

					// nettoyer contentSource
					if(cssfile!='')
						contentSource = contentSource.replace(/<link.*?class="__editor__".*?\/>/gi,'');
					if(scriptfile!='')
						contentSource = contentSource.replace(/<script.*?class="__editor__".*?><\/script>/gi,'');

					if(contenteditable!=undefined)
							doc.body.setAttribute('contenteditable',contenteditable);
					return contentSource;
				},

				_getContent : function( id, options ) {
					var ct = this._getContentFromIframe( id, options );
					if(_composers[id].mode == 'edit') {
						return ct;
					} else {
						var txt = _composers[id].inspector.get();
						return ct.replace(/(<body[^>]*>)((?:.|\r?\n)*?)<\/body>/gi,'$1'+txt+'</body>');
					}
				},

				unSelect : function () {
					_selectedNodes = [];
					_treeNodes = null;
					_editor.notify.pub('document:rangeChange',[{selection:null}]);
					_editor.notify.pub('document:treeChange',[{nodes:null,index:null}]);
					_editor.notify.pub('document:selectedNodesChange',[{nodes:null,index:null}]);
				},

				getComposer : function () {
					if(_activeID!=null) {
						return _composers[_activeID];
					} else
						return null;
				},

				getSaves: function (_saves,options) {
					var _files = [];
					_saves.forEach(function(item){
						_files.push(item.file);
					});
					for (var key in _composers) {
						if(_composers[key].change){
							if (_files.indexOf(key) == -1)
								_saves.push({file:key,content:this._getContent(key,options)});
							_composers[key].change = false;
						}
					}
					_editor.notify.pub('document:save');
					return _saves;
				},

				refreshAll: function () {
					for (var key in _composers){
						var random = '?random='+(new Date()).getTime()+Math.floor(Math.random()*1000000);
						_composers[key].component.querySelector('iframe').src = _composers[key].file+random;
					}
				},

				getProperty : function (value) {
					if(_activeID!=null) {
						return _composers[_activeID][value];
					} else
						return null;
				},

				// a supprimer
				getActiveID : function () {
					return _activeID;
				},

				setEffect : function (el) {
					if(_activeID!=null) {
						el.classList.add('__Effect__');
						setTimeout(function(){
							el.classList.remove('__Effect__');
						}, 500);
					}
				},

				getComposerElement : function () {
					return _activeElement;
				},

				getSelectedNodes : function () {
					return _selectedNodes;
				},

				setSelectedNodes : function (nodes,i) {// nodes is array
					_selectedNodes = nodes;
					_editor.notify.pub('document:selectedNodesChange',[{nodes:_selectedNodes,index:i}]);
				},

				getTreeNodes : function () {
					return _treeNodes;
				},

				addAttrTmp : function (value) {
					_attrTmpList.push(value);
				},

				addClassTmp : function (value) {
					_classTmpList.push(value);
				}
			}
		};

		JSElem.extendComponent('http://www.components.org','editor',{composer :composer});
	}());
});
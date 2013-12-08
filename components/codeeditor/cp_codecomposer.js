/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant codeeditor - partie composer
 * namespace : http://www.components.org
 */
define('cp/codeeditor/cp_codecomposer',function() {
	(function() {

		var _composers = [];

		var _activeID = null;

		var modeEDitor = {
			css : 'css',
			html : 'html',
			xhtml : 'html',
			html : 'html',
			htmltest : 'html',
			js : 'javascript',
			jstest : 'javascript',
			json : 'json'
		};

		var _idCount = 0;

		var _creatEditor = function ( editor, ext, target, _compo ) {
			_idCount++;
			var id = 'codeeditor_'+_idCount;
			var pre = document.createElement('pre');
			pre.classList.add('preEditor');
			pre.id = id;
			pre.style.fontSize = '14px';
			editor.appendChild(pre);
			var _acePre = ace.edit(id);
			_acePre.setTheme("ace/theme/textmate");
			var session = _acePre.getSession();
			session.setMode("ace/mode/"+ext);
			session.setUseSoftTabs(false);
			session.setUseWrapMode(true);
			session.setWrapLimitRange(null, null);
			//_acePre.setShowInvisibles(true);

			_acePre.setOptions({
				useElasticTabstops: true,
				enableBasicAutocompletion: true,
				enableSnippets: true
			});

			_acePre.addEventListener('change', function (ev) {
				_compo.change = true;
				editor.notify.pub('document:contentChange');
			}, false);

			var _changeDisplay = function(el){
				return function(display){
					el.style.display = display;
				};
			};
			var _changeResize = function(el){
				return function(height){
					el.style.height = height;
				};
			};
			var _kill = function(el){
				return function(){
					el.parentNode.removeChild(el);
				};
			};
			var el = document.getElementById(id);
			_acePre.changeDisplay = _changeDisplay(pre);
			_acePre.changeResize = _changeResize(pre);
			_acePre.kill = _kill(pre);
			_acePre.changeResize(editor.composer.getResizeHeight());
			return _acePre
		};

		var composer = function(codeeditor) {
			return {

				init : function(){
					$req(['js/ace/ace'],function() {
						$req(['js/ace/ext-language_tools'],function() {
							ace.require("ace/ext/language_tools");
						});
					});
				},
				getResizeHeight : null,
				resize : function(height) {
					for(var id in _composers){
						var pre = _composers[id].pre;
						pre.changeResize(height);
						pre.resize();
					}
				},
				add : function ( file, href ) {
					// vérifier que fichier n'a pas déjà été ajouté
					if(_composers[href]==undefined) {
						var ext = modeEDitor[file.substr(file.lastIndexOf(".")+1).toLowerCase()];
						_composers[href] = {
							href : href,
							file : file,
							extension : ext,
							change : false,
							content : null
						};

						_composers[href].pre = _creatEditor(codeeditor,ext,href,_composers[href]);
						return true;
					} else {
						return false;
					}
				},

				del : function( id ) {
					if(_composers[id]!=undefined) {
						if(_activeID==id)
							_activeID = null;

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
						_composers[id].pre.kill();
						delete _composers[id];
						codeeditor.notify.pub('codecomposer:destroy',[{id:id}]);
						if(c==null)
							codeeditor.notify.pub('codecomposer:empty');
						return c;
					} else {
						return false;
					}
				},

				closeAll : function () {
					for(var id in _composers)
						this.del(id);
				},

				load : function (id, callback) {
					if(_composers[id].content==null) {
						var random = '?random='+(new Date()).getTime()+Math.floor(Math.random()*1000000);
						$req('xhr!'+_composers[id].file+random, function (f) {
							_composers[id].content = true;
							_composers[id].pre.getSession().setValue(f);
							callback();
						});
					}
				},

				show : function( id ) {
					var _return = false;
					if(_composers[id]!=undefined) {
						if(_activeID!=id) {
							// on cache le composer en édition
							if(_activeID!=null) {
								_composers[_activeID].pre.changeDisplay('none');
								codeeditor.notify.pub('codecomposer:hide',[_composers[_activeID]]);
							}

							_activeID = id;
							var pre = _composers[_activeID].pre;
							var _finalShow = function(){
								pre.changeDisplay('block');
								pre.focus();
								codeeditor.notify.pub('codecomposer:show',[_composers[_activeID]]);
							};
							if(_composers[id].content==null) {
								this.load(id, _finalShow);
							} else {
								_finalShow();
							}
							_return = true;
						}
					}
					return _return;
				},

				isAdd : function ( id ) {
					if(_composers[id]!=undefined)
						return true;
					else
						return false;
				},

				getContentID : function( id ) {
					return _composers[id].pre.getSession().getValue();
				},

				getContent : function() {
					if(_activeID!=null)
						return this.getContentID(_activeID);
					else
						return null;
				},

				getSaves: function (_saves) {
					for (var key in _composers) {
						if(_composers[key].change){
							_saves.push({file:key,content:this.getContentID(key)});
							_composers[key].change = false;
						}
					}
					codeeditor.notify.pub('codecomposer:save');
					return _saves;
				},

				getComposer : function () {
					if(_activeID!=null) {
						return _composers[_activeID];
					} else
						return null;
				},

				getProperty : function (value) {
					if(_activeID!=null) {
						return _composers[_activeID][value];
					} else
						return null;
				}
			}
		};

		JSElem.extendComponent('http://www.components.org','codeeditor',{composer :composer});
	}());
});
/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant inspector
 * namespace : http://www.components.org
 */
define('cp/editor/cp_inspector',function() {
	(function() {

		var _idCount = 0;

		var _initInspector = function(_this,editor) {
			_idCount++;
			var id = 'codeeditor_edit'+_idCount;
			var codeeditor = _this.getAnonid('editor');
			codeeditor.id = id;
			var _acePre = ace.edit(id);
			_acePre.setTheme("ace/theme/textmate");
			var session = _acePre.getSession();
			session.setMode("ace/mode/html");
			session.setUseSoftTabs(false);
			session.setUseWrapMode(true);
			session.setWrapLimitRange(null, null);

			_acePre.setOptions({
				useElasticTabstops: true,
				enableBasicAutocompletion: true,
				enableSnippets: true
			});

			_acePre.addEventListener('change', function (ev) {
				editor.notify.pub('document:contentChange');
			}, false);

			var _changeResize = function(el){
				return function(height){
					el.style.height = height;
				};
			};
			_this.changeResize = _changeResize(codeeditor);
			_this.changeResize(editor.composer.getResizeHeight());
			return _acePre
		};

		var cp_inspector = {

			template : '<pre class="editor_edition" style="font-size:14px" anonid="editor"></pre>',

			methods : {
				domString : function () {
					return this.innerComponent;
				},

				set : function (content,editor) {
					var _this = this;
					if(this.acePre == undefined)
						this.acePre = _initInspector(this,editor);

					var match = content.match(/<body[^>]*>((?:.|\r?\n)*?)<\/body>/i);
					var content = match[1].replace(/ xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,'');
					this.acePre.getSession().setValue(content);
				},

				get : function () {
					if(this.acePre == undefined)
						return '';
					else {
						var content = this.acePre.getSession().getValue();
						content = content.replace(/ xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g,'');
						return content;
					}
				},
				resize : function(){
					if(this.acePre != undefined)
					this.acePre.resize();
				}
			}
		};

		JSElem.register('http://www.components.org','inspector',cp_inspector);
	}());
});
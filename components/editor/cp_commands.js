/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor - partie commands
 * namespace : http://www.components.org
 */
define('cp/editor/cp_commands',function() {
	(function() {

		var _commands = {};

		var _state = {};

		var _rangestate = {};

		var commands  = function(editor) {

			return {

				init : function(){
					var _this = this;
					this.fnHideList = [];
					this.elementIndex = null;
					this.rangeState = null;
					this.getComposerElement = editor.composer.getComposerElement;

					editor.notify.sub('document:rangeChange',function(data){
						if(data.selection !== _this.rangeState) {
							_this.hide();
							_this.rangeState = data.selection;
							_this.fnHideList = _this.show();
						}
						return [data];
					});

					editor.notify.sub('document:selectedNodesChange',function(data){
						_this.hide();
						_this.elementIndex = data.index;
						_this.fnHideList = _this.show();
						return [data];
					});

					editor.notify.sub('document:command/after',function(data){
						editor.composer.unSelect();
						_this.hide();
						return [data];
					});
				},

				hide : function () {
					this.fnHideList.forEach(function(fn){
						fn();
					});
				},

				show : function () {
					var fnHideList = [];
					if(this.rangeState) {
						for(var state in _rangestate){
								fnHideList.push(_rangestate[state].fnHide);
								_rangestate[state].fnShow();
						}
					} else {
						for(var state in _state){
							var resultState = editor.dom('[_treeList_]').reduce(this.elementIndex).filterTagName(_state[state].selectorTags);

							if(_state[state].selectorClass)
								resultState = resultState.filterClassName(_state[state].selectorClass);

							if(_state[state].computedStyle!=null)
								resultState = resultState.filterComputedStyle(_state[state].computedStyle);

							if(resultState.length()>0) {
								fnHideList.push(_state[state].fnHide);
								_state[state].fnShow(resultState);
							}
						}
					}
					return fnHideList;
				},

				getTreeDom : function () {
					return editor.dom('[_treeList_]').reduce(this.elementIndex);
				},

				registerState : function(commandName,rangeState, selectorTags, selectorClass, computedStyle, fnHide, fnShow) {
					if(rangeState)
						_rangestate[commandName] = {
							selectorTags :selectorTags,
							selectorClass:selectorClass,
							computedStyle:computedStyle,
							fnHide:fnHide,
							fnShow:fnShow,
						};
					else
						_state[commandName] = {
							selectorTags : selectorTags,
							selectorClass:selectorClass,
							computedStyle:computedStyle,
							fnHide:fnHide,
							fnShow:fnShow,
						}
				},

				registerExec : function(commandName, command) {
					_commands[commandName] = command;
				},

				execCommand : function(commandName, defaultUI, args) {
					editor.notify.pub('document:command/before');
					var result = null;
					try {
							result = this.getComposerElement().contentWindow.document.execCommand(commandName,defaultUI,args);
					} catch(e) {}
					editor.notify.pub('document:command/after',[result]);
					editor.notify.pub('document:contentChange');
					return result;
				},

				exec : function(command, args) {
					editor.notify.pub('document:command/before');
					var result = _commands[command].apply(editor, [args,this,this.getComposerElement().contentWindow.document]);
					editor.notify.pub('document:command/after',[result]);
					editor.notify.pub('document:contentChange');
					return result;
				}
			};
		};
		JSElem.extendComponent('http://www.components.org','editor',{commands :commands});
	}());
});
/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant editor - partie undo
 * namespace : http://www.components.org
 */
define('cp/editor/cp_undo',function() {
	(function() {

		// TODO : ajouter position du scroll à la sauvegarde !!!
		// TODO : récupréer la position du caret
		var undoRedo = function(editor) {

			return {
				init : function(){
					var _this = this;
					var KC = editor.keysCodes;
					this.getComposer = editor.composer.getComposer;
					this.getComposerElement = editor.composer.getComposerElement;

					// notification
					editor.notify.sub('composer:load',function(data){
						_this.save();
						return [data];
					});
					editor.notify.sub('document:newword',function(){
						_this.save();
					});
					editor.notify.sub('document:command/before',function(){
						_this.save();
					});
					editor.notify.sub('document:keydown',function(data){
						var c = data.charCode;
						// CTRL+Z / CTRL+Y
						if (!data.event.altKey && (data.event.ctrlKey || data.event.metaKey)) {
							if(c === KC.Z_KEY && !data.event.shiftKey) {
								_this.undo();
								data.event.preventDefault();
							} else if( (c === KC.Z_KEY && event.shiftKey) || (c === KC.Y_KEY) ) {
								_this.redo();
								data.event.preventDefault();
							}
						}
						// suppression
						if (c === KC.BACKSPACE_KEY || c === KC.DELETE_KEY)
							_this.save();
						return [data];
					});
				},

				restore : function(val, data) {
					this.composer.getComposerElement().contentWindow.document.body.innerHTML = val;
				},

				getUndo : function() {
					return this.getComposer().undoRedo;
				},

				save : function() {
					var val = this.getComposerElement().contentWindow.document.body.innerHTML;
					this.getUndo().save(val,this.restore,null);
					editor.notify.pub('document:undoSave');
				},

				composerUpdate : function(undoState,redoState){
					var c = this.getComposer();
					c.undoState = undoState;
					c.redoState = redoState;
					editor.notify.pub('document:undoredo',[{undo:undoState,redo:redoState}]);
				},

				undo : function(){
					var u = this.getUndo();
					var _redo = u.hasRedo();
					if(u.hasUndo()){
						if(!_redo)
						this.save();
						var r = u.undo();
						this.composerUpdate(r,u.hasRedo());
					}
				},

				redo : function(){
					var u = this.getUndo();
					if(u.hasRedo()){
						var r = u.redo()
						this.composerUpdate(u.hasUndo(),r);
					}
				},

				hasUndo: function () {
					return this.getUndo().hasUndo();
				},

				hasRedo: function () {
					return this.getUndo().hasUndo();
				}

			};
		};

		JSElem.extendComponent('http://www.components.org','editor',{undoRedo :undoRedo});
	}());
});
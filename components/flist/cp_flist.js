/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant flist
 * namespace : http://www.components.org
 */
define('cp/flist/cp_flist',function() {
	(function() {

		var flist = {

			template : '<div anonid="block" class="g_Flist" style="margin:15px;width:800px;">'
			+'<div class="g_Flist_button">'
				+'<a anonid="add" class="g_Flist_add"> </a><br/>'
				+'<a anonid="del" class="g_Flist_del"> </a><br/>'
				+'<a anonid="modify" class="g_Flist_modify"> </a><br/>'
			+'</div>'
			+'<ul anonid="list" style="max-height:200px;"></ul>'
			+'<div anonid="editBlock" class="g_Flist_editBlock">'
			+'<input anonid="edit" type="text" class="g_Flist_edit" name="g_Flist_edit" size="18"/>'
			+'<a anonid="cancel" class="g_Flist_cancel"> </a>&#160;&#160;&#160;&#160;<a anonid="save" class="g_Flist_save"> </a>'
			+'</div></div>',

			methods : {

				domInsert : function () {
					var edit = this.getAnonid('edit');
					var editBlock = this.getAnonid('editBlock');
					var _this = this;

					// event bouton ajouter
					this.getAnonid('add').addEventListener('click', function () {
						_this.noSelect();
						_this.clearEdit();
						editBlock.style.display = 'block';
					}, false);


					// event bouton supprimer
					this.getAnonid('del').addEventListener('click', function () {
						var el = _this.selected;
						if(el)
							el.parentNode.removeChild( el );

						_this.clearEdit();
					}, false);

					// event bouton modifier
					this.getAnonid('modify').addEventListener('click', function () {
						if(_this.selected) {
							edit.value = _this.selected.innerHTML;
							editBlock.style.display = "block";
						}
					}, false);

					// event bouton annuler
					this.getAnonid('cancel').addEventListener('click', function () {
						_this.noSelect();
						_this.clearEdit();
					}, false);

					// event bouton sauvegarder
					this.getAnonid('save').addEventListener('click', function () {
						if(_this.selected)
							_this.selected.innerHTML = edit.value;
						else
							_this.getAnonid('list').insertAdjacentHTML('beforeend', '<li>'+edit.value+'</li>');
						_this.noSelect();
						_this.clearEdit();
					}, false);
				},

				noSelect : function(){
					this.selected = null;
					[].forEach.call(this.getAnonid('list').querySelectorAll('li'), function (el) {
						el.style.backgroundColor = '';
					});
				},

				clearEdit : function () {
					this.getAnonid('edit').value = '';
					this.getAnonid('editBlock').style.display = 'none';
				},

				setContent : function(value) {
					var list = this.getAnonid('list');
					var _this = this;
					value.forEach(function(content) {
						list.insertAdjacentHTML('beforeend', '<li>'+content+'</li>');
					});
					[].forEach.call(list.querySelectorAll('li'), function (el,i) {
						el.addEventListener('mouseup', function () {
							_this.noSelect();
							this.style.backgroundColor = '#CFE4FF';
							_this.getAnonid('editBlock').style.display = "none";
							_this.selected = el;
						}, false);
					});
				},

				getContent : function() {
					var value = [];
					[].forEach.call(this.getAnonid('list').querySelectorAll('li'), function (el,i) {
						value.push(el.innerHTML);
					});
					return value;
				}
			},
			attributes : {
			selected : {
				set : function (value) {
					var block = this.getAnonid('block');
					var clSelect = 'g_FlistSelected';
					if(value=='true')
						block.classList.add(clSelect);
					else {
						this.noSelect();
						this.clearEdit();
						block.classList.remove(clSelect);
					}
				}
			}
		}
		};

		JSElem.register('http://www.components.org','flist',flist);
	}());
});
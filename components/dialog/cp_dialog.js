/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant dialog
 * namespace : http://www.components.org
 */
define('cp/dialog/cp_dialog',function() {

	var _zindex = 1000;
	(function() {

		var cp_dialog = {
			template : '<div class="dialogbox" anonid="box"><div class="dialogtitle" anonid="title"></div><div class="dialogcontentbox"><div class="dialogcontent" anonid="dialogcontent"><content/></div></div><div class="dialogbutton" anonid="button"><input class="dialogBcancel" type="button" anonid="cancel" value="{{$cancel}}"></input><input type="button" anonid="ok" value="{{$ok}}"></input></div></div>',

			methods : {
			    domString : function () {
					return '<cp:dialog' + this.attrToString()+ '>' + this.getAnonid('content').innerComponent + '</cp:dialog>';
				},

				domInsert : function () {
					var _this = this;
					this.getAnonid('cancel').addEventListener('click', function(){_this.parentNode.removeChild( _this );}, false);
					_this.style.overflow = 'hidden';
					setTimeout(function(){
						_zindex = _zindex+100;
						var _height = parseInt(_this.getAnonid('box').style.height,10);
						var _heightTitle = _this.getAnonid('title').offsetHeight;
						var _heightbutton = _this.getAnonid('button').offsetHeight;
						var _val = _height-(_heightTitle+_heightbutton)-15;
						_this.getAnonid('dialogcontent').style.height = _val+'px';
						_this.style.zIndex = _zindex;
						_this.getAnonid('box').style.visibility = 'visible';
						_this.style.overflow = 'auto';

					}, 200);
				},

				getButtons : function () {
					return this.getAnonid('button');
				}
			},

			properties : {
				command : {
					get : function () {
						//
					},
					set : function (fnc) {
						var _this = this;
						var _fnc = function (event) {
							if(_this.getAttribute('hide')!='no')
								_this.parentNode.removeChild( _this );
							fnc.call(_this,event);
						}
						_this.getAnonid('ok').addEventListener('click', _fnc, false);
					}
				},
				cancel : {
					get : function () {
						//
					},
					set : function (fnc) {
						var _this = this;
						var _fnc = function (event) {
							fnc.call(_this,event);
						}
						_this.getAnonid('cancel').addEventListener('click', _fnc, false);
					}
				}
			},

			attributes : {
				width : {
					get : function () {
						return this.getAnonid('box').style.width;
					},
					set : function (value) {
						this.getAnonid('box').style.width = value;
					}
				},

				height : {
					get : function () {
						return this.getAnonid('box').style.height;
					},
					set : function (value) {;
						this.getAnonid('box').style.height = value;
					}
				},

				title : {
					set : function (value) {
						this.getAnonid('title').innerHTML = value;
					}
				}
			}
		};
		$req('i18n!cp/dialog/locale/cp_dialog.json!default:en-EN', function(_lang) {
			cp_dialog.template = $tpl.render(cp_dialog.template,_lang);
			JSElem.register('http://www.components.org','dialog',cp_dialog);
		});
	}());
});
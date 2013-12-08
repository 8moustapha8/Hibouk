/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composants bibliobooks, bibliobook
 * namespace : http://www.components.org
 */
define('cp/bibliobook/ap_bibliobook',function() {
	(function() {

		var cp_bibliobooks = {
			template : '<content/>',

			methods : {
				domString : function () {
					return '<cp:bibliobook>' + this.getAnonid('content').innerComponent + '</cp:bibliobook>';
				}
			},

			attributes : {

			}
		};

		JSElem.register('http://www.components.org','bibliobooks',cp_bibliobooks);

		var cp_bibliobook = {
			template : '<div anonid="title" class="title"></div><div class="img"><img anonid="img" class="cover"/><img anonid="status" class="status"/></div>',

			methods : {

				domString : function () {
					return '<cp:bibliobook' + this.attrToString()+ '></cp:bibliobook>';
				},
				// d = new Date();
				//?"+d.getTime();

				reloadImg : function () {
					var img = this.getAnonid('img');
					var id = this.getAttribute('id');
					var d = new Date();
					img.setAttribute('src','resources/thumbnail/'+id+'.jpg?'+d.getTime());

					var status = this.getAnonid('status');
					var v = this.getAttribute('status');
					status.setAttribute('src','resources/status/'+v+'.png?'+d.getTime());
				}
			},

			attributes : {
				img : {
					get : function () {
						return this.getAnonid('img').getAttribute('src');
					},
					set : function (value) {
						this.getAnonid('img').setAttribute('src','resources/thumbnail/'+value+'.jpg');
					}
				},
				status : {
					set : function (value) {
						this.getAnonid('status').setAttribute('src','resources/status/'+value+'.png');
					}
				},
				title : {
					get : function () {
						return this.getAnonid('title').innerHTML;
					},
					set : function (value) {
						this.getAnonid('title').innerHTML = value;
					}
				}
			},

			events : {
				click : function () {
					var _bibliobooks = this.parentNode.parentNode;
					[].forEach.call(_bibliobooks.querySelectorAll('cp\\:bibliobook[selected="true"]'), function (element) {
						element.removeAttribute('selected');
					});
					this.setAttribute('selected','true');
				}
			}
		};

		JSElem.register('http://www.components.org','bibliobook',cp_bibliobook);
	}());
});
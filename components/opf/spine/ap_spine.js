/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant opf - part spine
 * namespace : http://www.idpf.org/2007/opf
 */
define('cp/opf/spine/ap_spine',function() {
	(function() {
		var _notifySave = null;
		var _epubController = null;

		var opf_spine = {

			methods : {
				domString : function () {
					return '\n\t<spine' + this.attrToString()+ '>'+this.innerComponent+'\t</spine>\n';
				},

				init : function (epubController) {
					var _this = this;
					_epubController = epubController;
					_epubController.register('spine',_this);

					_notifySave = $notify.sub(_epubController.getTargetSave(), function(obj){
						obj.msg('Spine');
						obj.spine.string = _this.domString();
						obj.spine.files = [];
						obj.spine.types = {};
						[].forEach.call(_this.querySelectorAll('opf\\:itemref'), function (element) {
					 		var mItem = element.getManifest();
					 		var type = element.getType();

					 		obj.manifest[mItem.href] = mItem;
					 		obj.spine.types[mItem.href] = type;
						});

						for (var a in obj.manifest)
							obj.spine.files.push(a);

						return [obj];
					});
				},

				close : function () {
					_epubController = null;
					$notify.unSub(_notifySave[0],_notifySave);
					_notifySave = null;
				},

				getFiles : function (linear) {
					var files = [];
					[].forEach.call(this.querySelectorAll('opf\\:itemref'), function (element) {
						if(linear==undefined) {
							files.push(element.getAttribute('href'));
						} else {
							if(element.getAttribute('linear'))
								files.push(element.getAttribute('href'));
						}
					});
					return files;
				},

				getItemref : function () {
					return this.querySelectorAll('opf\\:itemref');
				},

				delItemref : function (idref) {
					this.removeChild( this.querySelector('opf\\:itemref[idref="'+idref+'"]') );
				},

				insertNewItem : function ( idref, href, mediaType, guideType, position ) {
					if(position==undefined)
						position = 'beforeend';
					this.insertComponent(position,'<opf:itemref idref="'+idref+'" href="'+href+'" media-type="'+mediaType+'" guidetype="'+guideType+'" linear="yes"></opf:itemref>');
				},

				delGuidetype: function ( guidetype ) {
					var _this = this;
					[].forEach.call(this.querySelectorAll('opf\\:itemref[guidetype="'+guidetype+'"]'), function (element) {
					 		_this.delItemref(element.getAttribute('idref'));
					});
				},

				getPathFromItem: function (position) {
					var path = '';
					if(position==undefined)
						position = 0;
					var item = this.querySelectorAll('opf\\:itemref')[position];
					if(item!=undefined) {
						var _file = item.getAttribute('href').split('/');
						_file.pop();
						_file.forEach(function(n){
							path += n+'/';
						});
					}
					return path;
				}
			}
		};

		JSElem.register('http://www.idpf.org/2007/opf','spine',opf_spine);

	}());
});
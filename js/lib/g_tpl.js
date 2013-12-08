/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
* Moteur de template
*/
(function() {

	var _getTpl = function ( script ) {
		var s = script.match(/\{\{template([^\}]*)\}\}([\s\S]*?)\{\{\/template\}\}/);
		var attributes = (s[1].trim()).split(' ');
		var tabTPL = {
			content : s[2]
		};
		attributes.forEach(function(attrs) {
			var vk = attrs.split('=');
			if(vk.length>1)
				tabTPL[vk[0]] = vk[1].substr(1,vk[1].length-2);
		});
		return tabTPL;
	};

	var tpl = {

		//(inspiration : https://github.com/trix/nano)
		render : function (template, data) {
			return template.replace(/\{\{\$([\w\.]*)\}\}/g, function (str, key) {
				var keys = key.split("."), value = data[keys.shift()];
				keys.forEach( function (val) {value = value[val]; });
					return (value === null || value === undefined) ? "" : value;
			});
		},

		loadTemplate : function ( templates ) {

			var tpls = {};
			var tab = templates.match(/\{\{template([^\}]*)\}\}([\s\S]*?)\{\{\/template\}\}/g);

			if(tab) {
				tab.forEach(function(_script,index) {
					var _tpl = _getTpl(_script);
					if(_tpl.id==undefined)
						_tpl.id = index;
					tpls[_tpl.id] = {
						content : _tpl.content,
						overlay : [_tpl['overlay'],_tpl['insert']]
					};
				});
				return tpls;
			} else {
				return null;
			}
		}
	};
	window.$tpl = tpl;
})();
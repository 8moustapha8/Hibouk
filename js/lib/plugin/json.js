/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Plugin JSON
 */
define($pluginPath+'json',function() {
	var req_plugin_tpl = {
		load : function ( map, require, callback, config ) {
			// fichier par défaut
			if(map.ext=='.js') {
				map.ext = '.json';
				map.url = map.url+map.ext;
			}

			var _callback = function (data) {
				callback(JSON.parse(data));
			};

			if($definition[map.id]==undefined) // ressource non chargé
				$definition[$pluginPath+'xhr'].load.apply(null,[map, require, _callback, config]);
		}
	};
	return req_plugin_tpl;
});
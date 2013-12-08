/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Plugin i18n
 */
define($pluginPath+'i18n',function() {

	var localePath = function ( target, DS, lang ) {
		return target.replace('locale','locale'+DS+lang);
	};

	var _load = function(map, require, _callback, config){
		if($definition[map.id]==undefined) // ressource non chargé
				$definition[$pluginPath+'xhr'].load.apply(null,[map, require, _callback, config]);
	};

	var req_plugin_i18n = {
		load : function ( map, require, callback, config ) {
			// fichier par défaut
			if(map.ext=='.js') {
				map.ext = '.json';
				map.url = map.url+map.ext;
			}

			// enregistrement de l'URL (en cas d'erreur pour la langue en court)
			var mapURL = map.url;

			// script de la langue en court
			map.url = localePath(mapURL,config.DS,config.locale);

			// premier passage
			var passOne = true;

			var _callback = function (data) {
				if(data==null && map.plugOptions['default']!=undefined && passOne) {
					passOne = false;
					// script de la langue par défaut
					map.url = localePath(mapURL,config.DS,map.plugOptions['default']);

					_load(map, require, _callback, config);
				} else {
					callback(JSON.parse(data));
				}
			};
			_load(map, require, _callback, config);
		}
	};
	return req_plugin_i18n;
});
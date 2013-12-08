/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Plugin CSS
 */
define($pluginPath+'css',function() {

	var req_plugin_css = {
		load : function ( map, require, callback, config ) {
			// fichier par défaut
			if(map.ext=='.js') {
				map.ext = '.css';
				map.url = map.url+map.ext;
			}

			var c = function(){
				if($definition[map.id]==undefined)
					callback(null);
			};

			if (config.UIType=='xul') {
				var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
				var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var uri = ios.newURI(map.url, null, null);
				sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
				c();
			} else {
				var cssElem =document.createElement("link");
				cssElem.setAttribute("rel", "stylesheet");
				cssElem.setAttribute("type", "text/css");
				cssElem.setAttribute("href", map.url);
				document.getElementsByTagName('head')[0].appendChild(cssElem);
				c(null);
			}
		}
	};

	return req_plugin_css;
});
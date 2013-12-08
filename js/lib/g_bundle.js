/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * bundles loader
 */
(function() {
	var _load = function ( name, bundle, callback) {
		// +$log('Load package:'+name);
		var filesLoad = [];

		// tpl
		if (bundle.tpl!=undefined)
			filesLoad.push(bundle.tpl);

		// css
		if (bundle.css!=undefined)
			filesLoad.push(bundle.css);

		// les locales
		var _locales = true;
		if (bundle.locale!=undefined)
			filesLoad.push(bundle.locale);
		else
			_locales = false;

		var initbundle = function () {
			// lancement de la function ou chargement du script d'initialisation
			if (bundle.init!=undefined) {
				if (typeof bundle.init =='function')
					bundle.init(callback);
				else
					$req(bundle.init,callback);
			} else {
				if (callback!=undefined)
					callback();
			}
		};

		var loadbundle = function (filesLoad) {
			$req(filesLoad,
				function (tpls, _lang) {
					var tplRender = '';
					if (!_locales)
						_lang = false;
					if (tpls) {
						for (var t in tpls) {
							// on passe par un moteur de template JS si la langue existe
							if (tpls[t] && _lang)
								tplRender = $tpl.render(tpls[t].content,_lang);
							else
								tplRender = tpls[t].content;

							if (tpls[t].overlay[0]!=undefined)
								document.getElementById(tpls[t].overlay[0]).insertComponent(tpls[t].overlay[1],tplRender);
						}
					}
					initbundle();
				}
			);
		};
		// insertion des namespace pour les composants
		if (bundle.componentsNamespace!=undefined) {
			for (var namespace in bundle.componentsNamespace)
				JSElem.namespace.add(namespace,bundle.componentsNamespace[namespace]);
		}
		if (bundle.components!=undefined) {
			// chargement des composants pour l'appli
			var allComponents = [];
			for (var cp in bundle.components)
				bundle.components[cp].forEach(function(i){allComponents.push(i)});

			$req(allComponents,function(){
				loadbundle(filesLoad);
			});
		} else {
			loadbundle(filesLoad);
		}
	};

	var config = {
		bundlesFiles : {}
	};

	var register = {};

	window.$bundles = function ( category, name, callback ) {
		if(config.bundlesFiles[category]) {
			$req(config.bundlesFiles[category], function (ex) {
				if(ex[name])
					_load(name,ex[name],callback);
				else
					$log('Name of the bundle does not exist:'+name);
			});
		} else {
			$log('Class of the bundle does not exist:'+category);
		}
	};

	$bundles.config = function ( _config ) {
		for (var key in _config)
			config[key] = _config[key];
	};

	$bundles.register = function ( category, name, data ) {
		if(register[category]==undefined)
			register[category] = {};
		register[category][name] = {data:data,l:false};
	};

	$bundles.load = function ( category, name ) {
		if(register[category]!=undefined && register[category][name]!=undefined) {
			if(!register[category][name].data.l) {
				$bundles(category, name, register[category][name].data.load);
				register[category][name].data.l = true;
			}
		}
	};

	$bundles.unload = function ( category, name ) {
		if(register[category]!=undefined && register[category][name]!=undefined) {
			if(register[category][name].data.l) {
				$req(config.bundlesFiles[category], function (ex) {
					$req(ex[name].init,register[category][name].data.unload);
				});
				register[category][name].data.l = false;
			}
		}
	};
})();
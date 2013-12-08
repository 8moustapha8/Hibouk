/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Initialisation
 */
"use strict";

(function() {

	var browserTest = function(browser) {
		var browserKnow = 'unknow';
		var goodVersion = false;
		switch (browser.name) {
			case 'Chrome':
				browserKnow = browser.name;
				if (browser.version >= 24) goodVersion = true;
				break;
			case 'Firefox':
				browserKnow = browser.name;
				if (browser.version >= 18) goodVersion = true;
				break;
			/*

			TODO :
			case 'Explorer':
				browserKnow = browser.name;
				if (browser.version >= 10) goodVersion = true;
				break;
			case 'Safari':
				browserKnow = browser.name;
				if (browser.version >= 5.1) goodVersion = true;
				break;
			*/
		};

		if (browserKnow == 'unknow') {
			alert('Untested browser. The application may not work optimally (O,O)');
			return true;
		} else {
			if (goodVersion) {
				return true;
			} else {
				alert('Your browser is too old (O,O)');
				return false;
			}
		}
	};

	if(browserTest({name: BrowserDetect.browser,version: BrowserDetect.version})) {

		var initFiles = [
			'js/lib/g_notify', // pattern de notification
			'js/lib/g_tpl', // moteur de template simple
			'js/lib/g_bundle', // loader de bundle
			'js/lib/g_JSElem' // gestionnaire de composant
		];

		// ------------------------------------------------------------------
		// ------------------------------------------------------------------

		/**
		*
		* Log
		*
		* @param {string} msg Message
		*/
		window.$log = function (msg){
			if($params.debugMode && typeof console != 'undefined') {
				if(console.debug) // FireBug
					console.debug(msg);
				else
					console.log(msg);// autres
			}
		};

		// default parameters (http://wiki.ecmascript.org/doku.php?id=harmony:parameter_default_values)
		// Allow formal parameters to be initialized with default values if undefined is passed.
		window.$dv = function ( v, d) {
			return (v === undefined) ? d : v;
		},

		window.$params = (function() {

			var _params = {
				// debuggage
				debugMode : debugMode,

				// la langue
				lang : document.documentElement.lang,

				UIType : 'html',
				DS : '/',
				platform_win : false,
				winReg : null
			};

			_params['baseUrl'] = UITYPE.baseUrl;
			_params['paths'] = UITYPE.paths;
			// au cas ou des "console.log(...)" se trouvent encore dans le code
			// et éviter un plantage si "console" est undefined
			window.console = window.console || {log: function() {}};

			return _params;
		}());

		/* -------------------------------------------------------------- */

		$req.config({
			locale : $params.lang,
			UIType : $params.UIType,
			DS : $params.DS,
			platform_win : $params.platform_win,
			winReg : $params.winReg,
			baseUrl : $params.baseUrl,
			paths : $params.paths
		});

		/* -------------------------------------------------------------- */

		// chargement des modules définit dans l'initialisation
		$req(initFiles,function(){
			// configuration $bundles
			var _bundlesFiles = {}
			for(var bundle in BUNDLESFILES) {
				_bundlesFiles[bundle] = BUNDLESFILES[bundle].file;
			}
			$bundles.config({bundlesFiles : _bundlesFiles});

			if(COMPONENTSFILES!=null) {
				$req(COMPONENTSFILES,function(componentsList){
					// chargement des composants pour l'appli
					var allComponents = ['DOMReady!'];
					for (var cp in componentsList)
						componentsList[cp].forEach(function(i){allComponents.push(i)});

					$req(allComponents,function(){
							JSElem.DOMContentLoaded(function(){
								// bootstrap
								$req(BOOTSTRAP);
							});
					});
				});
			} else {
				JSElem.DOMContentLoaded(function(){
					// bootstrap
					$req(BOOTSTRAP);
				});
			}
		});
	}

}());
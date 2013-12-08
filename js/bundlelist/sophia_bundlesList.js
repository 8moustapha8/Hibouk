
/**
 * BundlesList sophia
 */
define('js/bundlelist/sophia_bundlesList',function() {
	var bundles = {

		sophia : {
			componentsNamespace : {
				'sophia' : 'http://www.sophia.com'
			},
			components : { // liste des composants nécessaire pour ce module
					input : ['cp/sophiainput/sophia_input','css!cp/sophiainput/sophia_input'],
					pagination : ['cp/pagination/cp_pagination','css!cp/pagination/cp_pagination'],
					buttonseparator : ['cp/buttonseparator/cp_buttonseparator','css!cp/buttonseparator/cp_buttonseparator']
			},
			tpl : 'tpl!bdl/sophia/sophia_find',// le fichier de template
			locale : 'i18n!bdl/sophia/locale/sophia_find!default:en-EN',// fichier des locales du template
			init : ['bdl/sophia/sophia_findModel','bdl/sophia/sophia_findIO','bdl/sophia/sophia_findView'],// fichier js d'initialisation
			css : 'css!bdl/sophia/sophia_find'// css pour le template
		}
	};
	return bundles;
});
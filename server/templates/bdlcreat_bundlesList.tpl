/**
 * @package --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 * @author --AUTHOR--
 * @licence --LICENCE--
 */

/**
 * BundlesList --NAMEBDL--
 */
define('js/bundlelist/--NSP--_bundlesList',function() {
	var bundles = {

		'--NAMEBDL--' : {
			/*
			componentsNamespace : {
				'dc' : 'http://xxxxxx.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
			},
			tpl : 'tpl!bdl/--NBDL--/--NSP--_--NBDL--',// le fichier de template
			locale : 'i18n!bdl/--NBDL--/locale/--NSP--_--NBDL--!default:fr-FR',// fichier des locales du template
			init : ['bdl/--NBDL--/--NSP--_--NBDL--'],// fichier js d'initialisation
			css : 'css!bdl/--NBDL--/--NSP--_--NBDL--'// css pour le template
		}
	};
	return bundles;
});
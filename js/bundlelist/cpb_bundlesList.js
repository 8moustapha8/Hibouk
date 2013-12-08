/**
 * @package composantBuilder
 * @subpackage composantBuilder (cpb_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList composantBuilder
 */
define('js/bundlelist/cpb_bundlesList',function() {
	var bundles = {

		'composantBuilder' : {
			/*
			componentsNamespace : {
				'dc' : 'http://xxxxxx.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				button : ['cp/button/cp_button','css!cp/button/cp_button'],
				buttonseparator : ['cp/buttonseparator/cp_buttonseparator','css!cp/buttonseparator/cp_buttonseparator'],
				codeeditor : ['cp/codeeditor/cp_codeeditor','cp/codeeditor/cp_codenotify','cp/codeeditor/cp_codecomposer']
			},
			tpl : 'tpl!bdl/composantBuilder/cpb_composantBuilder',// le fichier de template
			locale : 'i18n!bdl/composantBuilder/locale/cpb_composantBuilder!default:fr-FR',// fichier des locales du template
			init : ['bdl/composantBuilder/cpb_composantBuilder'],// fichier js d'initialisation
			css : 'css!bdl/composantBuilder/cpb_composantBuilder'// css pour le template
		}
	};
	return bundles;
});
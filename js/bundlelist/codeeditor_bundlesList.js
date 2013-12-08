/**
 * @package codeEditor
 * @subpackage codeEditor (codeeditor_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList codeEditor
 */
define('js/bundlelist/codeeditor_bundlesList',function() {
	var bundles = {

		'codeEditor' : {
			/*
			componentsNamespace : {
				'dc' : 'http://xxxxxx.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				codeeditor : ['cp/codeeditor/cp_codeeditor','cp/codeeditor/cp_codenotify','cp/codeeditor/cp_codecomposer'],
				barscroll : ['cp/barscroll/cp_barscroll','css!cp/barscroll/cp_barscroll'],
				scrollbaronglet : ['cp/barscroll/cp_scrollbaronglet','css!cp/barscroll/cp_scrollbaronglet'],
				scrollbarelement : ['cp/barscroll/cp_scrollbarelement','css!cp/barscroll/cp_scrollbarelement'],
			},
			tpl : 'tpl!bdl/codeEditor/codeeditor_codeEditor',// le fichier de template
			locale : 'i18n!bdl/codeEditor/locale/codeeditor_codeEditor!default:en-EN',// fichier des locales du template
			init : ['bdl/codeEditor/codeeditor_codeEditor'],// fichier js d'initialisation
			css : 'css!bdl/codeEditor/codeeditor_codeEditor'// css pour le template
		}
	};
	return bundles;
});
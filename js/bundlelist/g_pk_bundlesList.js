/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList Packages
 */
define('js/bundlelist/g_pk_bundlesList',function() {
	var bundles = {

		packages : {
			/*
			componentsNamespace : {
				'dc' : 'http://purl.org/dc/elements/1.1/'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				tabbox : ['cp/tabbox/cp_tabbox','css!cp/tabbox/cp_tabbox'],
				popupboxes : ['cp/popupboxes/cp_popupboxes','css!cp/popupboxes/cp_popupboxes'],
				flist : ['cp/flist/cp_flist','css!cp/flist/cp_flist'],
				button : ['cp/button/cp_button','css!cp/button/cp_button'],
				hbox : ['cp/hbox/cp_hbox','css!cp/hbox/cp_hbox'],
				vbox : ['cp/vbox/cp_vbox','css!cp/vbox/cp_vbox']
			},
			tpl : 'tpl!bdl/packages/g_packages',// le fichier de template
			locale : 'i18n!bdl/packages/locale/g_packages!default:en-EN',// fichier des locales du template
			init : ['bdl/packages/g_packages'],// fichier js d'initialisation
			css : 'css!bdl/packages/g_packages',// css pour le template
		}
	};
	// - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
    // inner
	return bundles;
});
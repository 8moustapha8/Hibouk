/**
 * @package Liseuse
 * @subpackage liseuse (lis_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList Liseuse
 */
define('js/bundlelist/lis_bundlesList',function() {
	var bundles = {

		Visualization : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				epubliseuse : ['cp/epubliseuse/lis_epubliseuse','css!cp/epubliseuse/lis_epubliseuse'],
				slider : ['cp/slider/cp_slider','css!cp/slider/cp_slider'],
				menupopup : ['cp/menupopup/cp_menupopup','css!cp/menupopup/cp_menupopup']
			},
			tpl : 'tpl!bdl/epubview/lis_epubview',// le fichier de template
			locale : 'i18n!bdl/epubview/locale/lis_epubview!default:en-EN',// fichier des locales du template
			init : ['bdl/epubview/lis_epubview'],// fichier js d'initialisation
			css : 'css!bdl/epubview/lis_epubview'// css pour le template
		}
	};
	return bundles;
});
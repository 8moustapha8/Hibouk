/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList Packages
 */
define('js/bundlelist/ap_pk_bundlesList',function() {
	var bundles = {

		PackagesAplli : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},

			components : { // liste des composants nécessaire pour ce module
			},
			*/
			tpl : 'tpl!bdl/packagesAppli/ap_packagesAppli',// le fichier de template
			locale : 'i18n!bdl/packagesAppli/locale/ap_packagesAppli!default:en-EN',// fichier des locales du template
			init : ['bdl/packagesAppli/ap_packagesAppli'],// fichier js d'initialisation
			css : 'css!bdl/packagesAppli/ap_packagesAppli'// css pour le template
		}
	};
	// - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
    // inner
	return bundles;
});
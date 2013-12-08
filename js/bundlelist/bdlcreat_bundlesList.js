/**
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList BundleCreat
 */
define('js/bundlelist/bdlcreat_bundlesList',function() {
	var bundles = {

		bundlecreat : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
			},
			tpl : 'tpl!bdl/bundlecreat/bdlcreat_bundlecreat',// le fichier de template
			locale : 'i18n!bdl/bundlecreat/locale/bdlcreat_bundlecreat!default:en-EN',// fichier des locales du template
			init : ['bdl/bundlecreat/bdlcreat_bundlecreat'],// fichier js d'initialisation
			css : 'css!bdl/bundlecreat/bdlcreat_bundlecreat'// css pour le template
		}
	};
	return bundles;
});
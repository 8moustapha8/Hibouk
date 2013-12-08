/**
 * @package EpubCheck
 * @subpackage EpubCheck (ec_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList EpubCheck
 */
define('js/bundlelist/ec_bundlesList',function() {
	var bundles = {

		ePubCheck : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
			},
			tpl : 'tpl!bdl/epubcheck/ec_epubcheck',// le fichier de template
			locale : 'i18n!bdl/epubcheck/locale/ec_epubcheck!default:en-EN',// fichier des locales du template
			init : ['bdl/epubcheck/ec_epubcheck'],// fichier js d'initialisation
			css : 'css!bdl/epubcheck/ec_epubcheck'// css pour le template
		}
	};
	return bundles;
});
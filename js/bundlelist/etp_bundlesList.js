/**
 * @package EpubToPDF
 * @subpackage EpubToPDF (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList EpubToPDF
 */
define('js/bundlelist/etp_bundlesList',function() {
	var bundles = {

		ePubToPDF : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				menupopup : ['cp/menupopup/cp_menupopup','css!cp/menupopup/cp_menupopup'],
				input : ['cp/input/cp_input','css!cp/input/cp_input']
			},
			tpl : 'tpl!bdl/epubtopdf/etp_epubtopdf',// le fichier de template
			locale : 'i18n!bdl/epubtopdf/locale/etp_epubtopdf!default:en-EN',// fichier des locales du template
			init : ['bdl/epubtopdf/etp_epubtopdf','bdl/epubtopdf/etp_HPDF','bdl/epubtopdf/etp_compatibility.js','bdl/epubtopdf/etp_pdf.js'],// fichier js d'initialisation
			css : 'css!bdl/epubtopdf/etp_epubtopdf'// css pour le template
		}
	};
	return bundles;
});
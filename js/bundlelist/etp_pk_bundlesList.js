/**
 * @package EpubToPDF
 * @subpackage pkepubtotpdf (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList config EpubToPDF
 */
define('js/bundlelist/etp_pk_bundlesList',function() {
	var bundles = {

		pkepubtotpdf : {
			/*
			componentsNamespace : {
				'dc' : 'http://lalala.org'
			},
*/
			components : { // liste des composants nécessaire pour ce module
				button : ['cp/button/cp_button','css!cp/button/cp_button'],
				buttonseparator : ['cp/buttonseparator/cp_buttonseparator','css!cp/buttonseparator/cp_buttonseparator'],
				input : ['cp/input/cp_input','css!cp/input/cp_input'],
				codeeditor : ['cp/codeeditor/cp_codeeditor','cp/codeeditor/cp_codenotify','cp/codeeditor/cp_codecomposer']
			},

			tpl : 'tpl!bdl/epubtopdf/etp_pkepubtotpdf',// le fichier de template
			locale : 'i18n!bdl/epubtopdf/locale/etp_pkepubtotpdf!default:en-EN',// fichier des locales du template
			init : ['bdl/epubtopdf/etp_pkepubtotpdf','bdl/epubtopdf/etp_HPDF','bdl/epubtopdf/etp_compatibility.js','bdl/epubtopdf/etp_pdf.js'],// fichier js d'initialisation
			css : 'css!bdl/epubtopdf/etp_pkepubtotpdf'// css pour le template
		}
	};
	// - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
    // inner
	return bundles;
});
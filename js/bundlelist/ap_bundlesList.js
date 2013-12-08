/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * BundlesList Appli
 */
define('js/bundlelist/ap_bundlesList',function() {
	var bundles = {

		biblio : {
			/*
			componentsNamespace : {
				'dc' : 'http://purl.org/dc/elements/1.1/'
			},
			*/
			components : { // liste des composants nécessaire pour ce module
				command : ['cp/command/cp_command','css!cp/command/cp_command'],
				button : ['cp/button/cp_button','css!cp/button/cp_button'],
				hbox : ['cp/hbox/cp_hbox','css!cp/hbox/cp_hbox'],
				vbox : ['cp/vbox/cp_vbox','css!cp/vbox/cp_vbox'],
				stringbundle : ['cp/stringbundle/cp_stringbundle','css!cp/stringbundle/cp_stringbundle'],
				bibliobook : ['cp/bibliobook/ap_bibliobook','css!cp/bibliobook/ap_bibliobook'],
				popupboxes : ['cp/popupboxes/cp_popupboxes','css!cp/popupboxes/cp_popupboxes']
			},
			tpl : 'tpl!bdl/biblio/ap_biblio',// le fichier de template
			locale : 'i18n!bdl/biblio/locale/ap_biblio!default:en-EN',// fichier des locales du template
			init : ['bdl/biblio/ap_biblioModel','bdl/biblio/ap_biblioIO_ajax','bdl/biblio/ap_biblioView'],// fichier js d'initialisation
			css : 'css!bdl/biblio/ap_biblio',// css pour le template
		},

		book : {
			componentsNamespace : {
				'opf' : 'http://www.idpf.org/2007/opf',
			},
			components : { // liste des composants nécessaire pour ce module
				hbox : ['cp/hbox/cp_hbox','css!cp/hbox/cp_hbox'],
				vbox : ['cp/vbox/cp_vbox','css!cp/vbox/cp_vbox'],
				button : ['cp/button/cp_button','css!cp/button/cp_button'],
				splitter : ['cp/splitter/cp_splitter','css!cp/splitter/cp_splitter'],
				tabbox : ['cp/tabbox/cp_tabbox','css!cp/tabbox/cp_tabbox'],
				stringbundle : ['cp/stringbundle/cp_stringbundle','css!cp/stringbundle/cp_stringbundle'],
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog'],
				epubopf : ['cp/opf/epubopf/ap_epubopf','css!cp/opf/epubopf/ap_epubopf'],
				statusselect : ['cp/statusselect/cp_statusselect','css!cp/statusselect/cp_statusselect'],
				checkselect : ['cp/checkselect/cp_checkselect','css!cp/checkselect/cp_checkselect'],
			},
			tpl : 'tpl!bdl/book/ap_book',// le fichier de template
			locale : 'i18n!bdl/book/locale/ap_book!default:en-EN',// fichier des locales du template
			init : ['bdl/book/ap_bookModel','bdl/book/ap_bookIO_ajax','bdl/book/ap_bookView'],// fichier js d'initialisation
			css : 'css!bdl/book/ap_book'// css pour le template
		},

		bookDocument : {
			componentsNamespace : {
				'ncx' : 'http://www.daisy.org/z3986/2005/ncx/',
			},
			components : { // liste des composants nécessaire pour ce module
				opfSpine : ['cp/opf/spine/ap_spine','css!cp/opf/spine/ap_spine'],
				opfItemref : ['cp/opf/itemref/ap_itemref','css!cp/opf/itemref/ap_itemref'],
				menupopup : ['cp/menupopup/cp_menupopup','css!cp/menupopup/cp_menupopup']
			},
			tpl : 'tpl!bdl/bookDocument/ap_document',// le fichier de template
			locale : 'i18n!bdl/bookDocument/locale/ap_document!default:en-EN',// fichier des locales du template
			init : ['bdl/bookDocument/ap_documentModel','bdl/bookDocument/ap_documentIO_ajax','bdl/bookDocument/ap_documentView'],// fichier js d'initialisation
			css : 'css!bdl/bookDocument/ap_document'// css pour le template
		},

		bookToc : {
			componentsNamespace : {
				'dc' : 'http://purl.org/dc/elements/1.1/',
			},
			components : { // liste des composants nécessaire pour ce module
				ncxNavmap : ['cp/ncx/navmap/ap_navmap','css!cp/ncx/navmap/ap_navmap'],
				buttonseparator : ['cp/buttonseparator/cp_buttonseparator','css!cp/buttonseparator/cp_buttonseparator']
			},
			tpl : 'tpl!bdl/bookToc/ap_toc',// le fichier de template
			locale : 'i18n!bdl/bookToc/locale/ap_toc!default:en-EN',// fichier des locales du template
			init : ['bdl/bookToc/ap_tocModel','bdl/bookToc/ap_tocIO_ajax','bdl/bookToc/ap_tocView'],// fichier js d'initialisation
			css : 'css!bdl/bookToc/ap_toc'// css pour le template
		},

		bookMetaData : {
			components : { // liste des composants nécessaire pour ce module
				metadata : ['cp/opf/metadata/ap_metadata','css!cp/opf/metadata/ap_metadata'],
			},
			tpl : 'tpl!bdl/bookMetaData/ap_metaData',// le fichier de template
			locale : 'i18n!bdl/bookMetaData/locale/ap_metaData!default:en-EN',// fichier des locales du template
			init : ['bdl/bookMetaData/ap_metaDataView'],// fichier js d'initialisation
			css : 'css!bdl/bookMetaData/ap_metaData'// css pour le template
		},

		edition : {
			components : { // liste des composants nécessaire pour ce module
				editor : ['cp/editor/cp_editor','cp/editor/cp_notify','cp/editor/cp_composer','cp/editor/cp_dom','cp/editor/cp_commands','cp/editor/cp_undo','css!cp/editor/cp_editor'],
				barscroll : ['cp/barscroll/cp_barscroll','css!cp/barscroll/cp_barscroll'],
				scrollbaronglet : ['cp/barscroll/cp_scrollbaronglet','css!cp/barscroll/cp_scrollbaronglet'],
				scrollbarelement : ['cp/barscroll/cp_scrollbarelement','css!cp/barscroll/cp_scrollbarelement'],
				inspector : ['cp/editor/cp_inspector'],
				attrs : ['cp/attrs/ap_attrs','css!cp/attrs/ap_attrs'],
				menupopup : ['cp/menupopup/cp_menupopup','css!cp/menupopup/cp_menupopup']
			},
			tpl : 'tpl!bdl/edition/ap_edition',// le fichier de template
			locale : 'i18n!bdl/edition/locale/ap_edition!default:en-EN',// fichier des locales du template
			init : ['bdl/edition/ap_editionView'],// fichier js d'initialisation
			css : 'css!bdl/edition/ap_edition'// css pour le template
		},

		editionToolbar : {
			components : { // liste des composants nécessaire pour ce module
				minibutton : ['cp/button/cp_minibutton','css!cp/button/cp_minibutton']
			},
			tpl : 'tpl!bdl/edition/ap_editionToolbar',// le fichier de template
			//locale : 'i18n!bdl/edition/locale/edition!default:en-EN',// fichier des locales du template
			init : ['bdl/edition/ap_editionToolbar'],// fichier js d'initialisation
			css : 'css!bdl/edition/ap_editionToolbar'// css pour le template
		},

		biblioModels : {
			components : { // liste des composants nécessaire pour ce module
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog']
			},
			tpl : 'tpl!bdl/dialog/biblioModels/ap_biblioModels',// le fichier de template
			locale : 'i18n!bdl/dialog/locale/ap_biblioModels!default:en-EN',// fichier des locales du template
			init : ['bdl/dialog/biblioModels/ap_biblioModels'],// fichier js d'initialisation
			css : 'css!bdl/dialog/biblioModels/ap_biblioModels'// css pour le template
		},

		filesDepend : {
			components : { // liste des composants nécessaire pour ce module
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog']
			},
			tpl : 'tpl!bdl/dialog/filesDepend/ap_filesDepend',// le fichier de template
			locale : 'i18n!bdl/dialog/locale/ap_filesDepend!default:en-EN',// fichier des locales du template
			init : ['bdl/dialog/filesDepend/ap_filesDepend'],// fichier js d'initialisation
			css : 'css!bdl/dialog/filesDepend/ap_filesDepend'// css pour le template
		},

		bookImportfiles : {
			components : { // liste des composants nécessaire pour ce module
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog']
			},
			tpl : 'tpl!bdl/dialog/bookImportfiles/ap_bookImportfiles',// le fichier de template
			locale : 'i18n!bdl/dialog/locale/ap_bookImportfiles!default:en-EN',// fichier des locales du template
			init : ['bdl/dialog/bookImportfiles/ap_bookImportfiles'],// fichier js d'initialisation
			css : 'css!bdl/dialog/bookImportfiles/ap_bookImportfiles'// css pour le template
		},

		bookImportfilesText : {
			components : { // liste des composants nécessaire pour ce module
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog']
			},
			tpl : 'tpl!bdl/dialog/bookImportfilesText/ap_bookImportfilesText',// le fichier de template
			locale : 'i18n!bdl/dialog/locale/ap_bookImportfilesText!default:en-EN',// fichier des locales du template
			init : ['bdl/dialog/bookImportfilesText/ap_bookImportfilesText'],// fichier js d'initialisation
			css : 'css!bdl/dialog/bookImportfilesText/ap_bookImportfilesText'// css pour le template
		},

		bookImagesfiles : {
			components : { // liste des composants nécessaire pour ce module
				dialog : ['cp/dialog/cp_dialog','css!cp/dialog/cp_dialog']
			},
			tpl : 'tpl!bdl/dialog/bookImages/ap_bookImages',// le fichier de template
			locale : 'i18n!bdl/dialog/locale/ap_bookImages!default:en-EN',// fichier des locales du template
			init : ['bdl/dialog/bookImages/ap_bookImages'],// fichier js d'initialisation
			css : 'css!bdl/dialog/bookImages/ap_bookImages'// css pour le template
		}
	};
	// - beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -
    // inner
	return bundles;
});
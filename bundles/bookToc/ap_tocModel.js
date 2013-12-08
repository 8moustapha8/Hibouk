/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_tocModel
 */
define('bdl/bookToc/ap_tocModel', function() {

	var TocModel = {

		tocIO : null,

		init : function ( tocIO ) {
			TocModel.tocIO = tocIO;
		},

		loadNCX : function(id, href, callback) {
			TocModel.tocIO.loadNCX(id, href, callback);
		}
	};
	return TocModel;
});
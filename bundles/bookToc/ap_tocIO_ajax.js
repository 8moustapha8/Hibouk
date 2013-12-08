/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_tocIO_ajax
 */
define('bdl/bookToc/ap_tocIO_ajax',function() {

	var _ajax = null;

	var _url = '';

	var _module = null;

	var tocIO = {
		init : function ( url , module ) {
			_url = url;
			_module = module;
		},

		loadNCX : function ( id, href, callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				__ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'loadNCX',
							href : href,
							id : id
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		},
	};

	return tocIO;
});
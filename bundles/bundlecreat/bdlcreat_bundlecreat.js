/**
 * @package BundleCreat
 * @subpackage BundleCreat (bdlcreat_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ec_epubcheck
 */
define('bdl/bundlecreat/bdlcreat_bundlecreat',function() {

	var _ajax, _Msg = null;

	var _url = 'index.php';

	var _module = 'bdlcreat_module';

	var bundlecreatIO = {
		creat : function ( bundleName,nameSpace,typeBundle,author,licence,callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'creat',
							bundleName : bundleName,
							nameSpace : nameSpace,
							typeBundle : typeBundle,
							author : author,
							licence : licence
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		}
	};

	var view = {
		initEvents : function () {
			var bundleName = document.getElementById('bdlcreat_input_bundleName');
			var nameSpace = document.getElementById('bdlcreat_input_nameSpace');
			var typeBundle = document.getElementById('bdlcreat_input_typeBundle');
			var author = document.getElementById('bdlcreat_input_author');
			var licence = document.getElementById('bdlcreat_input_licence');
			document.getElementById('bdlcreat_input_generate').addEventListener('click', function () {
				_Msg.wait();
				bundlecreatIO.creat(
					bundleName.value,
					nameSpace.value,
					typeBundle.value,
					author.value,
					licence.value,
					function(data){
						_Msg.hide();
					}
				);
			}, false);
		}
	};

	// ------------------------------------------------------------------

	var bundlecreatView = {
		init : function () {
			_Msg = document.getElementById('msg');
			view.initEvents();
		}
	};
	return bundlecreatView;
});
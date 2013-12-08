/**
 * @package EpubCheck
 * @subpackage EpubCheck (ec_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ec_epubcheck
 */
define('bdl/epubcheck/ec_epubcheck',function() {

	var _ajax = null;

	var _url = 'index.php';

	var _module = 'ec_epubcheck';

	var _notifyLoad = null;

	var epubcheckIO = {
		epubcheck : function ( id, callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'check',
							id : id
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
			var epubcheck_check = document.getElementById('epubcheck_check');
			var epubcheck_result = document.getElementById('epubcheck_result');
			epubcheck_check.command = function (event) {
				epubcheck_result.innerHTML = '';
				$func.saveBook(true,true,function(isSave){
					if(isSave){
						$func.epubMake(false,function(data){
							epubcheckIO.epubcheck(data.id,function(data){
								epubcheck_result.innerHTML = data;
								_Msg.hide();
							});
						});
					} else {
						_Msg.hide();
					}
				});
			};
			_notifyLoad = $notify.sub('book/load', function(attr){
				epubcheck_result.innerHTML = '';
				return [attr];
			});
		},

		unload : function () {
			$notify.unSub(_notifyLoad[0],_notifyLoad);
			var elems = [
					document.getElementById('epubcheckTab'),
					document.getElementById('epubcheckTabpanel')
			];
			elems.forEach(function(el){
				el.parentNode.removeChild(el);
			});
		},
	};

	// ------------------------------------------------------------------

	var epubcheckView = {
		init : function () {
			view.initEvents();
		},
		unload : function () {
			view.unload();
		},
	};
	return epubcheckView;
});
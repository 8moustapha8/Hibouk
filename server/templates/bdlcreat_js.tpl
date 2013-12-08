/**
 * @package --NAMEBDL--
 * @subpackage --NAMEBDL-- (--NSP--_)
 * @author --AUTHOR--
 * @licence --LICENCE--
 */

/**
 * Module --NSP--_--NBDL--
 */
define('bdl/--NBDL--/--NSP--_--NBDL--',function() {

	var _ajax = null;

	var _url = 'index.php';

	var _module = '--NSP--_--NBDL--';

	var --NBDL--IO = {
		xxxx : function ( id, callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'start',
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
			
		},

		unload : function () {
			var elems = [];
			elems.forEach(function(el){
				el.parentNode.removeChild(el);
			});
		},
	};

	// ------------------------------------------------------------------

	var --NBDL--View = {
		init : function () {
			view.initEvents();
		},
		unload : function () {
			view.unload();
		},
	};
	return --NBDL--View;
});
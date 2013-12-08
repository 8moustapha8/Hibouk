/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Bootstrap Appli
 */

window.$func = {};
window._Msg = null;
$func['inactivated'] = function(el, val) {
	if (val) el.removeAttribute('inactivated');
	else el.setAttribute('inactivated', 'true');
};

$func['dispatchEvent'] = function(eventType, eventName, element) {
	var ev = document.createEvent(eventType);
	ev.initEvent(eventName, true, true);
	element.dispatchEvent(ev);
};

$func['msg'] = function(bibliobookMsgDiv) {
	var bibliobookMsg = bibliobookMsgDiv.querySelector('.bibliobookMsg');
	return function(msg, show) {
		if (show === true) bibliobookMsgDiv.style.display = 'block';
		else if (show === false) bibliobookMsgDiv.style.display = 'none';

		bibliobookMsg.innerHTML = msg;
	}
};

$func['stringClear'] = function (str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·_,:;'";
	var to   = "aaaaeeeeiiiioooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++)
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));

	str = str.replace(/[^a-zA-Z0-9 -\/]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-') // collapse dashes
		.replace(/\./g, '-')
		.replace(/"/g, '');

	return str;
};

$func['validate'] = {

	getValue : function(element,msg) {
		return element.value;
	},

	getFiles : function(element,msg,show) {
		element.style.outline = "1px solid transparent";
		if(element.files.length!=0)
			return element.files;
		if(show){
			element.style.outline = "1px solid red";
			_Msg.message(msg);
		}
		return null;
	},

	isNoEmpty : function(element,msg,show) {
		element.style.outline = "1px solid transparent";
		var value = element.value;

		var _value = value.replace(' ','');
		if(_value.length != 0)
			return value;
		if(show){
			element.style.outline = "1px solid red";
			_Msg.message(msg);
		}
		return null;
	}
};

(function() {
	window.__loadNextFile = null;
	window.__msg = null;

	$bundles('appli', 'biblio', function(BiblioModel, biblioIO, biblioView) {
		_Msg = document.getElementById('msg');
		var msgFnc = function() {
			_Msg.box('<div style="margin-top:10px;height:60px;width:260px;text-align:center;font-family:monospace;"><span style="font-size:22px;font-weight:bold;">(0,0)</span><br></br><span id="bibliobookMsg" style="font-size:10px;"></span></div>');
			var bibliobookMsg = document.getElementById('bibliobookMsg');
			return function(msg) {
				bibliobookMsg.innerHTML = msg;
			}
		};

		__msg = msgFnc();

		// initalisations
		biblioIO.init('index.php', 'ap_biblio');
		biblioView.init(BiblioModel,'index.php?module=ap_biblio&act=importBook');
		BiblioModel.init(biblioIO, biblioView);

		__msg('ap_biblio');

		$bundles('appli', 'book', function(BookModel, bookIO, bookView) {

			// initalisations
			bookIO.init('index.php', 'ap_book');
			BookModel.init(bookIO);
			bookView.init(BookModel,'resources/status/');

			BiblioModel.initBookModel(BookModel);

			__msg('ap_book');

			var __loadBootstrap = function ( list, fnc ) {

				var tmp = function (list, fnc){
					var __length = list.length-1;
					var __numFile = -1;
					return function (){
						if(__length!=__numFile){
							__numFile++;
							var __file = list[__numFile];
							var __name = __file.split(/\//).pop();
							__name = __name.substr(0,__name.length-7);
							$req(__file, function () {
								__msg(__name, true);
							});
						} else {
							fnc();
						}
					};
				}
				__loadNextFile = tmp(list, fnc);
				__loadNextFile();
			};

			__loadBootstrap(BOOTSTRAP_BUNDLES,function(){
				_Msg.hide();
				document.getElementById('bibliobooks').style.display = "block";
				delete __loadNextFile;
				delete __msg;

				if(debugMode)
					$notify.pub('debug/start');
			});
		});
	});
}());
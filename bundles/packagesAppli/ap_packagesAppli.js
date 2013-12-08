/**
 * @package Hiboux (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_packagesAppli
 */
define('bdl/packagesAppli/ap_packagesAppli',function() {

	var _ajax, _module, _Msg, _locale;

	var _url = '';

	var configuration = {
		init : function () {
			// vue que c'est la fonction qui va être lancé en premier
			// il faut s'assurer que ajax est chargé
			$notify.sub('bundles/finalLoad',function(){
				$req('js/lib/g_ajax',function(__ajax) {
					_ajax = __ajax;
					__ajax.getJSON({
						url : _url,
						data : {
							module : _module,
							act : 'start',
						},
						success : function (data) {
							var appliAdmin = document.getElementById('Appli-admin');
							var content = appliAdmin.innerHTML;
							var tplRender = $tpl.render(content,data);
							appliAdmin.innerHTML = tplRender;
							configuration.initEvents();
							$notify.pub('config/appli',[data]);
						}
					});
				});
			});
		},
		initEvents : function () {
			document.getElementById('Appli-frame').addEventListener('load', function () {
				var html = this.contentWindow.document.body.innerHTML;
				if(html!=''){
					html = html.replace('<pre>','').replace('</pre>','');
					var json = JSON.parse(html);
					_Msg.alert('','<b>'+json.content+'</b>');
				}
			}, false);
		}
	};

	// ------------------------------------------------------------------

	var bundle = {

		init : function (url, module) {
			_url = url;
			_module = module;
			_locale = $definition['i18n!bdl/packagesAppli/locale/ap_packagesAppli'];

			_Msg = document.getElementById('msg');
			configuration.init();
		},
	};
	return bundle;
});
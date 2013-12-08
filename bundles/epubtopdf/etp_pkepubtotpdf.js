/**
 * @package EpubToPDF
 * @subpackage pkepubtotpdf (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module etp_pkepubtotpdf
 */
define('bdl/epubtopdf/etp_pkepubtotpdf',function() {

	var _ajax, _module, _Msg, _locale = null;

	var _url = '';

	var IO = {
		init : function ( url , module ) {
			_url = url;
			_module = module;
		},

		getModels : function ( callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'getModels',
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		},

		saveModel : function ( modelName, contentJSON, contentCSS, callback ) {
			contentJSON = contentJSON.replace( /\&/g,'§eper§').replace( /\+/g,'§plus§');
			contentCSS = contentCSS.replace( /\&/g,'§eper§').replace( /\+/g,'§plus§');
			_ajax.getJSON({
				url : _url,
				data : {
					module : 'etp_pkepubtopdf',
					act : 'saveModel',
					modelName : modelName,
					contentJSON : contentJSON,
					contentCSS : contentCSS
				},
				success : function (data) {
					callback(data);
				}
			});
		},

		creatModelPDF : function ( modelName, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
					module : 'etp_pkepubtopdf',
					act : 'creatModelPDF',
					modelName : modelName
				},
				success : function (data) {
					callback(data);
				}
			});
		},
	};
	var configuration = {
		init : function (HPDF) {
			$notify.sub('config/appli',function(data){
				var etpAdmin = document.getElementById('pk_etp-admin');
				var tplRender = $tpl.render(etpAdmin.innerHTML,data);
				etpAdmin.innerHTML = tplRender;
				configuration.initEvents(HPDF);
				return [data];
			});
		},
		initEvents : function (HPDF) {

			var selectETPFirst = true;
			document.getElementById('Gpack-tabbox').addEventListener('change', function (event) {
				if (event.detail != undefined){

					// onglet dépot et première sélection de l'onglet
					if (event.detail.element.id === 'tab_pk_etp' && selectETPFirst) {
						selectETPFirst = false;
						document.getElementById('etp_tabbox').setAttribute('selectedindex','0');
						setTimeout(function(){
							var evt = document.createEvent('HTMLEvents');
							evt.initEvent('resize', true, false);
							window.dispatchEvent(evt);
						}, 300);
					}
				}
			}, false);

			document.getElementById('pk_etp-frame').addEventListener('load', function () {
				var html = this.contentWindow.document.body.innerHTML;
				if(html!=''){
					html = html.replace('<pre>','').replace('</pre>','');
					var json = JSON.parse(html);
					_Msg.alert('','<b>'+json.content+'</b>');
				}
			}, false);

			var codeeditor = document.getElementById('cp_codeeditor');
			var codeeditor_hbox = document.getElementById('codeeditor_hbox');
			var etp_mSwitch = document.getElementById('epubtopdf_modelSwitch');
			var etp_mSave = document.getElementById('epubtopdf_modelSave');
			var etp_mNew = document.getElementById('epubtopdf_modelNew');
			var etp_models = document.getElementById('epubtopdf_models');
			var etp_creatPDF = document.getElementById('epubtopdf_creatPDF');

			IO.getModels(function(models){
				etp_models.innerHTML = view.creatModels(models);
			});

			var _getResizeHeight = function(){
				return (codeeditor_hbox.clientHeight) + 'px';
			};

			codeeditor.composer.getResizeHeight = _getResizeHeight;

			var _sw_selected = 'json';
			var _model_selected = null;
			var _swicthB = function(){
				if(_sw_selected=='json') {
					etp_mSwitch.setAttribute('label','JSON');
					etp_mSwitch.style.backgroundImage = 'url("bundles/images/etp_json.png")';
					_sw_selected = 'css';
				} else {
					etp_mSwitch.setAttribute('label','CSS');
					etp_mSwitch.style.backgroundImage = 'url("bundles/images/etp_css.png")';
					_sw_selected = 'json';
				}
				codeeditor.composer.show(_model_selected+_sw_selected);
			};

			var _editFile = function(model,_new) {
				var mjson = model+'json';
				var mcss = model+'css';
				if(_model_selected==null) {
					etp_mSwitch.removeAttribute("inactivated");
					etp_mSave.removeAttribute("inactivated");
					etp_creatPDF.removeAttribute("inactivated");
				}
				_model_selected = model;
				// test if the files are edited
				if(!codeeditor.composer.isAdd(mjson)) {
					_Msg.wait();
					var dir = 'server/hibouKPDF/models/'+model;
					if(_new)
						dir = 'server/hibouKPDF/modeldefault';
					codeeditor.composer.add(dir+'/etp_model.css', mcss);
					codeeditor.composer.add(dir+'/etp_config.json', mjson);

					// on charge les 2 modèles pour pas que le contenu de l'un ou l'autre soit vide
					codeeditor.composer.load(mjson, function(){
						codeeditor.composer.load(mcss, function(){
							codeeditor.composer.show(_model_selected+_sw_selected);
							_Msg.hide();
						});
					});
				} else {
					codeeditor.composer.show(_model_selected+_sw_selected);
				}
			};

			etp_models.addEventListener('change', function (ev) {
				if(this.value!='' && this.value!=_model_selected) {
					// TODO: confirm for save files before if is not the same model
					_editFile(this.value,false);
				}
			}, false);

			etp_mSwitch.command = function (event) {
				_swicthB();
			};

			etp_mSave.command = function (event) {
				// get the model edited
				if(_model_selected!=null){
					_Msg.wait();
					IO.saveModel(
						_model_selected,
						codeeditor.composer.getContentID(_model_selected+'json'),
						codeeditor.composer.getContentID(_model_selected+'css'),
						function(data){
							_Msg.hide();
						}
					);
				}
			};

			etp_mNew.command = function (event) {
				var name = prompt(_locale.etp_modelNew,"name_size");
				if (name!=null && name.lastIndexOf("_")>-1) {
					var option = document.createElement("option");
					option.text = name;
					option.value = name;
					etp_models.add(option,null);
					etp_models.querySelector('option[value="'+name+'"]').selected = true;
					_editFile(name,true);
				}
			};

			HPDF.init({
				page : document.getElementById('epubtopdf_page'),
				zoom_out : document.getElementById('epubtopdf_zoom_out'),
				zoom_in : document.getElementById('epubtopdf_zoom_in'),
				before : document.getElementById('epubtopdf_before'),
				after : document.getElementById('epubtopdf_after'),
				numPages : document.getElementById('epubtopdf_numPages'),
				viewer : document.getElementById("epubtopdf_viewer"),
				page_even : document.getElementById("epubtopdf_page_even"),
				page_odd : document.getElementById("epubtopdf_page_odd"),
				errors : document.getElementById('epubtopdf_errors'),
				errors_block : document.getElementById('epubtopdf_errors_block')
			});

			etp_creatPDF.addEventListener('click', function (ev) {
				_Msg.wait();
				HPDF.clear();


				if(_model_selected!=null) {
					IO.creatModelPDF(_model_selected,function(data){
						var errors = JSON.parse(data.errors);
						if(errors.length>0)
							HPDF.writeErrors(errors);
						HPDF.loadPDF(data.l);
						_Msg.hide();
					});
				} else {
					_Msg.hide();
				}
			});
		}
	};

	var view = {
		creatModels : function(models) {
			var options = '<option value="">'+_locale.etp_model+'</option>';
			models.forEach(function(item){
					options += '<option value="'+item+'">'+item+'</option>';
			});
			return options;
		}
	};

	// ------------------------------------------------------------------

	var bundle = {

		init : function ( url , module, HPDF ) {

			IO.init(url,module);

			_locale = $definition['i18n!bdl/epubtopdf/locale/etp_pkepubtotpdf'];

			_Msg = document.getElementById('msg');

			configuration.init(HPDF);
		},
	};
	return bundle;
});
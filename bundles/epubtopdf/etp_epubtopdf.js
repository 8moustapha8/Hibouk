/**
 * @package EpubToPDF
 * @subpackage EpubToPDF (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module etp_epubtopdf
 */
define('bdl/epubtopdf/etp_epubtopdf',function() {

	var _ajax = null;

	var _url = '';

	var _module = null;

	var menupopup_models, epubtopdf_model_select, epubtopdf_creatPDF;

	var IO = {
		init : function ( url , module ) {
			_url = url;
			_module = module;
		},

		creatPDF : function ( id, files, cssFiles, callback ) {
			// metadata
			var metadata = $func.epubopf().getRegister('metadata');
			// title
			var title = metadata.getMetaData('title');
			var title_txt = '';
			if(title[0]!=undefined)
				title_txt = title[0].val;

			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						act : 'creatPDF',
						id : id,
						model : epubtopdf_model_select.innerHTML,
						title : title_txt,
						files : JSON.stringify(files),
						cssFiles : JSON.stringify(cssFiles)
					},
				success : function (data) {
					callback(data);
				}
			});
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
	};

	/* --------------------------------------------------- */

	var view = {

		creatModels : function(models) {

			var menu = '<cp:menupopup id="menupopup_models">';

			var menuitem = {};

			models.forEach(function(item,i){
				if(i==0)
					view.assignModel(item);
				var v = item.split('_');
				if(menuitem[v[0]]==undefined)
					menuitem[v[0]] = [];
				menuitem[v[0]].push(v[1]);
			});

			for(var model in menuitem){
				menu += '<cp:menuitem label="'+model+'"><cp:submenu label="'+model+'">';
				menuitem[model].forEach(function(item){
					menu += '<cp:menuitem label="'+item+'" value="'+model+'_'+item+'"/>';
				});
				menu += '</cp:submenu></cp:menuitem>';
			}
			menu += '</cp:menupopup>';
			document.body.insertComponent('beforeend',menu);
		},

		assignModel : function(model) {
			if(model!==null){
				epubtopdf_model_select.setAttribute('value',model);
				epubtopdf_model_select.innerHTML = model.replace('_',' ');
			}
		},

		getItemref : function () {
			var items = [];
			[].forEach.call($func.epubopf().getRegister('spine').getItemref(), function (element) {
				if(element.getAttribute('linear')){
					var obj = {
						href : element.getAttribute('href'),
						type : element.getAttribute('guidetype')
					};
					items.push(obj);
				}
			});
			return items;
		},

		initEvents : function (models,HPDF) {
			var _selectedFile = null;

			epubtopdf_models = document.getElementById('epubtopdf_models');
			epubtopdf_model_select = document.getElementById('epubtopdf_model_select');
			epubtopdf_creatPDF = document.getElementById('epubtopdf_creatPDF');


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

			view.creatModels(models);

			menupopup_models = document.getElementById('menupopup_models');

			epubtopdf_models.command = function (event) {
				menupopup_models.show(event);
			};

			menupopup_models.addEventListener('click', function (event) {
				var element = event.originalTarget;
				if(element.tagName!='CP:MENUITEM')
					 element = element.parentNode;
				view.assignModel(element.getAttribute('value'));
			});

			var _allFiles = false;
			epubtopdf_creatPDF.addEventListener('click', function (ev) {
				_Msg.wait();
				HPDF.clear();

				var files;
				if(_allFiles)
					files = view.getItemref();
				else
					files = [_selectedFile];

				if(files.length>0) {
					var cssList = $func.epubopf().getCSSList();
					IO.creatPDF($func['bookID'](),files,cssList,function(data){
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

			document.getElementById('epubtopdf_allfiles').addEventListener('change', function (ev) {
				 if(this.checked)
				 	epubtopdf_creatPDF.setAttribute('inactivated','false');
				 else if(_selectedFile==null)
				 	epubtopdf_creatPDF.setAttribute('inactivated','true');

				 _allFiles = this.checked;
			});

			var _buttonDisabled = function (itemrefSelected) {
				_selectedFile = itemrefSelected;
				if(itemrefSelected==null)
					epubtopdf_creatPDF.setAttribute('inactivated','true');
				else
					epubtopdf_creatPDF.setAttribute('inactivated','false');
			};

			_buttonDisabled($func.getItemrefSelected());

			$notify.sub('itemref/selected', function(itemrefSelected){
				_buttonDisabled(itemrefSelected);
				return [itemrefSelected];
			});
		},

		unload : function () {
			var elems = [
					document.getElementById('epubtopdfTabpanel'),
					document.getElementById('epubtopdfTab')
			];
			elems.forEach(function(el){
				el.parentNode.removeChild(el);
			});
		}
	};

	/* --------------------------------------------------- */

	// ------------------------------------------------------------------

	var epubtopdf = {
		init : function ( url , module, HPDF ) {
			IO.init(url,module);
			IO.getModels(function(models){
				view.initEvents(models,HPDF);
			});
		},
		unload : function () {
			view.unload();
		},
	};
	return epubtopdf;
});
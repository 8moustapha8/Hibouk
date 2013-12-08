/**
 * @package composantBuilder
 * @subpackage composantBuilder (cpb_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module cpb_composantBuilder
 */
define('bdl/composantBuilder/cpb_composantBuilder',function() {

	var _ajax = null;

	var _url = 'index.php';

	var _module = 'cpb_composantBuilder';

	var composantBuilderIO = {
		getComponents : function ( callback ) {
			$req('js/lib/g_ajax',function(__ajax) {
				_ajax = __ajax;
				_ajax.getJSON({
					url : _url,
					data : {
							module : _module,
							act : 'getComponents'
						},
					success : function (data) {
						callback(data);
					}
				});
			});
		},

		load : function ( name, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						name : name,
						act : 'load'
					},
				success : function (data) {
					callback(data);
				}
			});
		},

		run : function ( js, css, jstest, htmltest, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						js : js,
						css : css,
						jstest : jstest,
						htmltest : htmltest,
						act : 'run'
					},
				success : function (data) {
					callback(data);
				}
			});
		},

		save : function ( prefix, name, js, css, jstest, htmltest, callback ) {
			_ajax.getJSON({
				url : _url,
				data : {
						module : _module,
						prefix : prefix,
						name : name,
						js : js,
						css : css,
						jstest : jstest,
						htmltest : htmltest,
						act : 'save'
					},
				success : function (data) {
					callback(data);
				}
			});
		}
	};

	var view = {
		initEvents : function () {
			var cpb_components = document.getElementById('cpBuilder_components');
			var codeeditor = document.getElementById('cpBuilder_codeeditor');
			var cpb_hbox = document.getElementById('cpBuilder_hbox');
			var cpb_iframe = document.getElementById('cpBuilder_iframe');
			var cpb_doc = document.getElementById('cpBuilder_iframe_doc');

			var _getResizeHeight = function(){
				return (cpb_hbox.clientHeight) + 'px';
			};

			codeeditor.composer.getResizeHeight = _getResizeHeight;

			var _cp_selected = '';
			var _cp_prefix = '';
			var _sw_selected = 'js';
			var _bts = ['js','css','save','run','htmltest','doc','jstest'];
			var _switchView = function(el){
				_bts.forEach(function(_el){
					if(el!=_el)
						document.getElementById('cpBuilder_'+_el).setAttribute('inactivated','false');
				});
				document.getElementById('cpBuilder_'+el).setAttribute('inactivated','true');
			}
			var _editCP = function(name) {

				composantBuilderIO.load(name,function(data){
					if(!codeeditor.composer.isAdd(name+'js')) {
						_Msg.wait();
						_cp_selected = name;
						var url = 'components/'+name+'/';
						var els = [];
						_cp_prefix = data['prefix'];
						delete data['prefix'];

						for(var el in data){
							codeeditor.composer.add(url+data[el], name+el);
							els.push(el);
						}

						els.forEach(function(e,i){
							codeeditor.composer.load(name+e, function(){
								if(i==els.length-1) {
									codeeditor.composer.show(_cp_selected+_sw_selected);
									_Msg.hide();
								}
							});
						});
						_switchView(_sw_selected);
					} else {
						codeeditor.composer.show(name+_sw_selected);
					}
				});
			};

			var swicthBtEditor = function(sw) {
				_sw_selected = sw;
				_switchView(_sw_selected);
				codeeditor.composer.show(_cp_selected+_sw_selected);
			};

			document.getElementById('cpBuilder_js').command = function (event) {
				swicthBtEditor('js');
				_swicthPanel('editor');
			};

			document.getElementById('cpBuilder_css').command = function (event) {
				swicthBtEditor('css');
				_swicthPanel('editor');
			};

			document.getElementById('cpBuilder_jstest').command = function (event) {
				swicthBtEditor('jstest');
				_swicthPanel('editor');
			};

			document.getElementById('cpBuilder_htmltest').command = function (event) {
				swicthBtEditor('htmltest');
				_swicthPanel('editor');
			};

			var _panel_actived = 'editor';
			var _panels = ['editor','run','doc'];
			var _swicthPanel = function (panel) {
				if(panel!=_panel_actived) {
					_panel_actived = panel;
					_panels.forEach(function(_panel){
						if(panel!=_panel)
							document.getElementById('cpBuilder_panel_'+_panel).style.display = 'none';
					});
					document.getElementById('cpBuilder_panel_'+panel).style.display = 'block';
				}
			}
			var _getContent = function(type) {
				var fileContent = codeeditor.composer.getContentID(_cp_selected+type);
				return fileContent.replace( /\&/g,'§eper§').replace( /\+/g,'§plus§');
			};

			document.getElementById('cpBuilder_run').command = function (event) {
				_Msg.wait();
				composantBuilderIO.run(
					_getContent('js'),
					_getContent('css'),
					_getContent('jstest'),
					_getContent('htmltest'),
					function(data){
						_Msg.hide();
						cpb_iframe.src = 'server/cache/pagetest.html';
						swicthBtEditor('run');
						_swicthPanel('run');
					}
				);
			};

			document.getElementById('cpBuilder_doc').command = function (event) {
				cpb_doc.src = 'components/'+_cp_selected+'/doc/'+_cp_prefix+'_'+_cp_selected+'.html';
				swicthBtEditor('doc');
				_swicthPanel('doc');
			};

			cpb_iframe.addEventListener('load', function () {
				cpb_iframe.style.height = cpb_hbox.clientHeight + 'px';
				cpb_doc.style.height = cpb_hbox.clientHeight + 'px';
			}, false);

			document.getElementById('cpBuilder_save').command = function (event) {
				_Msg.wait();
				composantBuilderIO.save(
					_cp_prefix,
					_cp_selected,
					_getContent('js'),
					_getContent('css'),
					_getContent('jstest'),
					_getContent('htmltest'),
					function(data){
						_Msg.hide();
					}
				);
			};

			composantBuilderIO.getComponents(function(data){
				var options = '';
				data.forEach(function(item){
					options += '<option value="'+item+'">'+item+'</option>';
				});

				cpb_components.innerHTML = options;

				cpb_components.addEventListener('change', function (ev) {
					if(this.value!='' && this.value!=_cp_selected) {
						_editCP(this.value);
					}
				}, false);
			});
		}
	};

	// ------------------------------------------------------------------

	var composantBuilderView = {
		init : function () {
			_Msg = document.getElementById('msg');
			view.initEvents();
		}
	};
	return composantBuilderView;
});
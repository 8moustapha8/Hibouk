/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant popupboxes
 * namespace : http://www.components.org
 */
define('cp/popupboxes/cp_popupboxes',function() {
	(function() {

		var _topZIndex = function() {
			var num = [1];
			[].forEach.call(document.querySelectorAll('*'),function(el, i){
				var x = parseInt(window.getComputedStyle(el, null).getPropertyValue("z-index")) || null;
				if(x!=null)
					num.push(x);
			});
			return Math.max.apply(null, num);
		};

		var _reposition = function(elem) {
			// selon la talle de l'élément détermine le top et left
			var top = ((window.innerHeight / 2) - (elem.offsetHeight / 2)) - 50;
			var left = ((window.innerWidth / 2) - (elem.offsetWidth / 2));

			// reste dans la fenêtre
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;

			// css sur l'élément
			elem.style.top = top + 'px';
			elem.style.left = left + 'px';
		};

		var popupboxes = {

			methods : {

				message : function (msg,type) {
					var topZIndex = _topZIndex();
					// si un message n'est pas affiché on en crée un
					var dia = document.getElementById('g_dia_m');
					if(dia==undefined)
						document.body.insertAdjacentHTML('beforeend', '<div class="g_dia_m" id="g_dia_m"></div>');

					dia = document.getElementById('g_dia_m');
					dia.style.zIndex = topZIndex+2;

					// selon le message
					switch( type ) {
						case 'wait': // attente
							dia.innerHTML = '<img style="vertical-align:middle;" src="'+this.getAttribute('wait')+'"/>';
						break;
						case 'waitM': // attente
							dia.innerHTML = '<img style="vertical-align:middle;" src="'+this.getAttribute('wait')+'"/>&#160;&#160;'+msg;
						break;
						case 'box':
							dia.innerHTML = msg;
						break;
						default: // on affiche le message pendant 1500 millisecondes
							dia.innerHTML = msg;
							setTimeout(function(){dia.parentNode.removeChild( dia );},1500);
						break;
					}
					// positionne le message
					_reposition(dia);

					// on affiche
					dia.style.visibility = 'visible';
				},

				wait : function () {
					this.message('','wait');
				},

				waitM : function (msg) {
					this.message(msg,'waitM');
				},

				box : function (msg) {
					this.message(msg,'box');
				},

				hide: function(){
					setTimeout(function(){
						var dia = document.getElementById('g_dia_m');
						if(dia)
							dia.parentNode.removeChild( dia );
					},500);
				},

				dialogue : function (type,title,msg,callback){
					var dia = document.getElementById('g_dia_m');
					if(dia!=undefined)
						dia.parentNode.removeChild( dia );
					// détermine le z-index
					var topZIndex = _topZIndex();
					var idOverlay = 'poverlay'+topZIndex;

					document.body.insertAdjacentHTML('beforeend', '<div class="g_dia_container" id="'+idOverlay+'"></div>');
					var dia = document.getElementById(idOverlay);
					dia.style.zIndex = topZIndex+1;
					dia.style.height = window.innerHeight+'px';

					var classAlert = '';
					if( type== 'alert')
						classAlert = ' class="alert"';
					document.body.insertAdjacentHTML('beforeend', '<div id="g_dia_container"><h1 id="g_dia_title"></h1><div id="g_dia_content"'+classAlert+'><div id="g_dia_message"></div></div></div>');

					var container = document.getElementById('g_dia_container');
					container.style.zIndex = topZIndex+1;

					// insertion du titre
					document.getElementById("g_dia_title").innerHTML = title;

					// insertion du message
					var messageEl = document.getElementById("g_dia_message");
					messageEl.innerHTML = msg;

					// positionne le message
					_reposition(container);
					var btOk = '<input type="image" src="'+this.getAttribute('ok')+'" id="popup_ok" />';
					var btCancel = '<input type="image" src="'+this.getAttribute('cancel')+'" id="popup_cancel" style="display:none;"/>';
					// insertion du bouton ok
					messageEl.insertAdjacentHTML('afterend', '<div id="g_dia_panel">' + btCancel + ' ' + btOk + '</div>');
					var popup_ok = document.getElementById("popup_ok");
					var cl = function(val){
						container.parentNode.removeChild( container );
						dia.parentNode.removeChild( dia );
						if( callback )
							callback(val);
					};

					popup_ok.addEventListener("click", function(event) {
						cl(true);
					});

					if( type== 'confirm') {
						var popup_cancel = document.getElementById("popup_cancel");
						popup_cancel.style.display = 'inline';
						popup_cancel.addEventListener("click", function(event) {
							cl(false);
						});
						// Validation clavier (ok:enter, cancel:echap)
						popup_ok.addEventListener("keydown", function(event) {
							if( event.keyCode == 13)
								cl(true);
							if(event.keyCode == 27)
								cl(false);
						});
					} else {
						popup_ok.addEventListener("keydown", function(event) {
							if( event.keyCode == 13 || event.keyCode == 27 )
								cl(true);
						});
					}
					container.style.visibility = 'visible';
					popup_ok.focus();
				},

				alert : function (title,msg,callback){
					this.dialogue('alert',title,msg,callback);
				},

				confirm : function (title,msg,callback){
					this.dialogue('confirm',title,msg,callback);
				},

				download : function (url,filesTypes,callback,filesList) {
					var msg = '<div id="importfiles_dia" style="width:380px;height:80px;"><input type="file" id="importfiles_input" style="display:none"></input><div id="importfiles_boxMessage"></div></div>';

					var _this = this;

					_this.message(msg,'box');

					var importfiles = document.getElementById('importfiles_dia');
					var input = document.getElementById("importfiles_input");

					$req('js/lib/g_uploadfiles',function(uploadFiles) {

						var msg = {
							url : url,
							box : document.getElementById("importfiles_boxMessage"),
							hide : function(){},
							container : "fileupload-container",
							fileInfo : "fileupload-file",
							progressBarContainer : "fileupload-progress-bar-container",
							progressBar : "fileupload-progress-bar",
							percent : "fileupload-progress-percent"
						};

						var _uploadFiles = function(files){
							// filesTypes ex: ['jpg','jpeg','png']
							uploadFiles(files,msg,filesTypes,function(data){
								setTimeout(function(){
									var dia = document.getElementById('g_dia_m');
									if(dia)
										dia.parentNode.removeChild( dia );
									callback(data);
								},500);
							});
						};

						if(filesList==undefined){
							input.addEventListener("change", function () {
								_uploadFiles(this.files);
							}, false);

							input.click();
						} else {
							_uploadFiles(filesList);
						}
					});
				}
			}
		};

		JSElem.register('http://www.components.org','popupboxes',popupboxes);
	}());
});
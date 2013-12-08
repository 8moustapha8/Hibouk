/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module g_packages
 */
define('bdl/packages/g_packages',function() {

	var _ajax, _module, _Msg, _locale, _tplPackages;

	var _url = '';

	var depots = {
		init : function () {
			// chargements des dépots quand l'onglet est sélectionné
			var selectDepotFirst = true;
			document.getElementById('Gpack-tabbox').addEventListener('change', function (event) {
				if (event.detail != undefined){
					// onglet dépot et première sélection de l'onglet
					if (event.detail.element.id === 'tab_depots' && selectDepotFirst) {
						selectDepotFirst = false;
						$notify.pub('depots/refresh');
					}
				}
			}, false);

			// refresh
			document.getElementById('depot-refresh').command = function (event) {
				$notify.pub('depots/refresh');
			};
			// ajouter un dépôt
			document.getElementById('depot-add').command = function (event) {
				$notify.pub('depots/add');
			};
			// supprimer un dépôt
			document.getElementById('depot-del').command = function (event) {
				$notify.pub('depots/del');
			};
			// sauvegarde les dépôts
			document.getElementById('depot-save').command = function (event) {
				$notify.pub('depots/save');
			};

			// notification
			depots.notification();
		},

		notification : function () {
			var gpackDepot = document.getElementById('Gpack-depot');
			var depotDel = document.getElementById('depot-del');

			var selectedDepot = null;

			var itemInit = function(item) {
				item.addEventListener('click', function (event) {
					if(this.getAttribute('selected')=='false') {
						[].forEach.call(gpackDepot.querySelectorAll('cp\\:flist'), function (el) {
							el.setAttribute('selected','false');
						});
						this.setAttribute('selected','true');
						depotDel.setAttribute('inactivated','false');
						selectedDepot = this;
					}
				}, false);
			};
			// lecture de la liste des dépots
			$notify.sub('depots/refresh',function() {
				_Msg.waitM(_locale['depotRefresh']);
				selectedDepot = null;
				gpackDepot.innerHTML = '';
				_ajax.getJSON({
					url : _url,
					data : {
						module : _module,
						act : 'loadShowDepots',
					},
					success : function (data) {
						_Msg.hide();
						data.content.forEach(function(_depot,d){
							var id = 'cp_flist_'+d;
							gpackDepot.insertComponent('beforeend','<cp:flist id="'+id+'" selected="false"></cp:flist>');
							var items = [];
							for(var key in _depot)
								items.push(key+'='+_depot[key]);
							var flist = document.getElementById(id);
							flist.setContent(items);

							itemInit(flist);
						});
					}
				});
			});

			// supprimer un dépôt
			$notify.sub('depots/del',function() {
				if(selectedDepot) {
					depotDel.setAttribute('inactivated','true');
					selectedDepot.parentNode.removeChild( selectedDepot );
				}
			});

			// ajout d'un dépôt
			$notify.sub('depots/add',function() {
				var id = 'cp_flist_'+ new Date().getTime();
				gpackDepot.insertComponent('beforeend','<cp:flist id="'+id+'" selected="false"></cp:flist>');
				var flist = document.getElementById(id);
				flist.setContent(['id=']);
				itemInit(flist);
			});

			// sauvegarde de la liste des dépôts
			$notify.sub('depots/save',function() {
					_Msg.waitM(_locale['depotSave']);
					if(selectedDepot) {
						depotDel.setAttribute('inactivated','true');
						selectedDepot.setAttribute('selected','true');
					}
					var depotsObj = [];
					[].forEach.call(gpackDepot.querySelectorAll('cp\\:flist'), function (el,i) {
						depotsObj.push(el.getContent());
					});
					depotsObj = JSON.stringify(depotsObj);

					_ajax.getJSON({
						url : _url,
						data : {
							module : _module,
							act : 'saveDepots',
							depots : depotsObj
						},
						success : function (data) {
							_Msg.message(data.content);
						}
					});

			});
		},
	};
	var pk = {

		init : function () {

			// chargements des packages quand l'onglet est sélectionné une première fois
			var selectPackagesFirst = true;
			document.getElementById('Gpack-tabbox').addEventListener('change', function (event) {
				if (event.detail != undefined){
					// onglet packages et première sélection de l'onglet
					if (event.detail.element.id === 'tab_packages' && selectPackagesFirst) {
						selectPackagesFirst = false;
						$notify.pub('packages/loadPackages');
					}
				}
			}, false);

			// bar tools packages
			// update
			document.getElementById('packages-update').addEventListener('click', function () {
				$notify.pub('packages/updatePackages');
			});
			// Show stable or alpha, beta versions
			document.getElementById('packages-showPhaseDev').addEventListener('change', function (event) {
				if(this.checked)
					pk.phaseDevViewOther = false;
				else
					pk.phaseDevViewOther = true;

				$notify.pub('packages/loadPackages');
			}, false);

			// notification
			pk.notification();
		},

		notification : function () {
			// Chargement des packages
			$notify.sub('packages/loadPackages',function() {
				_Msg.waitM(_locale['LoadPackages']);
				_ajax.getJSON({
					url : _url,
					data : {
						module : _module,
						act : 'loadPackages',
					},
					success : function (data) {
						var packages = pk.viewPackages(data,_tplPackages,_locale);
						document.getElementById('Gpack-frame-packages').innerHTML = packages;
						_Msg.hide();
						pk.hideInfoPackages();
						// Évenements sur la liste des packages
						pk.eventPackages();
					}
				});
			});

			// Maj des packages
			$notify.sub('packages/updatePackages',function() {
				_Msg.waitM(_locale['updatedPackages']);
				_ajax.getJSON({
					url : _url,
					data : {
						module : _module,
						act : 'updatePackages',
					},
					success : function (data) {
						var packages = pk.viewPackages(data,_tplPackages,_locale);
						document.getElementById('Gpack-frame-packages').innerHTML = packages;
						_Msg.hide();
						pk.hideInfoPackages();
						// Évenements sur la liste des packages
						pk.eventPackages();
					}
				});
			});

			// ---------------------------------------------------------------

			// Action sur un package

			// information d'un package
			$notify.sub('package/helpPackage',function(elem) {
				// boite de dialogue d'attente
				_Msg.waitM(_locale['loadInfoPackage']);
				// cache les infos
				pk.hideInfoPackages();
				// on récupère les infos depuis le serveur
				pk.infoPackage(elem,function(infos){
					// affichage des infos
					document.getElementById('Gpack-info-packages').innerHTML = infos.content;
					// cache la boite de dialogue d'attente
					_Msg.hide();
				});
				return [elem];
			});

			// installation d'un package
			$notify.sub('package/installPackage',function(elem) {
				// test des dépendances
				var objDepend = pk.depend(elem);
				if(objDepend.valid){

					// boite de dialogue d'attente
					_Msg.waitM(_locale['installPackage']);

					var uid = pk.findUIDPackage(elem),
						version = pk.findDataPackage(elem,'version'),
						namespace = pk.findDataPackage(elem,'namespace'),
						depot = pk.findDataPackage(elem,'depot');
					_ajax.getJSON({
						url : _url,
						data : {
							module : _module,
							act : 'installPackage',
							uid : uid,
							version : version,
							namespace : namespace,
							depot : depot
						},
						success : function (data) {
							_Msg.hide();
							$notify.pub('packages/updatePackages');
						}
					});
				} else {
					pk.dependUnmet(objDepend.unmet);
				}
				return [elem];
			});

			// suppression d'un package
			$notify.sub('package/deletePackage',function(elem) {

				var callback = function(confirm){
					if(confirm){
						// test des dépendances
						var objDependDown = pk.dependDown(elem);
						if(objDependDown.valid){

							// boite de dialogue d'attente
							_Msg.waitM(_locale['removePackage']);

							var uid = pk.findUIDPackage(elem),
								version = pk.findDataPackage(elem,'version'),
								namespace = pk.findDataPackage(elem,'namespace'),
								depot = pk.findDataPackage(elem,'depot');
							_ajax.getJSON({
								url : _url,
								data : {
									module : _module,
									act : 'removePackage',
									uid : uid,
									version : version,
									namespace : namespace,
									depot : depot
								},
								success : function (data) {
									_Msg.hide();
									$notify.pub('packages/updatePackages');
								}
							});
						} else {
							pk.dependDownUnmet(objDependDown.unmet);
						}
					}
				};
				var name = elem.parentNode.parentNode.querySelector('.name').innerHTML;
				_Msg.confirm(_locale['removePackage'],_locale['removePackageConfirm']+'<br/><br/><b>'+name+'</b><br/><br/>',callback);

				return [elem];
			});

			// maj d'un package
			$notify.sub('package/updatePackage',function(elem) {
					// test des dépendances
					var objDepend = pk.depend(elem);
					if(objDepend.valid){

						// boite de dialogue d'attente
						_Msg.waitM(_locale['updatePackage']);

						var uid = pk.findUIDPackage(elem),
							version = pk.findDataPackage(elem,'version'),
							namespace = pk.findDataPackage(elem,'namespace'),
							depot = pk.findDataPackage(elem,'depot');
						_ajax.getJSON({
							url : _url,
							data : {
								module : _module,
								act : 'updatePackage',
								uid : uid,
								version : version,
								namespace : namespace,
								depot : depot
							},
							success : function (data) {
								_Msg.hide();
								$notify.pub('packages/updatePackages');
							}
						});
					} else {
						pk.dependUnmet(objDepend.unmet);
					}
					return [elem];
			});
		},

		// retrouve l'uid d'un package
		findUIDPackage:function(elem){
			return elem.parentNode.parentNode.getAttribute('id');
		},
		// retrouve un data d'un package
		findDataPackage:function(elem,suffix){
			return elem.parentNode.parentNode.getAttribute('data-'+suffix);
		},

		// tranforme en object les dépendances d'un package
		dependObject:function(elem,directElement){
			var dependS = undefined;
			if(directElement)
				dependS = elem.getAttribute('data-depend');
			else
				dependS = this.findDataPackage(elem,'depend');

			if(dependS!= undefined && dependS.length>0){
				var dependL = dependS.split('|'),
						depend = {};

				dependL.forEach(function (v,i) {
					var NandV = v.split(',');
					depend[i] = {namespace:NandV[0],name:NandV[1],version:NandV[2]};
				});
				return depend;
			} else {
				return null;
			}
		},

		// test de dépendance
		depend : function(elem){
			var that = this,
				dependObject = that.dependObject(elem,false);
			if(dependObject!=null){
				var depend = {valid:false,unmet:{}};
				var i = 0;
				for(var p in dependObject){
					// tester si c'est installé !
					var installed = document.getElementById('Gpack-frame-packages').querySelector('div[data-namespace="'+dependObject[p].namespace+'"][data-installed="true"]');
					if(installed){
						var version = installed.querySelector('.installedVersion').innerHTML;
						// tester si c'est installé et la version est sup ou égal à la dépendance
						if(that.recentVersion(version,dependObject[p].version,true)){
								depend.valid = true;
						} else {
							depend.valid = false;
							depend.unmet[i] = dependObject[p];
						}
					} else {
						depend.valid = false;
						depend.unmet[i] = dependObject[p];
					}
					i++;
				}
				return depend;
			} else {
				// pas de dépendance !
				return {valid:true};
			}
		},

		// Méssage pour des dépendances non satifaites
		dependUnmet:function(unmet){
			var unmetHTML = '<p><b>'+_locale['installPackagesBefore']+'</b></p><ul style="text-align:left;">';
			for(var p in unmet){
					unmetHTML += '<li>'+unmet[p].name+' &gt;= '+unmet[p].version+'</li>';
			}
			unmetHTML += '</ul>';
			_Msg.alert(_locale['unmetPackages'],unmetHTML);
		},

		// test de dépendance descendante
		dependDown : function(elem){
			var that = this,
				thatNamespace = this.findDataPackage(elem,'namespace'),
				depend = {valid:true,unmet:{}};
			// scan des packages installés
			[].forEach.call(document.getElementById('Gpack-frame-packages').querySelectorAll('div[data-installed="true"]'), function (el,i) {
				var dependObject = that.dependObject(el,true);
				if(dependObject){
					// recherche si les namespaces sont équivalent
					for(var p in dependObject){
						if(dependObject[p].namespace==thatNamespace){
							depend.valid = false;
							depend.unmet[i] = el;
						}
					};
				}
			});
			return depend;
		},

		// Méssage pour des dépendances descendantes non satifaites
		dependDownUnmet:function(unmet){
			var unmetHTML = '<p><b>'+_locale['removePackagesBefore']+'</b></p><ul style="text-align:left;">';
			for(var p in unmet){
					unmetHTML += '<li>'+unmet[p].querySelector('.name').innerHTML+'</li>';
			}
			unmetHTML += '</ul>';
			_Msg.alert(_locale['unmetDownPackages'],unmetHTML);
		},

		// traitement des infos depuis un package
		infoPackage:function(elem,callback){
			// uid du package
			var uid = this.findUIDPackage(elem),
				version = this.findDataPackage(elem,'version'),
				namespace = this.findDataPackage(elem,'namespace'),
				depot = this.findDataPackage(elem,'depot'),
				installed = this.findDataPackage(elem,'installed');
				update = this.findDataPackage(elem,'update');
			_ajax.getJSON({
				url : _url,
				data : {
					module : _module,
					act : 'loadInfoPackage',
					uid : uid,
					version : version,
					depot : depot,
					namespace : namespace,
					installed : installed,
					update : update
				},
				success : function (data) {
					// on retourne la réponse
					callback(data);
				}
			});
		},

		// visibilté des phases de dévellopement non stable
		phaseDevViewOther:false,

		// Compare deux versions sous la forme que v1 est plus récente que v2 ?
		// si supEgal pas undefined
		// Compare deux versions sous la forme que v1 est plus récente ou égal que v2
		recentVersion:function(v1,v2,supEgal){
				v1 = v1.split('.');
				v2 = v2.split('.');
				v1 = (v1[0]*1000000)+(v1[1]*1000)+(v1[2]*1);
				v2 = (v2[0]*1000000)+(v2[1]*1000)+(v2[2]*1);
				if(supEgal!=undefined){
					if(v1>=v2)
						return true;
					else
						return false;
				} else {
					if(v1>v2)
						return true;
					else
						return false;
				}
		},
		// création de la liste des packages pour l'afficher
		viewPackages:function(data,tplPackages,packagesLang){
			var that = this, packagesHTML = '';
			for(var uid in data.allPackages) {
				var item = data.allPackages[uid];
					var install = item.install, other = item.other,stable = item.stable,
						_showInstall = false, _packMAJ = false, _packageShow = null;
					if(install!=null){
						// le package est installé
						_showInstall = true;
						_packageInstall = install;
						_packageShow = install;
						// existe-t-il une version plus résente mise à jour possible
						if(other!=null || stable!=null){
							// affiche des versions dev (other)
							if(that.phaseDevViewOther){
								if(other!=null){

									if(stable!=null){
										// il y a une version stable et other Qu'elle est la plus récente
										if(that.recentVersion(other.version,stable.version))
											var _newVersion = other;
										else
											var _newVersion = stable;
										// maintenant est-elle plus récente que la version installé ?
										if(that.recentVersion(_newVersion.version,install.version)){
											_packageShow = _newVersion;
											_packMAJ = true;
										}
									} else {
										// il n'y a qu'une version other mais est-elle plus récente que la version installé ?
										if(that.recentVersion(other.version,install.version)){
											_packageShow = other;
											_packMAJ = true;
										}
									}
								} else {
									// il y a une version stable mais est-elle plus récente que la version installé ?
									if(that.recentVersion(stable.version,install.version)){
										_packageShow = stable;
										_packMAJ = true;
									}
								}
							} else {
								// on affiche que les version stables

								// y'a-t-il une version stable et est-elle plus récente que la version installé ?
								if(stable!=null){
									if(that.recentVersion(stable.version,install.version)){
										_packageShow = stable;
										_packMAJ = true;
									}
								}
							}
						}
					} else {
						// ce package n'est pas installé
						if(that.phaseDevViewOther){
							if(other!=null){
								if(stable!=null){
									// il y a une version stable et other Qu'elle est la plus récente
									if(that.recentVersion(other.version,stable.version))
										_packageShow = other;
									else
										_packageShow = stable;
								} else {
									// il n'y a qu'une version
									_packageShow = other;
								}
							} else {
								_packageShow = stable;
							}
						} else {
							// on affiche que les version stables
							// y'a-t-il une version stable ?
							if(stable!=null)
								_packageShow = stable;
						}
					}

					// affiche-t-on le package ?
					if(_packageShow!=null){

						if(_showInstall){

							_packageShow['installedInfos'] = '<div class="installed">'
								+_packageInstall['name']+'&#160;&#160;<span class="installedVersion">'+_packageInstall['version']+'</span>'
								+'<span class="installedPD">&#160;'+_packageInstall['phase_dev']+'</span></div>';

							_packageShow['updateORinstall'] = 'Gpack-frame-packages-installed';
							_packageShow['deleteHidden'] = 'inline';
							_packageShow['addHidden'] = 'none';
							_packageShow['installed'] = 'true';

							// update
							if(_packMAJ){
								_packageShow['updateORinstall'] = 'Gpack-frame-packages-update';
								_packageShow['update'] = 'true';
								_packageShow['majHidden'] = 'inline';
							} else {
								_packageShow['update'] = 'false';
								_packageShow['majHidden'] = 'none';
							}

							// gallina
							if(_packageShow.uid == '7d8e3acb-e010-1a74-911b-8187844a24e9')
								_packageShow['deleteHidden'] = 'none';

						} else {
							_packageShow['installed'] = '';
							_packageShow['updateORinstall'] = '';
							_packageShow['deleteHidden'] = 'none';
							_packageShow['majHidden'] = 'none';
							_packageShow['addHidden'] = 'inline';
							_packageShow['installed'] = 'false';
						}
						_packageShow['kl'] = packagesLang;
					packagesHTML += $tpl.render(_tplPackages,_packageShow);
					}
			}
			return packagesHTML;
		},
		// supprime les infos d'un package
		hideInfoPackages: function(){
			document.getElementById('Gpack-info-packages').innerHTML = '';
		},

		eventPackages: function(){
			// Évenements sur la liste des packages
			var gpackFramePackages = document.getElementById('Gpack-frame-packages');
			// install
			[].forEach.call(gpackFramePackages.querySelectorAll('.installPackage'), function (el) {
				el.addEventListener('mouseup', function () {
					$notify.pub('package/installPackage',[el]);
				}, false);
			});

			// update
			[].forEach.call(gpackFramePackages.querySelectorAll('.updatePackage'), function (el) {
				el.addEventListener('mouseup', function () {
					$notify.pub('package/updatePackage',[el]);
				}, false);
			});

			// delete
			[].forEach.call(gpackFramePackages.querySelectorAll('.deletePackage'), function (el) {
				el.addEventListener('mouseup', function () {
					$notify.pub('package/deletePackage',[el]);
				}, false);
			});

			// information
			[].forEach.call(gpackFramePackages.querySelectorAll('.helpPackage'), function (el) {
				el.addEventListener('mouseup', function () {
					$notify.pub('package/helpPackage',[el]);
				}, false);
			});
		},
	};

	var configuration = {
		init : function () {
			// vue que c'est la fonction qui va être lancé en premier
			// il faut s'assurer que ajax est chargé
			$req(['js/lib/g_ajax','tpl!bdl/packages/g_packages_m'],function(__ajax,tplPackages,tplDepots) {
				_tplPackages = tplPackages.g_packages_m.content;
				_ajax = __ajax;
				__ajax.getJSON({
					url : _url,
					data : {
						module : _module,
						act : 'start',
					},
					success : function (data) {
						var Gpackadmin = document.getElementById('Gpack-admin');
						var content = Gpackadmin.innerHTML;
						var tplRender = $tpl.render(content,data);
						Gpackadmin.innerHTML = tplRender;

						[].forEach.call(Gpackadmin.querySelectorAll('input[type="checkbox"]'), function (el) {
							if(/^true$/i.test(el.getAttribute('checked')))
								el.checked = true;
							else
								el.checked = false;
						});
						configuration.initEvents();
					}
				});
			});
		},

		initEvents : function () {
			// events
			setTimeout(function(){
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent('resize', true, false);
				window.dispatchEvent(evt);
			}, 300);

			document.getElementById('frame').addEventListener('load', function () {
				var html = this.contentWindow.document.body.innerHTML;
				if(html!=''){
					html = html.replace('<pre>','').replace('</pre>','');
					var json = JSON.parse(html);
					_Msg.alert('','<b>'+json.content+'</b>');
				}
			}, false);

			// DNS -----------------------------------------------------
			var dbHost = document.getElementById('dbHost');
			var dbName = document.getElementById('dbName');

			var dns = function(){
				var host = dbHost.value;
				var name = dbName.value;

				if(host!='')
					host = 'mysql:host='+host+';dbname='

				document.getElementById('dbDNS').value = host+name;
			}
			dbHost.addEventListener('keyup', function () {
				dns();
			}, false);
			dbName.addEventListener('keyup', function () {
				dns();
			}, false);

			// logout -----------------------------------------------------
			document.getElementById('bt_logout').command = function () {
				window.location.assign('index.php?module=packages&act=logout');
			};
		}
	};
	var appli = {
		init : function ( url , module ) {
			_url = url;
			_module = module;
			_locale = $definition['i18n!bdl/packages/locale/g_packages'];

			_Msg = document.getElementById('msg');
			configuration.init();
			pk.init();
			depots.init();
		},
	};

	return appli;
});
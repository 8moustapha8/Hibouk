/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_tocView
 */
define('bdl/bookToc/ap_tocView',function() {

	var view = {

		initEvents : function () {
			var book_toc_ncx = document.getElementById('book_toc_ncx');
			var book_toc_genrerate = document.getElementById('book_toc_genrerate');
			var loadTXT = document.getElementById('strbundles').getText('load');
			var tocFileName = document.getElementById('strbundles').getText('tocFileName');
			var tocTitle = document.getElementById('strbundles').getText('tocTitle');

			var _epubopf = null;

			var getText = function( elems ) {
				var ret = '', elem;

				for ( var i = 0; elems[i]; i++ ) {
					elem = elems[i];

					if ( elem.nodeType === 3 || elem.nodeType === 4 )
						ret += elem.nodeValue;
					else if ( elem.nodeType !== 8 )
						ret += getText( elem.childNodes );
				}
				return ret;
			};

			// events
			document.getElementById('book_toc_genrerate').command = function (event) {
				var name = 'toc.xhtml';
				var tocFile = _epubopf.getRegister('spine').getPathFromItem()+name;
				var cssList = _epubopf.getCSSList();
				var name = prompt(tocFileName,"");
				if (name!=null) {
					name = $func.stringClear(name);
					var title = prompt(tocTitle,"");
					if (title!=null) {
						var content = '<h1 class="toc_title">'+title+"</h1>\n"+navMap.domToc();
						$func.creatFile( $func.bookID(), name, content, cssList, 'TOC', function(data){
							$func.insertSpineItem( data.id, data.href, 'application/xhtml+xml', 'toc', 'beforeend');
						});
					}
				}
			};

			document.getElementById('book_toc_creat').command = function (event) {
				// récupération du nombre de niveaux
				var level = document.getElementById('book_toc_level').value*1;

				document.body.insertComponent('beforeend', '<cp:dialog id="bookSaveTmp" width="350px" height="150px" title="Table des matières" hide="no"><div id="bookSaveTmpMSG" style="margin-top:10px;height:30px;text-align:center;"><img src="images/g_wait.gif"></img><br></br><span class="bibliobookMsg"></span></div></cp:dialog>');

				var bookSaveTmp = document.getElementById('bookSaveTmp');

				bookSaveTmp.getButtons().style.display = 'none';
				var msg = $func.msg(document.getElementById('bookSaveTmpMSG'));

				msg(document.getElementById('strbundles').getText('filesList'));

				var dirname = _epubopf.getDirname();
				var files = _epubopf.getRegister('spine').getFiles();

				var iflevel = document.createElement('iframe');
				iflevel.style.display = 'none';
				document.body.appendChild(iflevel);

				var exit = function () {
					bookSaveTmp.parentNode.removeChild( bookSaveTmp );

					setTimeout(function(){
						document.body.removeChild( iflevel );
					}, 100);
				};

				var countFilesSpine = 0;
				var lengthFilesSpine = files.length;

				var classFind = [];
				var classLevel = {};
				for (var i = 0; i < level; i++) {
					var n = 'h'+(i+1);
					classLevel[n] = i+1;
					classFind.push(n);
				};
				classFind = classFind.join(',');

				var ElementParent = {
					'0' : document.createElementNS("http://www.daisy.org/z3986/2005/ncx/","ncx:navMap")
				}, noerror = true;

				iflevel.onload = function (){
					var __href = window.location.href;
					__href = __href.substring(0, __href.lastIndexOf('/')+1);
					var sizeURL = (__href+dirname).length;
					var src = iflevel.src;
					src = src.substring(sizeURL);

					countFilesSpine++;
					var saveSource = false;
					[].forEach.call(iflevel.contentWindow.document.querySelectorAll(classFind), function (element) {
						var id = element.getAttribute('id');
						var cl = element.nodeName.toLowerCase();
						var _id = 'p_'+new Date().getTime();

						// TODO:   ID !!!!
						if(id==undefined) {
							saveSource = true;
							id = 'p_'+new Date().getTime();
							element.setAttribute('id',id);
						} else {
							_id = id;
						}

						var navpoint = document.createElementNS("http://www.daisy.org/z3986/2005/ncx/","ncx:navPoint");

						navpoint.setAttribute("id", _id);
						navpoint.setAttribute("playOrder", '1');

						var navlabel = document.createElementNS("http://www.daisy.org/z3986/2005/ncx/","ncx:navLabel");
						var nav_text = document.createElementNS("http://www.daisy.org/z3986/2005/ncx/","ncx:text");

						var txtnode = document.createTextNode(getText(element.childNodes));
							nav_text.appendChild(txtnode);
							navlabel.appendChild(nav_text);
							navpoint.appendChild(navlabel);

							var content = document.createElementNS("http://www.daisy.org/z3986/2005/ncx/","ncx:content");
							content.setAttribute("src", src + '#' +_id);
							navpoint.appendChild(content);

							if(ElementParent[classLevel[cl]-1] != undefined) {
							ElementParent[classLevel[cl]-1].appendChild(navpoint);
							ElementParent[classLevel[cl]] = navpoint;
						} else {
							noerror = false;
							alert('No parent, level:'+classLevel[cl]+' content:'+getText(element.childNodes));
						}
					});
					if (saveSource && noerror) {
						var contentSource = new XMLSerializer().serializeToString(iflevel.contentWindow.document);
						$func.saveFile($func.bookID(),src, contentSource,function(){});
					}

					if(!noerror) {
						exit();
					} else {
						if(lengthFilesSpine==countFilesSpine) {
							exit();
							navMap = null;
							initNavMap(ElementParent[0].domString());
						} else {
							msg(loadTXT+files[countFilesSpine]);
							iflevel.src = dirname + files[countFilesSpine];
						}
					}
				};

				msg(loadTXT+files[0]);
				iflevel.src = dirname + files[0];
			};

			var navMap = null;
			// suppression d'un élément
			document.getElementById('book_toc_del').command = function (event) {
				navMap.delItem();
			};

			// ajouter un élément
			document.getElementById('book_toc_add').command = function (event) {
				navMap.addItem();
			};

			var initNavMap = function (content) {
				book_toc_ncx.insertComponent('replace',content);
				navMap = book_toc_ncx.querySelector('ncx\\:navMap');
				navMap.init(_epubopf);

				navMap.addEventListener('selectedNavPoint', function (ev) {
					if (ev.detail.id==null)
						document.getElementById('book_toc_del').setAttribute('inactivated','true');
					else
						document.getElementById('book_toc_del').removeAttribute('inactivated');
				}, false);

				document.getElementById('book_toc_add').removeAttribute('inactivated');
			};

			// =====================================================================
			// notify
			$notify.sub('book/load', function(attr){
				_epubopf = attr.epubopf;
				// la source possède-t-elle un document ncx ?
				var objNCX = _epubopf.getNcx();
				if(objNCX.href!=null) {
					tocView.TocModel.loadNCX(attr.id, objNCX.href, function(data){
						initNavMap(data.content);
						navMap.setHref(objNCX.href);
					});
				}
				document.getElementById('book_toc_creat').removeAttribute('inactivated');
				return [attr];
			});
			$notify.sub('book/close', function(metadata){
				_epubopf = null;
				if(navMap!=null)
					navMap.close();
				navMap = null;
				book_toc_ncx.insertComponent('replace','');
				document.getElementById('book_toc_del').setAttribute('inactivated','true');
				document.getElementById('book_toc_add').setAttribute('inactivated','true');
				document.getElementById('book_toc_creat').setAttribute('inactivated','true');
				return [metadata];
			});
		}
	};

	// =====================================================================

	var tocView = {

		TocModel : null,

		init : function ( TocModel ) {
			tocView.TocModel = TocModel;
			view.initEvents();
		},
	};
	return tocView;
});
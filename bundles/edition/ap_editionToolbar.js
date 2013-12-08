/**
 * @package Hibouk (O,O)
 * @subpackage application (ap_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Module ap_editionToolbar
 */
define('bdl/edition/ap_editionToolbar', function() {

	var _toInactivated = function(el,d) {
		if(d)
			el.setAttribute('inactivated','false');
		else
			el.setAttribute('inactivated','true');
	};

	// enregistrement d'un status
	var _registerS = function(commandName,rangeState, selectorTags, selectorClass, computedStyle, element) {
		cp_editor.commands.registerState(commandName,rangeState,selectorTags,selectorClass,computedStyle,
			function(){element.setAttribute('inactivated','true');},
			function(){element.setAttribute('inactivated','false');}
		);
	};

	// enregistrement de commandes
	var _registerE = function(commandName,value,element,fnc) {
		element.command =  function (ev) {
			cp_editor.commands.exec(commandName,value);
		};

		cp_editor.commands.registerExec(commandName,fnc);
	};

	var editionToolbar = {

		init : function (LANG) {

			var rangeState = null;
			// buttons
			// undo/redo
			var btUndo = document.getElementById('edition_undo');
			var btRedo = document.getElementById('edition_redo');
			// bascule source/texte
			var btsource = document.getElementById('edition_txtcode');

			// events
			btUndo.command = function (event) {
				cp_editor.undoRedo.undo();
			};
			btRedo.command = function (event) {
				cp_editor.undoRedo.redo();
			};

			btsource.command = function (event) {
				var mode = cp_editor.composer.toogleView();
				btsource.setAttribute('mode',mode);
			};

			// notifications
			cp_editor.notify.sub('document:undoredo',function(data){
				_toInactivated(btUndo,data.undo);
				_toInactivated(btRedo,data.redo);
			});

			cp_editor.notify.sub('document:undoSave',function(data){
				btUndo.setAttribute('inactivated','false');
				btRedo.setAttribute('inactivated','true');
			});

			cp_editor.notify.sub('composer:show',function(data){
				btsource.setAttribute('mode',data.mode);
				btsource.setAttribute('inactivated','false');
				// undo/redo
				_toInactivated(btUndo,data.undoState);
				_toInactivated(btRedo,data.redoState);
				return [data];
			});

			cp_editor.notify.sub('composer:empty',function(){
				btsource.setAttribute('inactivated','true');
				btsource.setAttribute('mode','edit');
				// undo/redo
				btUndo.setAttribute('inactivated','true');
				btRedo.setAttribute('inactivated','true');
			});

			cp_editor.notify.sub('document:rangeChange',function(data){
				rangeState = data.selection;
				return [data];
			});
			// remove ------------------------------------------------------------------------
			// gum ------------------------------------------------------------------------

			var edition_remove = document.getElementById('edition_remove');
			var edition_gum = document.getElementById('edition_gum');
			cp_editor.notify.sub('document:treeChange',function(data){
				if(data.nodes) {
					edition_remove.setAttribute('inactivated','false');
					if(data.nodes[data.nodes.length-1])
						if(data.nodes[data.nodes.length-1].parentNode.nodeName.toLowerCase()!='body')
						edition_gum.setAttribute('inactivated','false');
				} else {
					edition_remove.setAttribute('inactivated','true');
					edition_gum.setAttribute('inactivated','true');
					_stateP('');
					edition_blockselect.setAttribute('inactivated','true');
				}
				return [data];
			});

			_registerE('remove',null,edition_remove,function(value,command,doc) {
				var n = cp_editor.dom('selectedNodes');
				if(n.elems[0].nodeName.toLowerCase()!='body') {
					n.rm();
					edition_remove.setAttribute('inactivated','true');
				}
			});

			_registerE('gum',null,edition_gum,function(value,command,doc) {
				var n = cp_editor.dom('selectedNodes');
				if(n.elems[0].nodeName.toLowerCase()!='body'  && n.elems[0].parentNode.nodeName.toLowerCase()!='body') {
					n.unwarp();
					edition_gum.setAttribute('inactivated','true');
				}
			});

			// bold ------------------------------------------------------------------------
			var edition_bold = document.getElementById('edition_bold');

			_registerS('bold',true,'b',null,null,edition_bold);
			_registerS('bold',false,'b',null,null,edition_bold);

			_registerE('bold',null,edition_bold,function(value,command,doc) {
				if(command.rangeState){
					var i = document.createElement("b");
					cp_editor.dom().surroundSelection(i);
				} else {
					command.getTreeDom().filterTagName('b').each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_bold.setAttribute('inactivated','true');
					});
				}
			});

			// italic ------------------------------------------------------------------------
			var edition_italic = document.getElementById('edition_italic');

			_registerS('italic',true,'i',null,null,edition_italic);
			_registerS('italic',false,'i',null,null,edition_italic);

			_registerE('italic',null,edition_italic,function(value,command,doc) {
				if(command.rangeState){
					var i = document.createElement("i");
					cp_editor.dom().surroundSelection(i);
				} else {
					command.getTreeDom().filterTagName('i').each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_italic.setAttribute('inactivated','true');
					});
				}
			});

			// underline ------------------------------------------------------------------------
			var edition_underline = document.getElementById('edition_underline');

			_registerS('underline',true,'span',null,{key:'text-decoration',value:'underline'},edition_underline);
			_registerS('underline',false,'span',null,{key:'text-decoration',value:'underline'},edition_underline);

			_registerE('underline',null,edition_underline,function(value,command,doc) {
				if(command.rangeState){
					var span = document.createElement("span");
					span.style.textDecoration = 'underline';
					//span.classList.add('_underline_');
					cp_editor.dom().surroundSelection(span);
				} else {
					command.getTreeDom().filterComputedStyle({key:'text-decoration',value:'underline'}).each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_underline.setAttribute('inactivated','true');
					});
				}
			});

			// superscript ------------------------------------------------------------------------
			var edition_superscript = document.getElementById('edition_superscript');

			_registerS('superscript',true,'sup',null,null,edition_superscript);
			_registerS('superscript',false,'sup',null,null,edition_superscript);

			_registerE('superscript',null,edition_superscript,function(value,command,doc) {
				if(command.rangeState){
					var sup = document.createElement("sup");
					cp_editor.dom().surroundSelection(sup);
				} else {
					command.getTreeDom().filterTagName('sup').each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_superscript.setAttribute('inactivated','true');
					});
				}
			});

			// subscript ------------------------------------------------------------------------
			var edition_subscript = document.getElementById('edition_subscript');

			_registerS('subscript',true,'sub',null,null,edition_subscript);
			_registerS('subscript',false,'sub',null,null,edition_subscript);

			_registerE('subscript',null,edition_subscript,function(value,command,doc) {
				if(command.rangeState){
					cp_editor.dom().surroundSelection(document.createElement("sub"));
				} else {
					command.getTreeDom().filterTagName('sub').each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_subscript.setAttribute('inactivated','true');
					});
				}
			});

			// p align ------------------------------------------------------------------------
			var blockList = 'div,p,h1,h2,h3,h4,h5,h6,blockquote';
			var edition_right = document.getElementById('edition_right');
			var edition_left = document.getElementById('edition_left');
			var edition_center = document.getElementById('edition_center');
			var edition_justify = document.getElementById('edition_justify');

			var _stateP = function(nameEl){
				['right','left','center','justify'].forEach(function (name) {
					if(name==nameEl || nameEl=='')
						document.getElementById('edition_'+name).setAttribute('inactivated','true');
					else
						document.getElementById('edition_'+name).setAttribute('inactivated','false');
				});
			};

			cp_editor.commands.registerState('p_start',false,blockList,null,{key:'text-align',value:'start'},
			function(){_stateP('');},
			function(){_stateP('all');}
			);

			cp_editor.commands.registerState('p_right',false,blockList,null,{key:'text-align',value:'right'},
			function(){_stateP('');},
			function(){_stateP('right');}
			);

			edition_right.command =  function (ev) {
				cp_editor.commands.exec('p_alignTexte','right');
			};

			cp_editor.commands.registerState('p_left',false,blockList,null,{key:'text-align',value:'left'},
			function(){_stateP('');},
			function(){_stateP('left');}
			);

			edition_left.command =  function (ev) {
				cp_editor.commands.exec('p_alignTexte','left');
			};

			cp_editor.commands.registerState('p_center',false,blockList,null,{key:'text-align',value:'center'},
			function(){_stateP('');},
			function(){_stateP('center');}
			);

			edition_center.command =  function (ev) {
				cp_editor.commands.exec('p_alignTexte','center');
			};

			cp_editor.commands.registerState('p_justify',false,blockList,null,{key:'text-align',value:'justify'},
			function(){_stateP('');},
			function(){_stateP('justify');}
			);

			edition_justify.command =  function (ev) {
				cp_editor.commands.exec('p_alignTexte','justify');
			};

			cp_editor.commands.registerExec('p_alignTexte',function(value,command,doc) {
				command.getTreeDom().filterTagName(blockList).each(function (el) {
					cp_editor.dom(el).css('text-align',value);
				});
			});
			var edition_blockselect = document.getElementById('edition_blockselect');
			edition_blockselect.init({
				bl_p : 'Paragraphe',
				bl_h1 : 'Titre 1',
				bl_h2 : 'Titre 2',
				bl_h3 : 'Titre 3',
				bl_h4 : 'Titre 4',
				bl_h5 : 'Titre 5',
				bl_h6 : 'Titre 6',
				bl_div : 'Division',
				bl_blockquote : 'Citation'
			},UITYPE.paths.bdl+'/edition/images/ap_');

			edition_blockselect.setAttribute('status','bl_p');

			edition_blockselect.addEventListener('change', function (ev) {
				cp_editor.commands.exec('toogle_block',ev.detail.status.substring(3));
			});

			cp_editor.commands.registerState('toogle_block',false,blockList,null,null,
				function(){edition_blockselect.setAttribute('inactivated','true');},
				function(resultState){
					var name = resultState.last().elems[0].nodeName.toLowerCase();
					edition_blockselect.setAttribute('status','bl_'+name);
					edition_blockselect.setAttribute('inactivated','false');
				}
			);

			cp_editor.commands.registerExec('toogle_block',function(value,command,doc) {
				var last = command.getTreeDom().filterTagName(blockList).last();
				var attr = last.attrToString();
				last.toogleTag('<'+value+attr+'>','</'+value+'>');
			});

			// crossref ------------------------------------------------------------------------
			var edition_crossref = document.getElementById('edition_crossref');

			cp_editor.commands.registerState('crossref',true,'*',null,null,
			function(){edition_crossref.setAttribute('inactivated','false');},
			function(){edition_crossref.setAttribute('inactivated','true');}
			);

			cp_editor.notify.sub('document:treeChange',function(data){
				if(data.nodes)
					edition_crossref.setAttribute('inactivated','false');
				else
					edition_crossref.setAttribute('inactivated','true');
				return [data];
			});

			_registerE('crossref',null,edition_crossref,function(value,command,doc) {
				var last = command.getTreeDom().filterTagName('a').filterClassName('crossref-type-page').last();

				if(last.elems[0]==undefined){
					// insertion
					var activeID = cp_editor.composer.getActiveID();
					command.execCommand("InsertHTML", false, '<a class="crossref-type-page" id="__tmp_cross__">→</a>');
					// on retrouve l'élément inséré
					var _activeElement = cp_editor.composer.getComposerElement();
					var crossEl = _activeElement.contentWindow.document.body.querySelector('#__tmp_cross__');
					var scrollT = _activeElement.contentWindow.document.documentElement.scrollTop;
					var scrollL = _activeElement.contentWindow.document.documentElement.scrollLeft;

					// recherche de la cible
					cp_editor.composer.setTarget(function(id,targetID){
						// vérifier que le document existe toujours
						if(cp_editor.composer.isAdd(activeID)){
							// on l'affiche
							cp_editor.composer.show(activeID);
							var c = "#"+id;
							if(activeID!=targetID)
								c = targetID+c;
							if(crossEl){
								crossEl.setAttribute('href',c);
								crossEl.removeAttribute('id');
								_activeElement.contentWindow.scrollTo( scrollL, scrollT );
								cp_editor.composer.setEffect(crossEl);
							}
						}
					});
				} else {
					// suppression
					cp_editor.dom(last.elems[0]).rm();
					edition_crossref.setAttribute('inactivated','true');
				}
			});
			// link ------------------------------------------------------------------------
			var edition_link = document.getElementById('edition_link');

			_registerS('link',true,'a',null,null,edition_link);
			_registerS('link',false,'a',null,null,edition_link);

			_registerE('link',null,edition_link,function(value,command,doc) {
				if(command.rangeState){
					//document.execCommand("CreateLink", false, "http://stackoverflow.com/");
					document.body.insertComponent('beforeend', '<cp:dialog id="dialog_link" width="300px" height="150px" title="'+LANG.link+'" hide="no"><div style="margin-top:10px;height:30px;text-align:center;"><input type="text" id="dialog_link_input" value="http://"/></div></cp:dialog>');

					var dialog_link = document.getElementById("dialog_link");
					dialog_link.command = function (event) {
						var a = cp_editor.dom().surroundSelection(document.createElement("a"));
						a.attr({href:document.getElementById("dialog_link_input").value,target:"_blank"});
						dialog_link.parentNode.removeChild( dialog_link );
					};
				} else {
					command.getTreeDom().filterTagName('a').each(function (el) {
						cp_editor.dom(el).unwarp();
						edition_link.setAttribute('inactivated','true');
					});
				}
			});

			// img ------------------------------------------------------------------------
			var edition_img = document.getElementById('edition_img');
			cp_editor.commands.registerState('img',false,'img',null,null,
			function(){edition_img.setAttribute('inactivated','false');},
			function(){edition_img.setAttribute('inactivated','true');}
			);

			cp_editor.notify.sub('document:treeChange',function(data){
				if(data.nodes)
					edition_img.setAttribute('inactivated','false');
				else
					edition_img.setAttribute('inactivated','true');
				return [data];
			});

			_registerE('img',null,edition_img,function(value,command,doc) {
				$bundles('appli', 'bookImagesfiles', function( dialog ) {
					dialog.init(command,cp_editor,edition_img);
				});
			});

			// footnote ------------------------------------------------------------------------
			var edition_footnote = document.getElementById('edition_footnote');

			cp_editor.commands.registerState('footnote',true,'*',null,null,
			function(){edition_crossref.setAttribute('inactivated','false');},
			function(){edition_crossref.setAttribute('inactivated','true');}
			);

			cp_editor.notify.sub('document:treeChange',function(data){
				if(data.nodes)
					edition_footnote.setAttribute('inactivated','false');
				else
					edition_footnote.setAttribute('inactivated','true');
				return [data];
			});

			_registerE('footnote',null,edition_footnote,function(value,command,doc) {
				var last = command.getTreeDom().filterTagName('a').filterClassName('footnote-mark').last();

				if(last.elems[0]==undefined){
					// insertion
					var activeID = cp_editor.composer.getActiveID();
					var idMark = _id = 'f_'+new Date().getTime();
					command.execCommand("InsertHTML", false, '<a class="footnote-mark" id="'+idMark+'"><sup>x</sup></a>');

					// on retrouve l'élément inséré
					var _activeElement = cp_editor.composer.getComposerElement();
					var crossEl = _activeElement.contentWindow.document.body.querySelector('#'+idMark);
					var scrollT = _activeElement.contentWindow.document.documentElement.scrollTop;
					var scrollL = _activeElement.contentWindow.document.documentElement.scrollLeft;

					// recherche de la cible
					cp_editor.composer.setTarget(function(id,targetID){
						// vérifier que le document existe toujours
						if(cp_editor.composer.isAdd(activeID)){
							// on l'affiche
							cp_editor.composer.show(activeID);

							var note = _activeElement.contentWindow.document.body.querySelector('#'+id);

							note.classList.add('footnote-foot');
							var foot_number = note.querySelector('.footnote-number');
							if(foot_number==undefined)
								note.insertAdjacentHTML('afterbegin','<a class="footnote-number" href="#'+idMark+'">x. </a>');
							else
								foot_number.setAttribute('href','#'+idMark);
							crossEl.setAttribute('href','#'+id);

							// numérotation
							[].forEach.call(_activeElement.contentWindow.document.body.querySelectorAll('.footnote-mark'),function(el,i) {
								var _f = i+1;
								el.innerHTML = '<sup>'+_f+'</sup>';
								var _id = el.getAttribute('href').substring(1);
								var _foot = _activeElement.contentWindow.document.getElementById(_id);
								var _foot_number = _foot.querySelector('.footnote-number');
								if(_foot_number!=undefined)
									_foot_number.innerHTML = _f+'. ';
							});
							_activeElement.contentWindow.scrollTo( scrollL, scrollT );
							cp_editor.composer.setEffect(crossEl);
						}
					});

				} else {
					// suppression
					cp_editor.dom(last.elems[0]).rm();
					edition_crossref.setAttribute('inactivated','true');
				}
			});
		}
	};
	return editionToolbar;
});
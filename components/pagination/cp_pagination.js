/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant pagination
 * namespace : http://www.components.org
 */
define('cp/pagination/cp_pagination',function() {
	(function() {

		var _createElement = function(t,v,currentPage) {
			var c = 'false';
			if(currentPage)
				c = 'true'
			return '<a current="'+c+'" page="'+v+'">'+t+'</a>';
		};

		var cp_pagination = {

			template : '<span anonid="buttons"></span><span class="resume" anonid="resume"></span>',

			methods : {
			    domString : function () {
					return '<cp:pagination' + this.attrToString()+ '></cp:pagination>';
				}
			},

			/*
				page 1 : [1] 2 3 4 > (1/6)
				page 2 : < 1 [2] 3 4 5 > (2/6)
				page 3 : < 1 2 [3] 4 5 6 > (3/6)
				page 4 : < 1 2 3 [4] 5 6 > (4/6)
				page 5 : < 2 3 4 [5] 6 > (5/6)
				page 5 : < 3 4 5 [6] (6/6)
			*/
			attributes : {

				currentpage : {
					set : function (value) {
						// création des pages
						// nombre de pages
						var pages = this.getAttribute('pages');
						value = parseInt(value,10);
						// value doit être : value >0 && value <= pages
						if(value > 0 && value <= pages) {
							// button before
							var content = '';
							for (var i = value-1; i >= value-3; i--)
								if(i>0)
									content = _createElement(i,i,false) + content;

							if(value>1)
								content = _createElement('<',value-1,false) + content;

							content += _createElement(value,value,true);

							for (var i = value+1; i <= value+3; i++)
								if(i<=pages)
									content += _createElement(i,i,false);

							if(value<pages)
								content += _createElement('>',value+1,false);

							this.getAnonid('buttons').innerHTML = content;
						} else if(value == 0 && pages == pages) {
							this.getAnonid('buttons').innerHTML = '';
						}
						this.getAnonid('resume').innerHTML = '['+value+'/'+pages+']';
					}
				}
			},

			events : {
				click : function (event) {
					event.stopPropagation();
					var t = event.target;
					if(t.getAttribute('current')=='false'){
						var page = parseInt(t.getAttribute('page'),10);
						var event = document.createEvent("CustomEvent");
						event.initCustomEvent('pageChange', true, true, {
							page : page
						});
						this.dispatchEvent(event);
					}
				}
			}
		};

		JSElem.register('http://www.components.org','pagination',cp_pagination);

	}());
});
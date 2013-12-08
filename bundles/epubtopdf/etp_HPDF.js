/**
 * @package EpubToPDF
 * @subpackage EpubToPDF (etp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * etp_HPDF
 */
define('bdl/epubtopdf/etp_HPDF',function() {

	var HPDF = {

		pdf : null,

		elems : null,

		elemsName : null,

		numPages : 0,

		page : 1,

		scale : 0.8,

		init : function(elements) {
			HPDF.elems = elements;

			PDFJS.disableWorker = true;

			HPDF.elems.before.command = function (event) {
				HPDF.goBefore();
			};
			HPDF.elems.after.command = function (event) {
				HPDF.goAfter();
			};
			HPDF.elems.zoom_in.command = function (event) {
				HPDF.scale = HPDF.scale + 0.2;
				HPDF.getPage(HPDF.page);
			};
			HPDF.elems.zoom_out.command = function (event) {
				HPDF.scale = HPDF.scale - 0.2;
				HPDF.getPage(HPDF.page);
			};
			HPDF.elems.page.addEventListener('keyup', function(event) {
				if (event.keyCode == 13) {
					var p = this.value * 1;
					if (p > 0 && p <= HPDF.numPages) {
						HPDF.getPage(p);
					}
				} else {
					this.value = this.value.replace(/[a-zA-Z]/, '');
				}
			});
			HPDF.elems.errors.command = function (event) {
				var d = HPDF.elems.errors_block.style.display;
				if(d=='none')
					HPDF.elems.errors_block.style.display = 'block';
				else
					HPDF.elems.errors_block.style.display = 'none';
			};
			HPDF.elemsName = {
				even : HPDF.elems.page_even.id,
				odd : HPDF.elems.page_odd.id,
			};
		},

	 	loadPDF : function(pdfFile) {
			PDFJS.getDocument(pdfFile).then(function(pdf) {
				HPDF.pdf = pdf;
				HPDF.numPages = pdf.numPages;
				HPDF.page = 1;
				HPDF.getPage(1);
				HPDF.elems.numPages.innerHTML = pdf.numPages;
				HPDF.elems.zoom_out.setAttribute('inactivated','false');
				HPDF.elems.zoom_in.setAttribute('inactivated','false');
				HPDF.elems.page.removeAttribute('inactivated');
			});
		},

		setPage : function(p,name,op,nameOp) {
			HPDF.pdf.getPage(p).then(function(page) {
				var viewport = page.getViewport(HPDF.scale);
				var canvas = document.getElementById(name);
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;
				canvas.style.visibility = "visible";

				if(op=='clear'){
					var canvasOp = document.getElementById(nameOp);
					var contextOp = canvasOp.getContext('2d');
					canvasOp.height = viewport.height;
					canvasOp.width = viewport.width;
					canvasOp.style.visibility = "hidden";
					if(nameOp==HPDF.elemsName.even)
						HPDF.elems.page_odd.style.left = canvasOp.width + 'px';
				}
				if(name==HPDF.elemsName.even)
						HPDF.elems.page_odd.style.left = canvas.width + 'px';
				HPDF.elems.viewer.style.width = ((canvas.width*2)+2)+'px';
				HPDF.elems.viewer.style.height = (canvas.height+2)+'px';
				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				page.render(renderContext);
			});
		},

		even : function (p) {
			return ((p)%2) ? false : true;
		},

		getPage : function(p) {
			var even = HPDF.even(p);
			var pageOdd,pageEven;
			if(even) {
				pageEven = p;
				if(p==HPDF.numPages) {
					pageOdd = 'clear';
				} else
					pageOdd = p+1;
			} else {
				pageOdd = p;
				if (p==1)
					pageEven = 'clear';
				else
					pageEven = p-1;
			}
			HPDF.elems.before.setAttribute('inactivated','false');
			HPDF.elems.after.setAttribute('inactivated','false');

			if(p==1)
				HPDF.elems.before.setAttribute('inactivated','true');
			if(p==HPDF.numPages)
				HPDF.elems.after.setAttribute('inactivated','true');

			if(pageOdd!='clear')
				HPDF.setPage(pageOdd,HPDF.elemsName.odd,pageEven,HPDF.elemsName.even);

			if(pageEven!='clear')
				HPDF.setPage(pageEven,HPDF.elemsName.even,pageOdd,HPDF.elemsName.odd);

			HPDF.elems.page.value = p;
			HPDF.page = p;
		},

		goBefore : function () {
			if(HPDF.page!=1){
				if(HPDF.even(HPDF.page))
					HPDF.getPage(HPDF.page-1)
				else
					HPDF.getPage(HPDF.page-2)
			}
		},

		goAfter : function () {
			if(HPDF.page!=HPDF.numPages){
				if(!HPDF.even(HPDF.page))
					HPDF.getPage(HPDF.page+1)
				else if((HPDF.page+2)<=HPDF.numPages)
					HPDF.getPage(HPDF.page+2)
			}
		},

		writeErrors : function (errors) {
			HPDF.elems.errors_block.innerHTML = '';
			errors.forEach(function(error){
				HPDF.elems.errors_block.insertAdjacentHTML('beforeend', error+"\n");
			});
			HPDF.elems.errors.setAttribute('inactivated','false');
		},

		clear : function (errors) {
			HPDF.elems.zoom_out.setAttribute('inactivated','true');
			HPDF.elems.zoom_in.setAttribute('inactivated','true');
			HPDF.elems.before.setAttribute('inactivated','true');
			HPDF.elems.after.setAttribute('inactivated','true');
			HPDF.elems.errors.setAttribute('inactivated','true');
			HPDF.elems.errors_block.style.display = 'none';
			HPDF.elems.page.setAttribute('disabled','disabled');
			HPDF.elems.page.value = '';
			HPDF.elems.numPages.innerHTML = '';
		}
	};

	return HPDF;
});

(function() {

var classDefinition = {
	suffix : '_hk',
	geometry : 'geometry',
	page : 'page',
	header : 'header',
	body : 'body',
	regions : 'regions',
	footnotes : 'footnotes',
	footer : 'footer',
	flexfoot : 'flexfoot'
};

for(var k in classDefinition){
	if(k!='suffix') {
		classDefinition[k+'C'] = '.'+classDefinition[k]+classDefinition.suffix;
		classDefinition[k+'ID'] = classDefinition[k]+classDefinition.suffix;
	}
}

// moteur de template
var TPL = {
	render : function (template, data) {
		return template.replace(/\{\{\$([\w\.]*)\}\}/g, function (str, key) {
			var keys = key.split("."), value = data[keys.shift()];
			keys.forEach( function (val) {value = value[val]; });
				return (value === null || value === undefined) ? "" : value;
		});
	}
};

var insertCSS = function (content) {
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = content;
	document.head.appendChild(css);
};

/*  -------------------------------------------------------------
					hiboukJS
*/
var hiboukJS = {

	zones : {},

	errors : [],

	crossRefs : {},

	zoneNumberPage : {},

	tpls : {},

	load :  function(data){
		var _this = this;
		for(var key in data)
			this[key] = data[key];

		document.body.insertAdjacentHTML('beforeend','<iframe id="iframe" src="'+this.tplURL+'"></iframe>');
		var iframe = document.getElementById('iframe');

		iframe.onload = function(){
			var head = this.contentWindow.document.head;
			[].forEach.call(this.contentWindow.document.querySelectorAll('script'),function(el, i){
				_this.tpls[el.id] = el.innerHTML;
			});
			iframe.parentNode.removeChild( iframe );
			Hyphenator.config({
				defaultlanguage: _this.lang,
				displaytogglebox : false,
				'onhyphenationdonecallback': function () {
					[].forEach.call(document.querySelectorAll('.hyphenate'),function(el, i){
						el.classList.remove('hyphenate');
					});
					hiboukJS.prepareText();
				}
			});

			[].forEach.call(document.querySelectorAll('p'),function(el, i){
				var pr = window.getComputedStyle(el, null).getPropertyValue('text-align');
				if(pr=='justify')
					el.classList.add('hyphenate');
				else {
					[].forEach.call(el.querySelectorAll(_this.book.footnoteSelector),function(footnote, i){
						footnote.classList.add('hyphenate');
					});
				}
			});
			Hyphenator.run();
		};
	},

	prepareText : function(){
		var _this = this;
		var zones = [];

		// on habille les pages ce n'est pas une sortie pdf
		if(typeof HiboukPDF=='undefined')
			insertCSS(classDefinition.pageC+' { outline:1px solid gray;margin:25px;box-shadow: -1mm 1mm 2mm #aaa;}');

		// action final
		var finish = function(zonesLength,width,height) {
			return function(){
				zonesLength--;
				if(zonesLength==0){
					var pages = document.querySelectorAll(".page_hk").length;
					if(typeof HiboukPDF=='undefined') {
						console.log(hiboukJS.errors);
						console.log(hiboukJS.crossRefs);
						console.log(width,height);
						console.log(pages);
					} else {
						HiboukPDF.saveFile(JSON.stringify(hiboukJS.errors),'errors.json');
						HiboukPDF.saveFile(JSON.stringify(hiboukJS.crossRefs),'crossRefs.json');
						HiboukPDF.saveFile(JSON.stringify({pages : pages}),'pages.json');
						HiboukPDF.toPDF(width,height,FILEOUT);
					}
				}
			}
		};
		var _zonesElements = document.querySelectorAll(zoneSelector);
		this.finish = finish(_zonesElements.length,this.book.pageWidth,this.book.pageHeight);

		// div geometry
		document.body.insertAdjacentHTML('beforeend','<div id="'+classDefinition.geometryID+'"></div>');
		var geometry = document.getElementById(classDefinition.geometryID);

		// function (closure) de démarage de la zone
		// quand les embeds sont chargés
		var startZone = function(flowElement) {
			return function() {
				var _this = this;
				var embeds = flowElement.querySelectorAll('embed');

				if(embeds.length==0){
					hiboukJS.pagination(_this.definition,_this.footnotes);
				} else {
					var __load = function(embedsLength){
						return function(){
							embedsLength--;
							if(embedsLength==0)
								hiboukJS.pagination(_this.definition,_this.footnotes);
						};
					};

					var go = __load(embeds.length);
					[].forEach.call(embeds,function(el){
						el.addEventListener("load",function(){
							go();
						},false);
					});
				}
			}
		};
		/*
		title-page, table of contents, index, glossary, acknowledgements,
		bibliography, colophon, copyright-page, dedication, epigraph, foreword,
		list of illustrations, list of tables, notes, preface
		 */
		[].forEach.call(_zonesElements,function(_zone, i){
			_this.zones[i] = {};
			var zoneID = _zone.getAttribute('title');
			var flowName = 'content-'+i;
			var regionID = 'region'+i;
			var Z;

			// definition de la zone
			if(typeof _this.zonesDefintion[zoneID] == 'undefined')
				Z = JSON.parse(JSON.stringify(_this.zonesDefintion['default']));
			else
				Z = _this.zonesDefintion[zoneID];

			Z.number = i;
			Z.unit = _this.book.unit;
			Z.pageWidth = _this.book.pageWidth;
			Z.pageHeight = _this.book.pageHeight;
			Z.footnoteSelector = _this.book.footnoteSelector;
			Z.footnoteHeaderSelector = _this.book.footnoteHeaderSelector;// .footnote-header
			Z.footnoteNumberSelector = _this.book.footnoteNumberSelector;// .footnote-number
			Z.bookTitle = _this.bookTitle;
			Z.regionID = regionID;

			// marge supplémentaire pour les footnotes
			document.body.insertAdjacentHTML('beforeend','<div id="___tmpFoot___" class="'+classDefinition.footnotesID+'" style="width:100mm;"></div>');
			var tmpFoot = document.getElementById('___tmpFoot___');

			var pixelMM = tmpFoot.offsetWidth/100;

			tmpFoot.innerHTML = Z.footnoteTplHearder;
			var headerHeight = tmpFoot.offsetHeight;
			tmpFoot.innerHTML = '<p class="'+Z.footnoteFoot+'">blablablaba</p>';
			var lineHeight = tmpFoot.offsetHeight;
			Z.lineHeight = lineHeight;
			tmpFoot.parentNode.removeChild( tmpFoot );

			var flexfootHeight = headerHeight+lineHeight;
			Z.flexfootHeight = flexfootHeight;

			Z.bodyHeight = Z.bodyHeight-(flexfootHeight/pixelMM);

			// CSS du flow
			insertCSS(TPL.render(_this.tpls.tplZoneCSS,Z));

			document.body.insertAdjacentHTML('beforeend', '<div class="'+flowName+'" id="'+flowName+'">'+_zone.innerHTML+'</div>');
			geometry.insertAdjacentHTML('beforeend','<div id="'+regionID+'"></div>');

			_zone.parentNode.removeChild( _zone );
			var flowElement = document.getElementById(flowName);

			// footnotes
			var footnotes = {};

			var footHeader = flowElement.querySelector(Z.footnoteHeaderSelector);
			if(footHeader!=undefined)
				footHeader.parentNode.removeChild( footHeader );
			[].forEach.call(flowElement.querySelectorAll(Z.footnoteSelector),function(el, i){
				var id = regionID+'_foot_'+i;

				var target = el.href.substring(el.href.lastIndexOf("#")+1);
				var content = flowElement.querySelector('#'+target);

				footnotes[id] = content.innerHTML;
				content.parentNode.removeChild( content )

				el.insertAdjacentHTML('afterend','<span id="'+id+'" class="'+Z.footnoteMark+'">5</span>');
				el.parentNode.removeChild( el );
			});
			// Crossref page préparation
			[].forEach.call(flowElement.querySelectorAll(_this.crossRefsDefinition.typeSelectorPrefix+'page'),function(el, i){
				el.innerHTML = '??';
			});

			Z.flowName = flowName+'-flow';
			Z.region = document.getElementById(regionID);
			Z.flowElement = flowElement;

			_this.zones[i] = {
				definition : Z,
				footnotes : footnotes,
				startZone : startZone(flowElement),
				start : function(){
					var _this = this;
					var execute = true;
					var zoneNumber = this.definition.number;
					if(zoneNumber>0 && typeof hiboukJS.zoneNumberPage[zoneNumber-1] == 'undefined')
						execute = false;
					if(execute) {
						if(this.definition.pageCounterReset || zoneNumber==0)
							this.definition.pageStart = 0;
						else
							this.definition.pageStart = hiboukJS.zoneNumberPage[i-1];
						this.startZone();
					} else {
						setTimeout(function(){
							_this.start();
						}, 100);
					}
				}
			};
			_this.zones[i].start();
		});
	},

	pagination : function(definition,footnotes){
		var p = paginator(definition,footnotes,this.crossRefsDefinition,this.tpls.tplZoneFootCSS);
		p.start().crossRef(false).footnotes().crossRef(true).clear().designPages();
	}
};

window.hiboukJS = hiboukJS;

/*  -------------------------------------------------------------
					pageDefinition
*/

var pageDefinition = {
	page : {
		methods : {
			design : function(){
				var obj = {
					page : this.pageNumber,
					bookTitle : this.parentNode.tpls.bookTitle,
					chapterTitle : this.parentNode.tpls.chapterTitle
				};

				var designHead = true;
				var designFoot = true;
				if(this.book) {
					designHead = this.book.head;
					designFoot = this.book.foot;
				}
				var footer = this.querySelector(classDefinition.footerC);
				if(designFoot) {
					var tplFooter = this.parentNode.tpls.footer[this.position];
					footer.innerHTML = TPL.render(tplFooter,obj);
				} else {
					footer.innerHTML = '<p></p>';
				}

				if(designHead) {
					var head = this.querySelector(classDefinition.headerC);
					var tplHeader = this.parentNode.tpls.header[this.position];
					head.innerHTML = TPL.render(tplHeader,obj);
				}
			}
		},
		/*
		attributes : {
			'data-page' : {
				set :function(value){
				}
			}
		}*/
	}
};

/*  -------------------------------------------------------------
					paginator
*/

var paginator = function (definition,footnotes,crossRefsDefinition,tplZoneFootCSS) {
	return new paginator.prototype.init(definition,footnotes,crossRefsDefinition,tplZoneFootCSS);
};

paginator.fn = paginator.prototype = {

	getCounterContent : function(el){
		var content = '';
		if(el!=undefined) {
			var contentCounter = window.getComputedStyle(el, ':before').getPropertyValue("content");
			if(contentCounter!='' && contentCounter.substr(0,1)=="'")
				contentCounter = contentCounter.substr(1,contentCounter.length-2);
			content = contentCounter;
		}
		return content;
	},

	getElementContent : function(selector){
		var content = '';
		var contentEl = this.d.flowElement.querySelector(selector);
		if(contentEl!=undefined) {
			var contentCounter = this.getCounterContent(contentEl);
			content = contentCounter+contentEl.innerHTML;
		}
		return content;
	},

	init : function (defintions,footnotes,crossRefsDefinition,tplZoneFootCSS) {
		this.d = defintions;
		this.tplZoneFootCSS = tplZoneFootCSS;
		this.footnotesContent = footnotes;
		this.crossRefsDefinition = crossRefsDefinition;
		this.flow = document.webkitGetNamedFlows()[this.d.flowName];
		this.pages = 0;

		// title chapter
		var chapterTitle = this.getElementContent(this.d.chapterTitleSelector);
		this.d.region.tpls = {
			bookTitle : defintions.bookTitle,
			chapterTitle : chapterTitle,
			header : {
				even : this.d.tplHeaderEven,
				odd : this.d.tplHeaderOdd
			},
			footer : {
				even : this.d.tplFooterEven,
				odd : this.d.tplFooterOdd
			}
		};
		return this;
	},

	start : function(){
		this.addpage(0);
		return this;
	},

	crossAssign : function(type,setError) {
		this.updateEmptyPage();
		var _this = this;
		[].forEach.call(this.d.flowElement.querySelectorAll(this.crossRefsDefinition.typeSelectorPrefix+type),function(el){
			var id = el.hash.substring(1);
			if(hiboukJS.crossRefs[id]!=undefined) {
				el.innerHTML = hiboukJS.crossRefs[id];
			} else {
				if(setError)
					_this.setError('Error crossref id:'+id+' ; page:'+(_this.d.pageStart+_this.getPage(el).page));
			}
		});
		this.updateEmptyPage();
	},

	crossRef : function(setError) {
		var _this = this;
		for(var key in this.crossRefsDefinition) {
			switch(key) {
				case 'page':
					var selector = this.crossRefsDefinition.page.join(', ');
					[].forEach.call(this.d.flowElement.querySelectorAll(selector),function(el){
						if(el.id)
							hiboukJS.crossRefs[el.id] = TPL.render(_this.crossRefsDefinition.pageTpl,{page:_this.getPage(el).pageNumber});
					});
					this.crossAssign(key,setError);
				break;
			}
		}
		return this;
	},

	updateEmptyPage : function() {
		if(!this.hasEmptyPage())
			this.addpage(this.d.region.lastElementChild.page);
	},

	clear : function() {
		this.updateEmptyPage();
		var lastPage = this.d.region.lastElementChild;
		var even = lastPage.position;

		if( (this.d.lastPageEven && even=='odd') || !this.d.lastPageEven )
			lastPage.parentNode.removeChild( lastPage );

		return this;
	},

	footnotes : function(){
		var _this = this;
		var body = null, footer = null, region = null, oldFlow = true;
		var counterFlowFoot = 0, pageOld = 0, counterMark = 1;

		var footnoteWidth = 'width:'+this.d.bodyWidth+this.d.unit+';';

		var tmpFootID = 'tmpFoot_'+new Date().getTime();
		document.body.insertAdjacentHTML('beforeend','<div id="'+tmpFootID+'" style="'+footnoteWidth+'" class="'+classDefinition.footnotesID+'"></div>');
		var tmpFoot = document.getElementById(tmpFootID);

		var insertFoot = function(_footer,_note,_headNote,_height){
			var h = _footer.offsetHeight;
			_footer.style.height = (h+_height)+'px';
			if(_headNote!='')
				_footer.insertAdjacentHTML('beforeend',_headNote);
			_footer.insertAdjacentHTML('beforeend',_note);
		};

		[].forEach.call(this.d.flowElement.querySelectorAll('.'+this.d.footnoteMark),function(el, i){
			var thePage = _this.getPage(el);
			var page = thePage.page;
			var headerTpl = '';
			var headerTplHeight = 0;
			var id = 'foot_f'+i;

			if(page!=pageOld) {
				oldFlow = true;
				counterMark = 1;
				footer = thePage.querySelector(classDefinition.footnotesC);
				body = thePage.querySelector(classDefinition.bodyC);
				region = thePage.querySelector(classDefinition.regionsC);
				if(footer.innerHTML=='') {
					headerTpl = _this.d.footnoteTplHearder;
					headerTplHeight = _this.d.headerHeight;
				}
			} else {
				counterMark++;
			}
			el.innerHTML = counterMark;

			// la note
			var footnoteRender = TPL.render(_this.d.footnoteTplNumber,{number:counterMark});

			var _nID = el.id+'_f';
			var note = '<div id="'+_nID+'" class="'+_this.d.footnoteFoot+'">'+_this.footnotesContent[el.id]+'</div>';
			tmpFoot.innerHTML = note;
			tmpFoot.querySelector(_this.d.footnoteNumberSelector).innerHTML = footnoteRender;
			var noteHeight = tmpFoot.offsetHeight;
			var lines = Math.ceil(noteHeight/_this.d.lineHeight);
			noteHeight = noteHeight+headerTplHeight;

			var regionHeight = region.offsetHeight;

			region.style.height = (regionHeight-noteHeight)+'px';
			var inPage = false;
			if(!_this.samePage(el,page)) {
				var nbLine = 0;
				var headerTplFlow = _this.d.footnoteTplHearder;
				var creatNote = true;
				if(oldFlow) {
					oldFlow = false;
					for (var i = 1; i < lines; i++) {
						if(!inPage){
							var _regionHeight = region.offsetHeight;
							noteHeight = noteHeight-_this.d.lineHeight;
							region.style.height = (_regionHeight+_this.d.lineHeight)+'px';
							nbLine++;

							if(_this.samePage(el,page))
								inPage = true;
						}
					}
				} else {
					creatNote = false;
				}
				if(creatNote){
					counterFlowFoot++;
					var divContent = '<div class="content-foot-'+counterFlowFoot+'">'+note+'</div>';
					var nextPage = thePage.nextSibling;
					var nextFooter = nextPage.querySelector(classDefinition.footnotesC);
					var nextRegion = nextPage.querySelector(classDefinition.regionsC);
					// retirer flexfoot
					if(!inPage){
						var flexfoot = thePage.querySelector(classDefinition.flexfootC);
						flexfoot.parentNode.removeChild( flexfoot );
						region.style.height = regionHeight+'px';
					}

					// note coulant sur l'autre page
					var heightFlow = nbLine*_this.d.lineHeight;

					var divflow = '<div class="footnote-foot-'+counterFlowFoot+'" style="height:'+heightFlow+'px;"></div>';
					insertFoot(nextFooter,divflow,headerTplFlow,heightFlow+_this.d.headerHeight);

					var nextRegionHeight = nextRegion.offsetHeight;
					nextRegion.style.height = (nextRegionHeight-(heightFlow+_this.d.headerHeight))+'px';

					// création de css
					var obj = {
						unit : _this.d.unit,
						bodyWidth : _this.d.bodyWidth,
						foot_number : counterFlowFoot
					};
					insertCSS(TPL.render(_this.tplZoneFootCSS,obj));

					// insertion de la note
					divflow = '<div class="footnote-foot-'+counterFlowFoot+'" style="height:'+((lines-nbLine)*_this.d.lineHeight)+'px;"></div>';
					_this.d.flowElement.insertAdjacentHTML('afterend',divContent);
					insertFoot(footer,divflow,headerTpl,noteHeight);
				} else {
					el.style.color = 'red';
					region.style.height = regionHeight+'px';
					_this.setError('Error footnote note:'+counterMark+' ; page:'+(_this.d.pageStart+_this.getPage(el).page));
				}
			} else {
				insertFoot(footer,note,headerTpl,noteHeight);
			}
			pageOld = page;
			_this.updateEmptyPage();
		});
		tmpFoot.parentNode.removeChild( tmpFoot );
		return this;
	},

	// erreurs
	setError : function(error){
		hiboukJS.errors.push(error);
	},

	getRegion : function(element){
		return this.flow.getRegionsByContent(element)[0];
	},

	getPage : function(element){
		return this.getRegion(element).parentNode.parentNode;
	},

	getNumberPage : function(element){
		return this.getPage(element).page;
	},

	samePage : function(element,page){
		var newPage = this.getNumberPage(element);
		if(newPage==page)
			return true;
		else
			return false;
	},

	designPages : function() {
		var _this = this;
		var pages = this.d.region.querySelectorAll(classDefinition.pageC);
		var pageLength = pages.length;

		hiboukJS.zoneNumberPage[this.d.number] = pageLength;
		[].forEach.call(pages,function(el,i){
			var number = el.page;
			if(_this.d.pages[number]!=undefined)
				el.book = _this.d.pages[number];

			var last = 'last-'+((pageLength-1)-i);

			if(_this.d.pages[last]!=undefined)
				el.book = _this.d.pages[last];
			el.design();
		});
		hiboukJS.finish();
	},

	creatPage : function(number){

		var creatElement = function(name){
			var el = document.createElement("div");
			el.setAttribute('class',name+classDefinition.suffix);
			/*
			var elSetAttribute = el.setAttribute;
			el.setAttribute = function() {
				var attrs = pageDefinition[name].attributes;
				if (attrs) {
					var attr = attrs[arguments[0]];
					if (attr && attr.set)
						attr.set.apply(this, [arguments[1]]);
				}
				elSetAttribute.apply(this, arguments);
			};
			*/
			if(pageDefinition[name] && pageDefinition[name].methods) {
				for (var a in pageDefinition[name].methods)
					el[a] = pageDefinition[name].methods[a];
			}
			return el;
		};

		var page = creatElement('page');
		page.page = number;
		var even = ((number)%2) ?'odd' : 'even';
		page.position = even;

		// numéro de page
		var pageNumber = this.d.pageStart + number;
		switch(this.d.counterType) {
			case 'LatinUpper':
				page.pageNumber = this.latinize(pageNumber,'upper');
			break;
			case 'LatinLower':
				page.pageNumber = this.latinize(pageNumber,'lower');
			break;
			case 'romanUpper':
				page.pageNumber = this.romanize(pageNumber,'upper');
			break;
			case 'romanLower':
				page.pageNumber = this.romanize(pageNumber,'lower');
			break;
			default:
				page.pageNumber = pageNumber;
			break;
		}

		// header
		var header = creatElement('header');
		page.appendChild(header);

		// body
		var body = creatElement('body');
		// body -> regions
		var regions = creatElement('regions');
		body.appendChild(regions);
		// body -> footnotes
		var footnotes = creatElement('footnotes');
		body.appendChild(footnotes);

		// body -> flexfoot
		var flexfoot = creatElement('flexfoot');
		body.appendChild(flexfoot);

		page.appendChild(body);

		// footer
		var footer = creatElement('footer');

		page.appendChild(footer);

		return page;
	},

	addpage : function(number){
		number++;
		var newPage = this.creatPage(number);
		this.d.region.appendChild(newPage);

		if(!this.hasEmptyPage())
			this.addpage(number);
	},

	hasEmptyPage : function(flow) {
		if(this.flow.firstEmptyRegionIndex==-1)
			return false;
		else
			return true;
	},

	romanize : function(num,Case) {
		var digits = String(+num).split(""),
			key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"],
			roman = "",
			val = null,
			i = 3;
		while (i--)
			roman = (key[+digits.pop() + (i * 10)] || "") + roman;

		val = Array(+digits.join("") + 1).join("M") + roman;

		if(Case=='lower')
			return val.toLowerCase();
		else
			return val;
	},

	latinize : function(num,Case) {
		var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			val = '';

		if(alpha[num-1]!==undefined)
			val =  alpha[num-1];

		if(Case=='lower')
			return val.toLowerCase();
		else
			return val;
	},

	// insertion de petits points
	// <div><span class="title">Titre long</span><span class="dots"></span><span class="page">15</span>
	// fx.dotsLine('.dots','.page');
	dotsLine : function(eDots,ePage,input){
		if(input===undefined)
			input = '.';
		$(eDots).each(function(){
			var x = 0,
				pageLeft = $($(this).parent()).find(ePage).offset().left,
				left = $(this).offset().left,
				width = $(this).outerWidth();
			while(width+left<pageLeft){
					$(this).html(new Array(x).join(input));
					width = $(this).outerWidth();
					x++;
			}
			$(this).html(new Array(x-3).join(input));
		});
	}
};

paginator.fn.init.prototype = paginator.fn;
}());
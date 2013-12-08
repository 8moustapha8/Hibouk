/**
 * @package  Component
 * @subpackage component (cp_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Composant opf - part metadata
 * namespace : http://www.idpf.org/2007/opf
 */
define('cp/opf/metadata/ap_metadata',function() {
	(function() {
		$req('i18n!cp/opf/locale/cp_metadata.json!default:en-EN', function(__lang) {
			_lang = __lang;
		});

		var _lang = null;

		var _notifySave = null;

		var _epubController = null;

		var _epubVersion = 2;

		var opf_metadata = {

			methods : {
				domString : function () {
					return this.innerComponent;
				},

				init : function ( epubController ) {
					var _this = this;
					_epubController = epubController;
					_epubController.register('metadata',_this);
					_epubVersion = _epubController.getEpubVersion();

					_notifySave = $notify.sub(_epubController.getTargetSave(), function(obj){
							obj.msg('Metadata');
							obj.metadata = _this.domString();
						return [obj];
					});
				},

				close : function () {
					$notify.unSub(_notifySave[0],_notifySave);
				},

				getMetaData : function ( name ) {
					var r = [];
					[].forEach.call(this.querySelectorAll('dc\\:'+name), function (el) {
						r.push(el.getMetaData());
					});
					return r;
				}
			}
		};

		JSElem.register('http://www.idpf.org/2007/opf','metadata',opf_metadata);

		/* Dublin Core */

		/* ------------------------------------------------------------------- */
		var dc_inputtext = {

			name : function ( el ) {
				var name = el.nodeName.split(':');
				return name[1].toLowerCase();
			},

			template : '<span class="dc_key" anonid="key"></span><input type="text" class="dc_inputText" anonid="inputText"></input><span style="display:none;"><content/></span>',

			methods : {
				domString : function () {
					var name = dc_inputtext.name(this);
					return '\t\t<dc:'+ name + this.attrToString()+ '>'+this.getAnonid('inputText').value+'</dc:'+ name +'>';
				},

				domInsert : function () {
					var c = this.getAnonid('content');
					this.getAnonid('inputText').value = c.innerHTML;
					c.parentNode.parentNode.removeChild(c.parentNode);
					var name = dc_inputtext.name(this);
					this.getAnonid('key').innerHTML = name[0].toUpperCase() + name.slice(1);
					// initialisation
					if(this.init!=undefined)
						this.init();
				},

				getMetaData : function ( name ) {
					var r = {
						val : this.getAnonid('inputText').value,
						attributes : {}
					};
					[].forEach.call(this.attributes, function(attr) {
						var attrName = attr.nodeName.toLowerCase();
						var str = attr.value;
						if(attr.value!='') {
							r.attributes[attrName] = String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
						}
					});
					return r;
				}
			},

		};

		JSElem.register('http://purl.org/dc/elements/1.1/','inputtext',dc_inputtext);

		/* ------------------------------------------------------------------- */
		// composant dublin core : title
		var dc_title = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.title);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','title',dc_title);

		/* ------------------------------------------------------------------- */
		// composant dublin core : creator
		var dc_creator = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.creator);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','creator',dc_creator);

		/* ------------------------------------------------------------------- */
		// composant dublin core : subject
		var dc_subject = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.subject);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','subject',dc_subject);

		/* ------------------------------------------------------------------- */
		// composant dublin core : description
		var dc_description = {
			template : '<span class="dc_key" anonid="key"></span><textarea type="text" class="dc_inputTextarea" anonid="inputText"></textarea><span style="display:none;"><content/></span>',
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.description);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','description',dc_description);

		/* ------------------------------------------------------------------- */
		// composant dublin core : publisher
		var dc_publisher = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.publisher);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','publisher',dc_publisher);

		/* ------------------------------------------------------------------- */
		// composant dublin core : date
		var dc_date = {

			template : '<span class="dc_key" anonid="key">Date</span><input type="text" class="dc_date_year" anonid="year"></input>-<input type="text" class="dc_date_md" anonid="month"></input>-<input type="text" class="dc_date_md" anonid="day"></input><span style="display:none;"><content/></span>',

			methods : {
				domString : function () {
					var name = dc_inputtext.name(this);
					return '\t\t<dc:date'+this.attrToString()+ '>'+this.getAnonid('year').value+'-'+this.getAnonid('month').value+'-'+this.getAnonid('day').value+'</dc:date>';
				},

				domInsert : function () {
					var c = this.getAnonid('content');
					var d = c.innerHTML.match(/(\d{4})-(\d{2})-(\d{2})/);
					if(d!==null) {
						this.getAnonid('day').value = d[3];
						this.getAnonid('month').value = d[2];
						this.getAnonid('year').value = d[1];
					} else {
						this.getAnonid('day').value = '01';
						this.getAnonid('month').value = '01';
						this.getAnonid('year').value = '1970';
					}
					c.parentNode.parentNode.removeChild(c.parentNode);
				},

				getMetaData : function ( name ) {
					var r = {
						val : this.getAnonid('inputText').value,
						attributes : {}
					};
					[].forEach.call(this.attributes, function(attr) {
						var attrName = attr.nodeName.toLowerCase();
						var str = attr.value;
						if(attr.value!='') {
							r.attributes[attrName] = String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
						}
					});
					return r;
				}
			}
		};
		JSElem.register('http://purl.org/dc/elements/1.1/','date',dc_date);

		/* ------------------------------------------------------------------- */
		// composant dublin core : type
		var dc_type = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('disabled', "disabled");
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','type',dc_type);

		/* ------------------------------------------------------------------- */
		// composant dublin core : format
		var dc_format = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('disabled', "disabled");
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','format',dc_format);

		/* ------------------------------------------------------------------- */
		// composant dublin core : language
		var dc_language = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.language);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','language',dc_language);

		/* ------------------------------------------------------------------- */
		// composant dublin core : rights
		var dc_rights = {
			methods : {
				init : function () {
					this.getAnonid('inputText').setAttribute('placeholder', _lang.rights);
				}
			}
		};
		JSElem.extend('http://purl.org/dc/elements/1.1/','inputtext','http://purl.org/dc/elements/1.1/','rights',dc_rights);

		/* ------------------------------------------------------------------- */
		// composant dublin core : identifier
		var dc_identifier = {

			template : '<span class="dc_key" anonid="key"></span><input type="text" class="dc_inputText" anonid="inputText"></input><select anonid="dc_identifier_opf_sheme"><option value="URN">URN</option><option value="ISBN">ISBN</option><option value="EAN">EAN</option><option value="URI">URI</option></select><input type="button" class="dc_id_button" value="+" anonid="add"></input><input type="button" class="dc_id_button" value="-" anonid="del"></input><span style="display:none;"><content/></span>',

			methods : {
				domString : function () {
					return '\t\t<dc:identifier'+ this.attrToString()+ '>'+this.getAnonid('inputText').value+'</dc:identifier>';
				},

				domInsert : function () {
					var _this = this;
					var c = this.getAnonid('content');
					var inputText = this.getAnonid('inputText')
					inputText.value = c.innerHTML;
					c.parentNode.parentNode.removeChild(c.parentNode);
					var name = dc_inputtext.name(this);
					this.getAnonid('key').innerHTML = 'Identifier';
					inputText.setAttribute('placeholder', _lang.identifier);
					if(this.getAttribute('id')==undefined) {
						_this.getAnonid('del').addEventListener('click', function(){
							_this.parentNode.removeChild( _this );
						}, false);
					}
					_this.getAnonid('add').addEventListener('click', function(){
						_this.insertComponent('afterend','<dc:identifier opf:scheme="ISBN"></dc:identifier>');
					}, false);
				},

				getMetaData : function ( name ) {
					var r = {
						val : this.getAnonid('inputText').value,
						attributes : {}
					};
					[].forEach.call(this.attributes, function(attr) {
						var attrName = attr.nodeName.toLowerCase();
						var str = attr.value;
						if(attr.value!='') {
							r.attributes[attrName] = String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
						}
					});
					return r;
				}
			},

			attributes : {

				'opf:scheme' : {
					get : function () {
						var s = this.getAnonid('dc_identifier_opf_sheme');
						return s.options[s.selectedIndex].value;
					},

					set : function (value) {
						[].forEach.call(this.getAnonid('dc_identifier_opf_sheme').querySelectorAll('option'), function (element) {
							if(element.getAttribute('value')==value.toUpperCase())
								element.setAttribute('selected','selected');
							else
								element.removeAttribute('selected');
						});
					}
				},

				'id' : {
					set : function (value) {
						var del = this.getAnonid('del');
						del.parentNode.removeChild(del);
					}
				}
			}
		};
		JSElem.register('http://purl.org/dc/elements/1.1/','identifier',dc_identifier);
	}());
});
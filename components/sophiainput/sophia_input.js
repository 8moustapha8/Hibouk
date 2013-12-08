// composant sophia_input
define('cp/sophiainput/sophia_input',function() {
	(function() {

		var sophia_input = {

			template : '&#160;<input class="sophia_input" anonid="input"></input>&#160;',

			methods : {
			    domString : function () {
					return '<sophia:input' + this.attrToString()+ '></sophia:input>';
				}
			},

			attributes : {

				value : {
					get : function () {
						return this.getAnonid('input').value;
					},
					set : function (value) {
						this.getAnonid('input').value = value;
					}
				},
				type : {
					get : function () {
						return this.getAnonid('input').type;
					},
					set : function (value) {
						var x = this.getAnonid('input');
						x.type = value;
					}
				}
			}
		};

		JSElem.register('http://www.sophia.com','input',sophia_input);

	}());
});
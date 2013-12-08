/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

/**
 * Ajax
 */
define('js/lib/g_ajax',function() {

	// mise en forme de la requête
	var queryString = function ( mode, data ) {
		var result = [];
		for (var key in data) {
			result.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		var txt = result.join( "&" ).replace( /%20/g, "+" );

		if(mode=='GET') {
			if(txt=='')
				return null;
			else
				return '?' + txt;
		} else {
			return txt;
		}
	};

	// object litéral ajax
	var ajax = {

		// function ajax primaire
		ajax : function ( properties ) {

			var responseType
			var stateChange = function () {
				if (this.readyState==4) {
					if(this.status==200) {
						if(properties.success!=undefined) {
							if(this.getResponseHeader("Content-Type")=='text/xml')
								properties.success(this.responseXML);
							else
								properties.success(this.responseText);
						}
					} else {
						if(properties.error!=undefined)
							properties.error(this.responseText);
					}
				}
			};

			var request = new XMLHttpRequest();

			if(properties.responseType!=undefined) // "arraybuffer", "blob", "document", "json", and "text"
				request.responseType = properties.responseType;

			if (request) {
				request.onreadystatechange = stateChange;
				if (properties.methode=='GET') {
					request.open("GET", queryString('GET', properties.url), true);
					request.send(null);
				} else {
					request.open("POST", properties.url , true);
					request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
					request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					request.setRequestHeader('Connection', 'close');
					request.send(queryString('POST',properties.data));
				}
			}
		},

		getXML : function ( properties ) {
			if(properties.data==undefined)
				properties.data = {};

			properties.error = function ( data ) {
				alert(data);
			};

			if(properties.success!=undefined) {
				var _success = properties.success;
				properties.success = function ( data ) {
					try {
						_success.call(this, data);
					} catch ( err ) {
						if($params.debugMode) {
							$log(err);
							alert( data );
						}
					}
				};
			}

			ajax.ajax({
				methode : 'POST',
				url : properties.url,
				data : properties.data,
				success : properties.success,
				error : properties.error
			});
		},

		// JSON
		getJSON : function ( properties ) {
			if(properties.data==undefined)
				properties.data = {};

			properties.error = function ( data ) {
				alert(data);
			};

			if(properties.success!=undefined) {
				var _success = properties.success;
				properties.success = function ( data ) {
					try {
						var json = JSON.parse(data);
						switch (json.ajaxMsg) {
							case 'error' : // message d'erreur
								alert(json.content);
								var dia = document.getElementById('g_dia_m');
								if(dia!=undefined)
									dia.parentNode.removeChild( dia );
							break;
							case 'redirection' : // redirection
								window.location.href = json.url;
							break;
							case 'reload' : // recharger la page
								window.location.reload();
							break;
							case 'newcall' : // redirection sur un nouveau callback
								$func[json.name](json);
							break;
							default:
								_success.call(this, json);
							break;
						}
					} catch ( err ) {
						if($params.debugMode) {
							$log(err);
							alert( data );
						}
					}
				};
			}

			ajax.ajax({
				methode : 'POST',
				url : properties.url,
				data : properties.data,
				success : properties.success,
				error : properties.error
			});
		}
	};

	return ajax;
});
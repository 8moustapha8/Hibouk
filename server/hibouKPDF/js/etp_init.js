
(function() {
	var data = null;
	document.addEventListener( "DOMContentLoaded",function(){
		window.addEventListener("load", function(){
			urls.css.forEach(function(item){
				var css = document.createElement("link");
				css.setAttribute("type", "text/css");
				css.setAttribute("rel", "stylesheet");
				css.setAttribute("href", item);
				document.head.appendChild(css);
			});

			var _fnc = function(urlsLength){
				return function(){
					urlsLength--;
					if (urlsLength==0)
						hiboukJS.load(data);
				};
			};
			var fnc = _fnc(urls.js.length+1);

			urls.js.forEach(function(item){
				var sc = document.createElement("script");
				sc.setAttribute("type", "text/javascript");
				sc.setAttribute("src", item);
				sc.addEventListener("load",function () {
					fnc();
				}, false);
				document.head.appendChild(sc);
			});


			var xhr = new XMLHttpRequest();
			xhr.open("GET", urls.config, false);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200){
						//data = JSON.parse(xhr.responseText);
						data = eval('(' + xhr.responseText + ')');
						data.bookTitle = booKTitle;
						data.tplURL = urls.tplURL;
						fnc();
					}
				}
			};
			xhr.send();
		}, false);
	});
}());

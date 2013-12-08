/**
 * @package Gallina °)>
 * @subpackage core (g_)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

// uploadfiles
define('js/lib/g_uploadfiles',function() {

	$req('i18n!js/lib/locale/g_uploadfiles.json!default:en-EN', function(__lang) {
		_lang = __lang;
	});

	var _lang = null;

	var upload = function (file,msg,filter,callback) {

		var filename = file.name;
		var ext = filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase();

		if(filter.indexOf(ext)!=-1) {

		var container = document.createElement("div"),
			fileInfo = document.createElement("div"),
			progressBarContainer = document.createElement("div"),
			progressBar = document.createElement("div"),
			percent = document.createElement("div"),
			xhr;

		container.appendChild(fileInfo);

		container.className = msg.container;
		fileInfo.className = msg.fileInfo;
		progressBarContainer.className = msg.progressBarContainer;
		progressBar.className = msg.progressBar;
		percent.className = msg.percent;
		progressBarContainer.appendChild(progressBar);
		progressBarContainer.appendChild(percent);

		percent.innerHTML = "0%";
		container.appendChild(progressBarContainer);

		// Uploading - for Firefox, Google Chrome and Safari
		xhr = new XMLHttpRequest();

		// Update progress bar
		xhr.upload.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) {
				var w = (evt.loaded / evt.total) * 100;
				progressBar.style.width = w + '%';
				percent.innerHTML = Math.floor(w) + '%';
			}
		}, false);

		// File uploaded
		xhr.addEventListener("load", function () {
			progressBar.style.width = '100%';
			percent.innerHTML = '100%';

			var data = this.responseText;
			// tester le retour avant de lancer le callBack
			try {
				var json = JSON.parse(data);
				switch (json.ajaxMsg) {
					case 'error' : // message d'erreur
						alert(json.content);
					break;
					default:
						if(callback!=undefined)
							callback(json);
					break;
				}
			} catch ( err ) {
				if($params.debugMode) {
					$log(err);
					alert( data );
				}
			}
		}, false);

		xhr.open("post", msg.url, true);

		var fd = new FormData();
		fd.append('fileToUpload', file);

		// Send the file (doh)
		xhr.send(fd);

		// Infos
		fileInfo.innerHTML = '<b>Name:</b> '+file.name+' <b>Size:</b> '+parseInt(file.size / 1024, 10)+' kb';;

		msg.box.appendChild(container);
		} else {
			msg.box.innerHTML = _lang.badExtension+' ('+filter.join(',')+')';//"Bad Extension";
			msg.hide();
		}
	};

	var uploadFiles = function (files,msg,filter,callback) {
		if (typeof files !== "undefined") {
			for (var i=0, l=files.length; i<l; i++){
				var x = undefined;
				if(i==files.length-1)
					x = callback;
				upload(files[i],msg,filter,x);
			}
		} else {
			msg.box.innerHTML = _lang.api;//"No support for the File API in this web browser";
			msg.hide();
		}
	};

	return uploadFiles;
});
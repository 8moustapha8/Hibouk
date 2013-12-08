{{$BOOTSTRAP_BUNDLES}}
{{$BUNDLESFILES}}
var BOOTSTRAP = "js/bootstrap/g_pk_bootstrap";

// listes des composants pour le démarrage si nécessaire sinon null
var COMPONENTSFILES = null;

var debugMode = {{$debugMode}};

var UITYPE = {
	// root de l"appli
	// html → "../" ou ""
	baseUrl : "",
	paths : {
		"cp" : "components",
		"js" : "js",
		"bdl" : "bundles",
	}
};
var HIBOUK_VERSION = "{{$HIBOUK_VERSION}}";
{{$BOOTSTRAP_BUNDLES}}
{{$BUNDLESFILES}}

var TRANFORMSTYLE = ["ap_default"];

var BOOTSTRAP = "js/bootstrap/ap_bootstrap";

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
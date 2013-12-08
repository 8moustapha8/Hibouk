{{template id="g_packages_m" overlay="" insert=""}}
<div id="{{$uid}}" class="{{$updateORinstall}}" data-depot="{{$depot}}" data-version="{{$version}}" data-namespace="{{$namespace}}" data-depend="{{$depend}}" data-installed="{{$installed}}" data-update="{{$update}}">
{{$installedInfos}}
<p>
	<img class="installPackage" src="images/g_packages_install.png" style="display:{{$addHidden}};" title="{{$kl.installPackage}}"/>
	<img class="updatePackage" src="images/g_packages_update.png" style="display:{{$majHidden}};" title="{{$kl.updatePackage}}"/>
	<img class="deletePackage" src="images/g_packages_delete.png" style="display:{{$deleteHidden}};" title="{{$kl.removePackage}}"/>
	<img class="helpPackage" src="images/g_packages_help.png" title="{{$kl.infoPackage}}"/>
</p>
<p><span class="name">{{$name}}</span> <span class="version">{{$version}}</span> <span class="phaseDev">{{$phase_dev}}</span></p>
</div>
{{/template}}
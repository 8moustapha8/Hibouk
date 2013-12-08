{{template id="packagesAplliab" overlay="tab_configuration" insert="afterend"}}
<cp:tab id="tab_packagesAplli">
	<cp:button id="bt_packagesAplli" label="{{$ap_application}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="packagesAplliTabpanel" overlay="tabpanel_configuration" insert="afterend"}}
<cp:tabpanel innerstyle="padding:0">
	<cp:hbox id="packagesAplli">
		<div id="Appli-admin">
			<iframe id="Appli-frame" name="Appli-frame" style="display:none;"></iframe>

			<h1>Hibouk (O,O)</h1>

			<form action="index.php" method="post" target="Appli-frame">
				<input name="module" value="ap_packagesAppli" type="hidden"/>
				<input name="act" value="saveconfig" type="hidden"/>
				<fieldset>
					<legend><b>{{$ap_config}}</b></legend>
					<p><span>{{$ap_bookNumber}}</span><input name="APPLI_BOOK_NUMBER" value="{{$APPLI_BOOK_NUMBER{{$}}}}" type="text"/></p>
					<hr />
					<input value="{{$ap_configSave}}" type="submit"/>
				</fieldset>
			</form>
			<br/>

			<form action="index.php" method="post" target="Appli-frame">
				<input name="module" value="ap_packagesAppli" type="hidden"/>
				<input name="act" value="tableCreat" type="hidden"/>
				<fieldset>
					<legend><b>{{$ap_creatdb}}</b></legend>
					<input value="{{$ap_creat}}" type="submit"/>
				</fieldset>
			</form>

		</div>
	</cp:hbox>
</cp:tabpanel>
{{/template}}
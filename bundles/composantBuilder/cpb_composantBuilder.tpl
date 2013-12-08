{{template id="cpBuilder" overlay="tab_depots" insert="afterend"}}
<cp:tab id="tab_cpBuilder">
	<cp:button id="bt_cpBuilder" label="{{$cpBuilder}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="cpBuilderTabpanel" overlay="tabpanel_depots" insert="afterend"}}
<cp:tabpanel innerstyle="padding:0">
	<cp:hbox innerstyle="padding:0">
		<cp:hbox class="toolsBar" innerstyle="padding:4px;">
			<select id="cpBuilder_components" style="position:relative;top:5px;" ></select>
			<cp:buttonseparator></cp:buttonseparator>
			<cp:button id="cpBuilder_save" label="Save" inactivated="true"></cp:button>
			<cp:button id="cpBuilder_run" label="Execute" inactivated="true"></cp:button>
			<cp:buttonseparator></cp:buttonseparator>
			<cp:button id="cpBuilder_js" label="Object" inactivated="true"></cp:button>
			<cp:button id="cpBuilder_css" label="CSS" inactivated="true"></cp:button>
			<cp:buttonseparator></cp:buttonseparator>
			<cp:button id="cpBuilder_jstest" label="Test" inactivated="true"></cp:button>
			<cp:button id="cpBuilder_htmltest" label="Demo" inactivated="true"></cp:button>
			<cp:buttonseparator></cp:buttonseparator>
			<cp:button id="cpBuilder_doc" label="Doc" inactivated="true"></cp:button>
		</cp:hbox>
		<cp:hbox id="cpBuilder_hbox" innerstyle="padding:0;bottom:0;" style="overflow:hidden;">
		<div id="cpBuilder_panel_editor" style="padding:0;margin:0;">
		<cp:codeeditor id="cpBuilder_codeeditor"></cp:codeeditor>
		</div>
		<div id="cpBuilder_panel_run" style="padding:0;margin:0;display:none;"><iframe id="cpBuilder_iframe" style="width:100%;border:0;heigth:100%"></iframe></div>
		<div id="cpBuilder_panel_doc" style="padding:0;margin:0;display:none;"><iframe id="cpBuilder_iframe_doc" style="width:100%;border:0;heigth:100%"></iframe></div>
		</cp:hbox>
	</cp:hbox>
</cp:tabpanel>
{{/template}}
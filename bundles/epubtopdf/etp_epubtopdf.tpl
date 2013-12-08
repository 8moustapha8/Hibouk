{{template id="epubtopdfTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab id="epubtopdfTab">
	<cp:button id="epubtopdf_tab" label="{{$etp_pdf}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="epubtopdfTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel id="epubtopdfTabpanel" innerstyle="padding:0">
	<cp:hbox class="toolsBar" innerstyle="padding:4px;">

	<cp:button id="epubtopdf_zoom_out" label="{{$epubtopdf_zoom_out}}" inactivated="true"></cp:button>
	<cp:button id="epubtopdf_zoom_in" label="{{$epubtopdf_zoom_in}}" inactivated="true"></cp:button>
	<cp:buttonseparator/>
	<cp:button id="epubtopdf_before" label="{{$etp_before}}" inactivated="true"></cp:button>
	<cp:button id="epubtopdf_after" label="{{$etp_after}}" inactivated="true"></cp:button>
	<span style="display:inline-block;position:relative;width:80px;font-size:14px;"><span style="position:absolute;top:-5px;"><input id="epubtopdf_page" type="text" style="width:40px;font-size:14px;margin:0;border:1px solid gray;border-radius: 3px;text-align:right;" disabled="disabled"/> / <span id="epubtopdf_numPages"></span></span></span>
	<cp:buttonseparator/>
	<cp:button id="epubtopdf_creatPDF" label="{{$etp_creat}}" inactivated="true"></cp:button>
	<span style="display:inline-block;position:relative;width:110px;font-size:10px;text-align:left;"><label style="position:absolute;top:-7px;">{{$etp_allfiles}}<input type="checkbox" id="epubtopdf_allfiles" style="position:relative;vertical-align:middle;"/></label></span>
	<cp:button id="epubtopdf_models" label="{{$epubtopdf_models}}"></cp:button>
	<span style="display:inline-block;position:relative;width:80px;font-size:11px;text-align:left;color:dimgray;"><span style="position:absolute;top:-5px;" id="epubtopdf_model_select"></span></span>

	<cp:button id="epubtopdf_errors" label="{{$etp_errors}}" inactivated="true" style="float:right;"></cp:button>
	<span style="float:right;display:inline-block;position:relative;width:80px;font-size:11px;text-align:left;color:dimgray;">0.1Alpha</span>
	</cp:hbox>

	<cp:hbox id="epubtopdf_hbox" innerstyle="padding:0;">
	<pre id="epubtopdf_errors_block" style="display:none;border:1px dotted gray;margin: 15px;padding:5px;"></pre>
	<div id="epubtopdf_viewer" style="position:relative;margin:15px auto;"><canvas id="epubtopdf_page_even"></canvas><canvas id="epubtopdf_page_odd"></canvas>
	</div>
</cp:hbox>
</cp:tabpanel>
{{/template}}
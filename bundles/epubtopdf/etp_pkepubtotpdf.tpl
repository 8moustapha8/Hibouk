{{template id="pk_etp_tab" overlay="tab_packages" insert="beforebegin"}}
<cp:tab id="tab_pk_etp">
	<cp:button id="bt_pk_etp" label="{{$etp_bt}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="pk_etp_tabpanel" overlay="tabpanel_packages" insert="beforebegin"}}
<cp:tabpanel innerstyle="padding:0">
<cp:hbox innerstyle="padding:0">
	<cp:tabbox id="etp_tabbox" selectedIndex="0" style="height: 350px;">
		<cp:tabs>
			<cp:tab>
				<cp:button id="etp_bt_configuration" label="{{$etp_config}}" class="tabbutton"></cp:button>
			</cp:tab>
			<cp:tab>
				<cp:button id="etp_bt_models" label="{{$etp_model}}" class="tabbutton"></cp:button>
			</cp:tab>
			<cp:tab>
				<cp:button id="etp_bt_pdf" label="{{$etp_pdf}}" class="tabbutton"></cp:button>
			</cp:tab>
		</cp:tabs>
		<cp:tabpanels>
			<cp:tabpanel innerstyle="padding:0">
				<cp:hbox innerstyle="padding:0;">
					<div id="pk_etp-admin">
						<iframe id="pk_etp-frame" name="pk_etp-frame" style="display:none;"></iframe>

						<h1>ePubToPDF</h1>

						<form action="index.php" method="post" target="pk_etp-frame">
							<input name="module" value="ap_packagesAppli" type="hidden"/>
							<input name="act" value="saveconfig" type="hidden"/>
							<fieldset>
								<legend><b>{{$etp_config}}</b></legend>
								<p><span>{{$etp_host}}</span><input name="ETP_HOST" value="{{$ETP_HOST{{$}}}}" type="text"/></p>

								<p><span>{{$etp_zoom}}</span><input name="ETP_ZOOMFACTOR" value="{{$ETP_ZOOMFACTOR{{$}}}}" type="text"/></p>
								<hr />
								<input value="{{$etp_configSave}}" type="submit"/>
							</fieldset>
						</form>
						<br/>
					</div>
				</cp:hbox>
			</cp:tabpanel>
			<cp:tabpanel innerstyle="padding:0">
				<cp:hbox class="toolsBar" innerstyle="padding:4px;">

					<select id="epubtopdf_models" style="position:relative;top:5px;" ></select>

					<cp:button id="epubtopdf_modelSwitch" label="CSS" inactivated="true"></cp:button>
					<cp:button id="epubtopdf_modelSave" label="{{$etp_modelSave}}" inactivated="true"></cp:button>
					<cp:button id="epubtopdf_modelNew" label="{{$etp_modelNew}}"></cp:button>
				</cp:hbox>
				<cp:hbox id="codeeditor_hbox" innerstyle="padding:0;bottom:0;" style="overflow:hidden;"><cp:codeeditor id="cp_codeeditor"></cp:codeeditor></cp:hbox>
			</cp:tabpanel>
			<cp:tabpanel innerstyle="padding:0">
				<cp:hbox class="toolsBar" innerstyle="padding:4px;">

					<cp:button id="epubtopdf_creatPDF" label="{{$etp_creat}}" inactivated="true"></cp:button>
					<cp:button id="epubtopdf_zoom_out" label="{{$epubtopdf_zoom_out}}" inactivated="true"></cp:button>
					<cp:button id="epubtopdf_zoom_in" label="{{$epubtopdf_zoom_in}}" inactivated="true"></cp:button>

					<cp:button id="epubtopdf_before" label="{{$etp_before}}" inactivated="true"></cp:button>
					<cp:button id="epubtopdf_after" label="{{$etp_after}}" inactivated="true"></cp:button>
					<span style="display:inline-block;position:relative;width:80px;font-size:14px;"><span style="position:absolute;top:-5px;"><input id="epubtopdf_page" type="text" style="width:40px;font-size:14px;margin:0;border:1px solid gray;border-radius: 3px;text-align:right;" disabled="disabled"/> / <span id="epubtopdf_numPages"></span></span></span>


					<cp:button id="epubtopdf_errors" label="{{$etp_errors}}" inactivated="true" style="float:right;"></cp:button>
				</cp:hbox>
				<cp:hbox innerstyle="padding:0;">
				<div id="pk_etp-pdf">
					<pre id="epubtopdf_errors_block" style="display:none;border:1px dotted gray;margin: 15px;padding:5px;"></pre>
					<div id="epubtopdf_viewer" style="position:relative;margin:15px auto;"><canvas id="epubtopdf_page_even"></canvas><canvas id="epubtopdf_page_odd"></canvas>
					</div>
				</div>
				</cp:hbox>
			</cp:tabpanel>
		</cp:tabpanels>
	</cp:tabbox>
</cp:hbox>

</cp:tabpanel>
{{/template}}
{{template id="packages" overlay="body" insert="inner"}}
<cp:hbox innerstyle="padding:0;">
	<cp:vbox id="biblioFrame" style="width:100%;" innerstyle="padding:0;">
	<cp:tabbox selectedIndex="1" id="Gpack-tabbox">
		<cp:tabs id="Tabs">
			<cp:tab id="tab_configuration" selected="true">
				<cp:button id="bt_configuration" label="{{$configuration}}" class="tabbutton"></cp:button>
			</cp:tab>
			<cp:tab id="tab_packages">
				<cp:button id="bt_packages" label="{{$packages}}" class="tabbutton"></cp:button>
			</cp:tab>
			<cp:tab id="tab_depots">
				<cp:button id="bt_depots" label="{{$depots}}" class="tabbutton"></cp:button>
			</cp:tab>
			<cp:button id="bt_logout" label="{{$disconnect}}" class="floatbutton"></cp:button>
		</cp:tabs>
		<cp:tabpanels id="Tabpanels">

		<cp:tabpanel id="tabpanel_configuration" selected="true" innerstyle="padding:0;">
		<cp:hbox id="hbox-admin"  innerstyle=""><cp:popupboxes id="msg" wait="images/g_wait.gif" cancel="images/g_cancel.png" ok="images/g_ok.png"></cp:popupboxes>
			<div id="Gpack-admin"><iframe id="frame" name="frame" style="display:none;"></iframe>
				<h1>Gallina °)&gt;</h1>
				<fieldset id="admin-administrator">
				<legend><b>{{$administrator}}</b></legend>
				<form id="admin-new-login-form" action="index.php" method="post" target="frame">
						<input name="module" value="packages" type="hidden"/>
						<input name="act" value="changeLoginAdmin" type="hidden"/>
						<p><span>{{$changeLogin}}</span><input id="newlogin" name="newlogin" type="text"/>
						<input value="OK" type="submit" style="width:50px;"/></p>
				</form>
				<form action="index.php" method="post" target="frame">
				<input name="module" value="packages" type="hidden"/>
				<input name="act" value="changePasswordAdmin" type="hidden"/>
				<p><span>{{$changePassword}}</span><input name="newPassword" />
				<input value="OK" type="submit" style="width:50px;"/></p>
				</form>
				</fieldset>
				<br/>
				<form id="admin-db-form" action="index.php" method="post" target="frame">
				<input name="module" value="packages" type="hidden"/>
				<input name="act" value="saveDB" type="hidden"/>
				<fieldset id="admin-db">
					<legend><b>{{$admindb}}</b></legend>
				<p><span>{{$dbTHost}}</span><input id="dbHost" name="dbHost" value="{{$dbHost{{$}}}}" type="text"/></p>
				<p><span>{{$dbTName}}</span><input id="dbName" name="dbName" value="{{$dbName{{$}}}}" type="text"/></p>
				<p><span>{{$dbDNS}}</span><input id="dbDNS" name="dbDNS" value="{{$dbDNS{{$}}}}" type="text" readonly="readonly" style="color:gray;"/></p>
				<p><span>{{$dbTLogin}}</span><input id="dbUsername" name="dbUsername" value="{{$dbUsername{{$}}}}" type="text"/></p>
				<p><span>{{$dbTPassword}}</span><input id="dbPassword" name="dbPassword" value="{{$dbPassword{{$}}}}" type="text"/></p>
				<p><span>{{$dbTOptions}}</span><input id="dbOptions" name="dbOptions" value="{{$dbOptions{{$}}}}" type="text"/></p>

				<hr id="admin-db-line"/>
				<input value="{{$adminDBSave}}" type="submit"/>
				</fieldset>
				</form>
				<br/>

				<form id="admin-form" action="index.php" method="post" target="frame">
				<input name="module" value="packages" type="hidden"/>
				<input name="act" value="confUpdate" type="hidden"/>
				<fieldset id="admin-options">
				<legend><b>{{$adminOptions}}</b></legend>
				<p><span><label for="GALLINA_DEBUG">{{$debugMode}}</label></span><input name="GALLINA_DEBUG" id="GALLINA_DEBUG" checked="{{$GALLINA_DEBUG{{$}}}}" type="checkbox"/></p>
				<p><span>{{$adminLangue}}</span><input name="GALLINA_CONFIG_LANG" value="{{$GALLINA_CONFIG_LANG{{$}}}}" type="text"/></p>
				<p><span>{{$sessionTime}}</span><input name="GALLINA_SESSION_TIMEOUT" value="{{$GALLINA_SESSION_TIMEOUT{{$}}}}" type="text"/></p>

				<hr id="admin-options-line"/>
				<input value="{{$adminOptionsSave}}" type="submit"/>
				</fieldset>
			</form>
			</div>
		</cp:hbox>
		</cp:tabpanel>

		<cp:tabpanel id="tabpanel_packages" innerstyle="padding:0;">
		<cp:hbox class="toolsBar" innerstyle="padding:10px;">
			<input type="button" value="{{$update}}" id="packages-update"/>&#160;&#160;&#160;&#160;
			<span><label for="packages-showPhaseDev">{{$showPhaseDev}}</label></span><input id="packages-showPhaseDev" checked="checked" type="checkbox"/>
		</cp:hbox>
		<cp:hbox id="hbox-packages" innerstyle="padding:0;">
		<div id="Gpack-frame-packages"></div>
		<div id="Gpack-info-packages"></div>
		</cp:hbox>
		</cp:tabpanel>

		<cp:tabpanel id="tabpanel_depots" innerstyle="padding:0;">

		<cp:hbox class="toolsBar" innerstyle="padding:4px;">
		<cp:button id="depot-save" label="{{$depotSave}}"></cp:button>
		<cp:button id="depot-refresh" label="{{$depotRefresh}}"></cp:button>
		<cp:button id="depot-add" label="{{$depotAdd}}"></cp:button>
		<cp:button id="depot-del" label="{{$depotDel}}" inactivated="true"></cp:button>
		</cp:hbox>
		<cp:hbox id="hbox-depots" innerstyle="padding:0;">
		<div id="Gpack-depot"></div>
		</cp:hbox>
		</cp:tabpanel>


		</cp:tabpanels>
	</cp:tabbox>
	</cp:vbox>
</cp:hbox>

{{/template}}
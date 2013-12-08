{{template id="bibliocommand" overlay="head" insert="beforeend"}}
<cp:command id="biblioBookCommand" inactivated="true"/>
<cp:stringbundleset id="strbundles">
	<cp:stringbundle name="confirmDelBook">{{$confirmDelBook}}</cp:stringbundle>
</cp:stringbundleset>
{{/template}}

{{template id="biblio" overlay="body" insert="inner"}}
<cp:hbox>
<cp:popupboxes id="msg" wait="images/g_wait.gif" cancel="images/g_cancel.png" ok="images/g_ok.png"></cp:popupboxes>
	<cp:vbox id="biblioFrame" style="width:100%;">
		<cp:hbox innerstyle="padding:5px;text-align:center;background:#B8B8B8;height:20px;font-family:monospace;"><b><a class="hibouk" href="http://hibouk.archicol.fr/" target="_blank" >Hibouk (O,O)</a></b> by <a class="archicol" href="http://www.archicol.fr/" target="_blank">@<span class="archi_t">rchc<span class="archi_i">i</span>col</span></a></cp:hbox>
		<cp:hbox class="toolsBar" innerstyle="padding:4px;">
			<cp:button id="biblioBookNew" label="{{$new}}" ></cp:button>
			<cp:button id="biblioBookImport" label="{{$import}}"></cp:button>
			<input type="file" id="biblioBookImport_epubElem" style="display:none"></input>
			<cp:button id="biblioBookEdit" label="{{$edit}}" command="biblioBookCommand"></cp:button>
			<cp:button id="biblioBookDel" label="{{$delete}}" command="biblioBookCommand"></cp:button>
			<cp:button id="biblioBookClone" label="{{$clone}}" command="biblioBookCommand"></cp:button>
			<cp:button id="biblioBookPref" label="{{$preference}}" class="floatbutton"></cp:button>
		</cp:hbox>
		<cp:hbox innerstyle="padding:0;">
			<cp:bibliobooks id="bibliobooks"></cp:bibliobooks>
		</cp:hbox>
	</cp:vbox>
	<cp:vbox id="bookFrame" style="width:100%;display:none;" innerstyle="padding:0;"></cp:vbox>
</cp:hbox>
{{/template}}
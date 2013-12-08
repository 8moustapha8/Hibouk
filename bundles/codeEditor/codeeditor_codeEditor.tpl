<!-- beforebegin -<p>- afterbegin -foo- beforeend -</p>- afterend -->
{{template id="strbundles_codeEditor" overlay="strbundles" insert="beforeend"}}
<cp:stringbundle name="codeEditor_Files">{{$codeEditor_Files}}</cp:stringbundle>
{{/template}}


{{template id="codeEditorTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab id="codeEditorTab">
	<cp:button id="book_tab_codeEditor" label="Code Editor" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="codeEditorTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel id="codeEditorTabpanel" innerstyle="padding:0">
	<cp:hbox innerstyle="padding:0;"><cp:barscroll id="codeeditor_onglets" style="width:300px;"></cp:barscroll></cp:hbox>
<cp:hbox class="toolsBar" innerstyle="padding:4px;">
<select id="codeEditorFiles" style="position:absolute;"></select>
</cp:hbox>
<cp:hbox id="codeeditor_hbox" innerstyle="padding:0;bottom:0;" style="overflow:hidden;"><cp:codeeditor id="cp_codeeditor"></cp:codeeditor></cp:hbox>
</cp:tabpanel>
{{/template}}
{{template id="editionTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab id="bookTabEdition">
	<cp:button id="book_tab_edition" label="{{$edition}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="editionTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel innerstyle="padding:0;">
<cp:hbox id="edition_hbox" innerstyle="padding:0;">
<cp:vbox id="edition_vbox1" innerstyle="padding:0;bottom:0;" style="width:800px;overflow:hidden;">
	<cp:hbox innerstyle="padding:0;"><cp:barscroll id="edition_onglets" style="width:300px;"></cp:barscroll></cp:hbox>
	<cp:hbox id="edition_toolsBar" class="toolsBar" innerstyle="padding:4px;"></cp:hbox>
	<cp:hbox id="edition_edit" innerstyle="padding:0;"><cp:editor id="cp_editor"></cp:editor></cp:hbox>
	<cp:hbox id="edition_hbox_levels" innerstyle="padding:0;border-top:1px solid gray;overflow:hidden;"><cp:barscroll id="edition_levels"  style="width:300px;overflow:hidden;"></cp:barscroll></cp:hbox>
</cp:vbox>
<cp:splitter id="edition_splitter"></cp:splitter>
<cp:vbox id="edition_vbox2" innerstyle="padding:0;">
<cp:attrs id="edition_attrs"></cp:attrs>
</cp:vbox>
</cp:hbox>
</cp:tabpanel>
{{/template}}

{{template id="edition_button_edit" overlay="book_doc_toolbar" insert="beforeend"}}
<cp:button id="book_doc_edit" label="{{$edit}}" inactivated="true"></cp:button>
{{/template}}

{{template id="edition_popup" overlay="bookFrame" insert="beforeend"}}
<cp:menupopup id="menu_popup_attrs">
	<cp:menuitem label="{{$new}}" id="menu_popup_new_attr"/>
</cp:menupopup>
{{/template}}
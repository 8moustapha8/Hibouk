{{template id="metaDataTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab>
	<cp:button id="book_tab_metadata" label="{{$metadata}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="metaDataTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel innerstyle="padding:0">
	<cp:hbox><div id="book_metadata"></div></cp:hbox>
</cp:tabpanel>
{{/template}}
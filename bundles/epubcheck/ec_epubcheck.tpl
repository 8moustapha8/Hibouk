{{template id="epubcheckTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab id="epubcheckTab">
	<cp:button id="book_tab_epubcheck" label="{{$ec_display}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="epubcheckTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel id="epubcheckTabpanel" innerstyle="padding:0">
	<cp:hbox class="toolsBar" innerstyle="padding:4px;">
	<cp:button id="epubcheck_check" label="{{$ec_display}}"></cp:button>
	</cp:hbox>
	<cp:hbox innerstyle="padding:20px;">
	<div id="epubcheck_result">
	</div>
	</cp:hbox>
</cp:tabpanel>
{{/template}}
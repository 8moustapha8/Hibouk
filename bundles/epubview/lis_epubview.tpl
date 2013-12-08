{{template id="epubviewTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab id="epubviewTab">
	<cp:button id="book_tab_epubview" label="{{$lis_display}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="epubvieaTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel id="epubvieaTabpanel" innerstyle="padding:0">
	<cp:hbox id="book_epubview"><cp:epubliseuse id="book_epubview_epubliseuse" style="margin:auto;" lang="fr" width="375" height="500"></cp:epubliseuse></cp:hbox>
</cp:tabpanel>
{{/template}}
{{template id="find_button_preview" overlay="book_doc_toolbar" insert="beforeend"}}
<cp:button id="book_doc_preview" label="{{$lis_view}}" inactivated="true"></cp:button>
{{/template}}
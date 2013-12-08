{{template id="strbundles_book" overlay="strbundles" insert="beforeend"}}
<cp:stringbundle name="documentCover">{{$documentCover}}</cp:stringbundle>
{{/template}}

{{template id="book" overlay="bookPanelLeft" insert="inner"}}
<cp:hbox id="book_doc_toolbar" class="toolsBar" innerstyle="padding:4px;">
	<cp:button id="book_doc_file_import" label="{{$import}}"></cp:button>
	<cp:button id="book_doc_file_del" label="{{$delete}}" inactivated="true"></cp:button>
</cp:hbox>
<cp:hbox id="book_doc_hbox" style="border-right:1px solid lightgray;">
<div id="book_doc_spine"></div>
<cp:menupopup id="menu_popup_guide">
	<cp:menuitem label="{{$cover}}" value="cover"/>
	<cp:menuitem label="{{$title_page}}" value="title-page"/>
	<cp:menuitem label="{{$epigraph}}" value="epigraph"/>
	<cp:menuitem label="{{$dedication}}" value="dedication"/>
	<cp:menuitem label="{{$table_of_contents}}" value="toc"/>
	<cp:menuitem label="{{$preface}}" value="preface"/>
	<cp:menuitem label="{{$foreword}}" value="foreword"/>
	<cp:menuitem label="{{$part}}" value="part"/>
	<cp:menuitem label="{{$chapter}}" value="chapter"/>
	<cp:menuitem label="{{$acknowledgements}}" value="acknowledgements"/>
	<cp:menuitem label="{{$list_of_illustrations}}" value="loi"/>
	<cp:menuitem label="{{$list_of_tables}}" value="lot"/>
	<cp:menuitem label="{{$notes}}" value="notes"/>
	<cp:menuitem label="{{$index}}" value="index"/>
	<cp:menuitem label="{{$glossary}}" value="glossary"/>
	<cp:menuitem label="{{$bibliography}}" value="bibliography"/>
	<cp:menuitem label="{{$copyright}}" value="copyright-page"/>
	<cp:menuitem label="{{$colophon}}" value="colophon"/>
	<cp:menuitem label="no" value="no"/>
</cp:menupopup>
</cp:hbox>
{{/template}}
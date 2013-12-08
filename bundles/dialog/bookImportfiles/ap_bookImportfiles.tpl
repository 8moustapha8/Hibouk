{{template id="bookImportfiles" overlay="body" insert="beforeend"}}
<cp:dialog id="bookImportfilesOK" width="380px" height="120px" title="{{$import}}">
<cp:hbox id="book_doc_toolbar" class="toolsBar" innerstyle="padding:4px;">
	<cp:button id="bookImportfiles_cover" label="{{$cover}}" ></cp:button>
	<input type="file" id="bookImportfiles_coverElem" style="display:none"></input>

	<cp:button id="bookImportfiles_text" label="{{$text}}" ></cp:button>
	<input type="file" id="bookImportfiles_textElem" style="display:none"></input>

	<cp:button style="float:right;" id="bookImportfiles_close" label="{{$close}}" ></cp:button>
</cp:hbox>
	<div id="bookImportfiles_boxMessage"></div>

</cp:dialog>
{{/template}}
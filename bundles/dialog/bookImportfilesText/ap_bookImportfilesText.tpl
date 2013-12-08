{{template id="bookImportfilesText" overlay="body" insert="beforeend"}}
<cp:dialog id="bookImportfilesTextOK" width="500px" height="400px" title="{{$options}}">
	<div class="bookImportfilesText_name"><span class="bookImportfilesText_title">{{$name}}</span><input type="text" id="bookImportfilesText_nameI"/></div>

	<div class="bookImportfilesText_name"><span class="bookImportfilesText_title">{{$guide}}</span>
<select id="bookImportfilesText_guide">
<option value="title-page">{{$title_page}}</option>
<option value="epigraph">{{$epigraph}}</option>
<option value="dedication">{{$dedication}}</option>
<option value="table_of_contents">{{$table_of_contents}}</option>
<option value="preface">{{$preface}}</option>
<option value="foreword">{{$foreword}}</option>
<option value="part">{{$part}}</option>
<option value="chapter">{{$chapter}}</option>
<option value="acknowledgements">{{$acknowledgements}}</option>
<option value="list_of_illustrations">{{$list_of_illustrations}}</option>
<option value="list_of_tables">{{$list_of_tables}}</option>
<option value="notes">{{$notes}}</option>
<option value="index">{{$index}}</option>
<option value="glossary">{{$glossary}}</option>
<option value="bibliography">{{$bibliography}}</option>
<option value="copyright">{{$copyright}}</option>
<option value="colophon">{{$colophon}}</option>
</select></div>


	<div class="bookImportfilesText_div"><span class="bookImportfilesText_title">{{$filescss}}</span>
		<div id="bookImportfilesText_filesCSS"></div>
	</div>
	<div class="bookImportfilesText_div"><span class="bookImportfilesText_title">{{$transform}}</span>
		<div id="bookImportfilesText_transform"></div>
	</div>
</cp:dialog>
{{/template}}
{{template id="strbundles_book" overlay="strbundles" insert="beforeend"}}
<cp:stringbundle name="filesList">{{$filesList}}</cp:stringbundle>
<cp:stringbundle name="load">{{$load}}</cp:stringbundle>
<cp:stringbundle name="tocFileName">{{$tocFileName}}</cp:stringbundle>
<cp:stringbundle name="tocTitle">{{$tocTitle}}</cp:stringbundle>
{{/template}}

{{template id="tocTab" overlay="bookTabs" insert="beforeend"}}
<cp:tab>
	<cp:button id="book_tab_toc" label="{{$toc}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="tocTabpanel" overlay="bookTabpanels" insert="beforeend"}}
<cp:tabpanel innerstyle="padding:0">
	<cp:hbox class="toolsBar" innerstyle="padding:4px;">
		<cp:button id="book_toc_genrerate" label="{{$generate}}" ></cp:button>
		<cp:button id="book_toc_add" label="{{$add}}" inactivated="true"></cp:button>
		<cp:button id="book_toc_del" label="{{$del}}" inactivated="true"></cp:button>
<cp:buttonseparator></cp:buttonseparator>
<div style="position:relative;display:inline-block;margin:0;width:40px;top:-8px;">
<select id="book_toc_level" style="position:absolute;">
	<option value="1" selected="selected">1</option>
	<option value="2">2</option>
	<option value="3">3</option>
	<option value="4">4</option>
	<option value="5">5</option>
	<option value="6">6</option>
</select>
</div>
		<cp:button id="book_toc_creat" label="{{$creat}}" inactivated="true"></cp:button>
	</cp:hbox>
	<cp:hbox><div id="book_toc_ncx"></div></cp:hbox>
</cp:tabpanel>
{{/template}}
{{template id="strbundles_book" overlay="strbundles" insert="beforeend"}}
<cp:stringbundle name="confirmSaveBook">{{$confirmSaveBook}}</cp:stringbundle>
<cp:stringbundle name="bookUpdateFilesList">{{$bookUpdateFilesList}}</cp:stringbundle>
<cp:stringbundle name="saveFiles">{{$saveFiles}}</cp:stringbundle>
<cp:stringbundle name="locked">{{$locked}}</cp:stringbundle>
{{/template}}

{{template id="book" overlay="bookFrame" insert="inner"}}
<cp:vbox style="width:300px;" id="bookPanelLeft"></cp:vbox>
<cp:splitter style="border:0;"></cp:splitter>
<cp:vbox id="truc" innerstyle="padding:0;bottom:0;">
	<cp:tabbox id="bookTabbox" selectedIndex="1">
		<cp:tabs id="bookTabs">
			<cp:button class="floatbutton" id="book_close" label="{{$close}}"></cp:button>
			<cp:button class="floatbutton" id="book_save" label="{{$save}}"></cp:button>
			<cp:button class="floatbutton" id="book_export" label="{{$export}}"></cp:button>
			<cp:statusselect class="floatbutton" id="book_statusselect" status="progr" style="margin-top:8px;"></cp:statusselect>
			<cp:checkselect id="book_checkselect" class="floatbutton" style="margin-top:8px;"></cp:checkselect>
			<cp:epubopf id="book_epubopf" dependenciessearch="{{$dependenciessearch}}"></cp:epubopf>
		</cp:tabs>
		<cp:tabpanels id="bookTabpanels"></cp:tabpanels>
	</cp:tabbox>
</cp:vbox>
{{/template}}
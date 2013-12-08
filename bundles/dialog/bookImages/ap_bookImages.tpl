{{template id="bookImagesfiles" overlay="body" insert="beforeend"}}
<cp:dialog id="bookImagesOK" width="380px" height="180px" title="{{$img}}" hide="no">

<div id="bookImagesImport" style="display:none;"><br/>
	<input type="file" id="bookImagesImport_file"></input><br/><br/>
	{{$caption}}<input type="text" id="bookImagesImport_caption"></input>
</div>

<div id="bookImagesOptions" style="display:none;"><br/>
	<span id="bookImagesOption_captSpan" style="display:none;">{{$caption}}<input type="text" id="bookImagesOption_caption"></input><br/><br/></span>
	<input type="button" id="bookImagesOption_del" value="{{$delete}}"></input>
</div>

</cp:dialog>
{{/template}}
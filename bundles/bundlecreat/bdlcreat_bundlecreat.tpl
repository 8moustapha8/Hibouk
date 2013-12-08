{{template id="bundlecreat" overlay="tab_depots" insert="afterend"}}
<cp:tab id="tab_bundlecreat">
	<cp:button id="bt_bundlecreat" label="{{$bundlecreat}}" class="tabbutton"></cp:button>
</cp:tab>
{{/template}}

{{template id="bundlecreatTabpanel" overlay="tabpanel_depots" insert="afterend"}}
<cp:tabpanel innerstyle="padding:0">
	<cp:hbox>
		<div id="bdlcreat-block">
			<p><span>{{$bundleName}}</span> <input id="bdlcreat_input_bundleName" value="" type="text"/></p>
			<p><span>{{$nameSpace}}</span> <input id="bdlcreat_input_nameSpace" value="" type="text"/></p>
			<p><span>{{$typeBundle}}</span> <input id="bdlcreat_input_typeBundle" value="extend" type="text"/></p>
			<p><span>{{$author}}</span> <input id="bdlcreat_input_author" value="" type="text"/></p>
			<p><span>{{$licence}}</span> <input id="bdlcreat_input_licence" value="GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html" type="text"/></p>
			<br/>
			<input type="button" id="bdlcreat_input_generate" value="{{$generate}}"/>
		</div>
	</cp:hbox>
</cp:tabpanel>
{{/template}}
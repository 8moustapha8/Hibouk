<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:xd="http://www.pnp-software.com/XSLTdoc"
xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" 
xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" 
xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" 
xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" 
xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" 
xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:dc="http://purl.org/dc/elements/1.1/" 
xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" 
xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" 
xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" 
xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" 
xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" 
xmlns:math="http://www.w3.org/1998/Math/MathML" 
xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" 
xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" 
xmlns:ooo="http://openoffice.org/2004/office" 
xmlns:ooow="http://openoffice.org/2004/writer" 
xmlns:oooc="http://openoffice.org/2004/calc" 
xmlns:dom="http://www.w3.org/2001/xml-events" 
xmlns:xforms="http://www.w3.org/2002/xforms" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:field="urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:field:1.0"
xmlns:php="http://php.net/xsl" xsl:extension-element-prefixes="php"
exclude-result-prefixes="office style xd text table draw fo xlink dc meta number svg chart dr3d math
form script ooo ooow oooc dom xforms xsd xsi field php">

<xsl:output method="xml" encoding="UTF-8" omit-xml-declaration="yes" media-type="text/html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="DTD/xhtml1-strict.dtd"/>


<xsl:template match="/">
	<xsl:apply-templates select="/office:document-content/office:body/office:text" />
</xsl:template>

<xsl:template match="office:text">
<xsl:apply-templates />
<xsl:call-template name="add-footnote-bodies"/>
</xsl:template>

<!-- supression des modification dans un document -->
<xsl:template match="text:tracked-changes"></xsl:template>

<xsl:template match="text:h">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>
<xsl:variable name="outlineLevel" select="@text:outline-level"/>
<xsl:choose>
<xsl:when test="$outlineLevel!=''">
<xsl:variable name="level">h<xsl:value-of select="$outlineLevel"/></xsl:variable>
<xsl:element name="{$level}"><xsl:apply-templates /></xsl:element>
</xsl:when>
<xsl:otherwise>
<p><xsl:apply-templates /></p>
</xsl:otherwise>
</xsl:choose>
</xsl:otherwise>
</xsl:choose>
</xsl:template>


<xsl:template match="text:p">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>

<xsl:choose>
<xsl:when test="not(draw:frame)">

<xsl:variable name="AtextAlign" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:paragraph-properties/@fo:text-align"/>
<xsl:variable name="textAlign" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:paragraph-properties/@fo:text-align"/>

<xsl:variable name="styleparent" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/@style:parent-style-name"/>

<xsl:variable name="styleName"><xsl:value-of select="@text:style-name"/>
</xsl:variable>

<xsl:variable name="txt"><xsl:copy-of select="current()"/></xsl:variable>

<xsl:if test="string-length($txt) > 0">
<xsl:text>
</xsl:text>
<xsl:choose>
<xsl:when test="($textAlign='center') or ($AtextAlign='center')"><p style="text-align:center;"><xsl:apply-templates /></p></xsl:when>
<xsl:when test="($textAlign='end') or ($AtextAlign='end')"><p style="text-align:right;"><xsl:apply-templates /></p></xsl:when>
<xsl:when test="($textAlign='start') or ($AtextAlign='start')"><p style="text-align:left;"><xsl:apply-templates /></p></xsl:when>
<xsl:when test="($textAlign='justify') or ($AtextAlign='justify')"><p style="text-align:justify;"><xsl:apply-templates /></p></xsl:when>
<xsl:otherwise><p><xsl:apply-templates /></p></xsl:otherwise>
</xsl:choose>
<xsl:text>
</xsl:text>
</xsl:if>
<xsl:if test="starts-with(@text:style-name, 'Horizontal')">
<hr/>
</xsl:if>
</xsl:when>
<xsl:otherwise>
<xsl:choose>
<xsl:when test="draw:frame/draw:text-box/text:p/draw:frame">
<xsl:apply-templates select="draw:frame" mode="p"/>
</xsl:when>
<xsl:otherwise>
<xsl:choose>
<xsl:when test="draw:frame/draw:image">
<div class="figure">
<xsl:apply-templates select="draw:frame/draw:image" mode="d"/>
<xsl:if test="text:span">
<p class="caption"><xsl:apply-templates/></p>
</xsl:if>
</div>
</xsl:when>


<xsl:otherwise></xsl:otherwise>
</xsl:choose>
</xsl:otherwise>
</xsl:choose>
</xsl:otherwise>
</xsl:choose>
</xsl:otherwise>
</xsl:choose>
</xsl:template>


<xsl:template match="text:line-break"><xsl:text> </xsl:text></xsl:template>

<xsl:template match="text:span">

<xsl:variable name="AfontStyle" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@fo:font-style"/>
<xsl:variable name="AfontWeight" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@fo:font-weight"/>
<xsl:variable name="AtextPosition" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-position"/>
<xsl:variable name="AtextLineThroughStyle" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-line-through-style"/>
<xsl:variable name="AtextUnderlineStyle" select="/office:document-content/office:automatic-styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-underline-style"/>
<xsl:variable name="fontStyle" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@fo:font-style"/>
<xsl:variable name="fontWeight" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@fo:font-weight"/>
<xsl:variable name="textPosition" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-position"/>
<xsl:variable name="textLineThroughStyle" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-line-through-style"/>
<xsl:variable name="textUnderlineStyle" select="/office:document-content/office:styles/style:style[@style:name=(current()/@text:style-name)]/style:text-properties/@style:text-underline-style"/>


<xsl:variable name="txt"><xsl:copy-of select="current()"/></xsl:variable>


<xsl:if test="string-length($txt) > 0">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>
<xsl:if test="(starts-with($textPosition, 'sup')) or (starts-with($AtextPosition, 'sup'))">[|lt|]sup[|gt|]</xsl:if>
<xsl:if test="(starts-with($textPosition, 'sub')) or (starts-with($AtextPosition, 'sub'))">[|lt|]sub[|gt|]</xsl:if>
<xsl:if test="($fontStyle='italic') or ($AfontStyle='italic')">[|lt|]i[|gt|]</xsl:if>
<xsl:if test="($fontWeight='bold') or ($AfontWeight='bold')">[|lt|]b[|gt|]</xsl:if>
<xsl:if test="($textLineThroughStyle='solid') or ($AtextLineThroughStyle='solid')">[|lt|]span style="text-decoration:line-through;"[|gt|]</xsl:if>
<xsl:if test="($textUnderlineStyle='solid') or ($AtextUnderlineStyle='solid')">[|lt|]span style="text-decoration:underline;"[|gt|]</xsl:if>
<xsl:apply-templates/>
<xsl:if test="($textUnderlineStyle='solid') or ($AtextUnderlineStyle='solid')">[|lt|]/span[|gt|]</xsl:if>
<xsl:if test="($textLineThroughStyle='solid') or ($AtextLineThroughStyle='solid')">[|lt|]/span[|gt|]</xsl:if>
<xsl:if test="($fontWeight='bold') or ($AfontWeight='bold')">[|lt|]/b[|gt|]</xsl:if>
<xsl:if test="($fontStyle='italic') or ($AfontStyle='italic')">[|lt|]/i[|gt|]</xsl:if>
<xsl:if test="(starts-with($textPosition, 'sub')) or (starts-with($AtextPosition, 'sub'))">[|lt|]/sub[|gt|]</xsl:if>
<xsl:if test="(starts-with($textPosition, 'sup')) or (starts-with($AtextPosition, 'sup'))">[|lt|]/sup[|gt|]</xsl:if>
</xsl:otherwise>
</xsl:choose>
</xsl:if>
</xsl:template>

<xsl:template match="t4htlink"></xsl:template>

<xsl:template match="text:note">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>

<xsl:variable name="txt"><xsl:copy-of select="current()"/></xsl:variable>
<xsl:if test="string-length($txt) > 0">
<xsl:choose>
<xsl:when test="@text:note-class='footnote'">
   <xsl:variable name="id"><xsl:number level="any" count="text:note[@text:note-class='footnote']"/></xsl:variable>
   <xsl:variable name="footnote-id"><xsl:value-of select="php:function('ap_styleSheet::set_footID',string($id))"/></xsl:variable>
   <a class="footnote-mark" href="#footnote-{$footnote-id}">
      <sup><xsl:value-of select="$id"/></sup>
   </a>
</xsl:when>
<xsl:otherwise></xsl:otherwise>
</xsl:choose>
</xsl:if>
</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="text:note-citation"></xsl:template>


<xsl:template match="text:p" mode="footnote">
<xsl:variable name="p"><xsl:number count="text:p" /></xsl:variable>
<xsl:variable name="num"><xsl:number level="any" count="text:note[@text:note-class='footnote']"/></xsl:variable>
<xsl:choose>
   <xsl:when test="$p = 1">
      <p><span class="footnote-number"><xsl:value-of select="$num"/>. </span><xsl:apply-templates /></p>
   </xsl:when>
   <xsl:otherwise>
      <p><xsl:apply-templates /></p>
   </xsl:otherwise>
</xsl:choose>
</xsl:template>



<xsl:template match="text:note-body"/>
  <xsl:template name="add-footnote-bodies">
   <xsl:apply-templates select="//text:note" mode="add-footnote-bodies"/>
</xsl:template>

<xsl:template match="text:note" mode="add-footnote-bodies">
   <xsl:variable name="id"><xsl:number level="any" count="text:note[@text:note-class='footnote']"/></xsl:variable>
   <xsl:variable name="footnote-id"><xsl:value-of select="php:function('ap_styleSheet::get_footID',string($id))"/></xsl:variable>
   <xsl:if test="$id = 1">
      <div class="footnote-header"> </div>
   </xsl:if>
   <div class="footnote-foot" id="footnote-{$footnote-id}">
   <xsl:apply-templates select="text:note-body/*" mode="footnote"/>
   </div>
</xsl:template>



<xsl:template match="text:a">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>

<xsl:variable name="xlinkType"><xsl:value-of select="@xlink:type"/></xsl:variable>

<xsl:if test="$xlinkType='simple'">
<xsl:choose>
<xsl:when test="starts-with(@xlink:href, 'mailto')"><xsl:apply-templates /></xsl:when>
<xsl:otherwise><a href="{@xlink:href}" target="_blank"><xsl:apply-templates /></a></xsl:otherwise>
</xsl:choose>
</xsl:if>
</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="text:list">
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise>
<xsl:variable name="style" select="ancestor-or-self::text:list/@text:style-name"/>

<xsl:variable name="Aenumerate" select="/office:document-content/office:automatic-styles/text:list-style[@style:name=$style]/text:list-level-style-number[@text:level='1']/@style:num-format"/>
<xsl:variable name="Aitemize" select="/office:document-content/office:automatic-styles/text:list-style[@style:name=$style]/text:list-level-style-bullet[@text:level='1']/@text:bullet-char"/>

<xsl:variable name="enumerate" select="/office:document-content/office:styles/text:list-style[@style:name=$style]/text:list-level-style-number[@text:level='1']/@style:num-format"/>
<xsl:variable name="itemize" select="/office:document-content/office:styles/text:list-style[@style:name=$style]/text:list-level-style-bullet[@text:level='1']/@text:bullet-char"/>

<xsl:choose>
<xsl:when test="($enumerate!='') or ($Aenumerate!='')">
<ol>
<xsl:apply-templates select="text:list-item" mode="enumerate"/>
</ol>
</xsl:when>
<xsl:when test="($itemize!='') or ($Aitemize!='')">
<ul>
<xsl:apply-templates select="text:list-item" mode="itemize"/>
</ul>
</xsl:when>
<xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
</xsl:choose>
</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="text:list-item" mode="itemize" >
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise><li><xsl:apply-templates/></li></xsl:otherwise></xsl:choose></xsl:template>


<xsl:template match="text:list-item" mode="enumerate" >
<xsl:choose>
<!-- tranformation depuis une feuille de style -->
<xsl:when test="php:function('ap_styleSheet::style_in_array',string(@text:style-name))='1'">
<xsl:element name="{php:function('ap_styleSheet::creat_element',string(@text:style-name))}">
<xsl:call-template name="StyleSheet_element">
         <xsl:with-param name="fin" select="php:function('ap_styleSheet::count_attributs',@*)" />
         <xsl:with-param name="style" select="string(@text:style-name)" />
      </xsl:call-template>
<xsl:apply-templates/>
</xsl:element>
</xsl:when>
<xsl:otherwise><li><xsl:apply-templates/></li></xsl:otherwise></xsl:choose></xsl:template>


<xsl:template match="indexniv"></xsl:template>
<xsl:template match="indexniv" mode="index">
<xsl:attribute  name="rp"><xsl:value-of select="@rp"/></xsl:attribute>
<xsl:apply-templates /></xsl:template>



<xsl:template match="text:alphabetical-index-mark-start"></xsl:template>

<!-- **************************** Figures **************************** -->

<xsl:template match="draw:frame" mode="p">
<xsl:choose>
<xsl:when test="draw:text-box/text:p/draw:frame/draw:image">
<div class="figure">
<xsl:apply-templates select="draw:text-box/text:p/draw:frame/draw:image" mode="d"/>
<xsl:apply-templates select="draw:text-box/text:p" mode="caption"/>
</div>
</xsl:when>

<xsl:when test="draw:image">
<xsl:if test="not(ancestor::draw:text-box)">
<div class="figure">
<xsl:apply-templates select="draw:image" mode="d"/>
</div>
</xsl:if>
</xsl:when>

<xsl:otherwise></xsl:otherwise>
</xsl:choose>
</xsl:template>


<xsl:template match="text:p" mode="caption"><p class="figcaption"><xsl:apply-templates/></p></xsl:template>
<xsl:template match="text:p" mode="captionl"><span class="figcaption"><xsl:apply-templates /></span></xsl:template>


<xsl:template match="draw:image" mode="s">
<span>
<img alt="" >
<xsl:attribute  name="src"><xsl:value-of select="php:function('ap_styleSheet::link_src',string(@xlink:href))"/></xsl:attribute>
</img>
</span>
</xsl:template>

<xsl:template match="draw:image" mode="d">
<div>
<img alt="">
<xsl:attribute  name="src"><xsl:value-of select="php:function('ap_styleSheet::link_src',string(@xlink:href))"/></xsl:attribute>
</img>
</div>
</xsl:template>

<!-- *********************************************************************** -->
<!-- ***************************  LABEL/REF/PAGEREF  *********************** -->

<xsl:template match="text:bookmark-start"><span id="{@text:name}" class="cross-ref-target"></span></xsl:template>

<xsl:template match="text:reference-mark-start"><span id="{@text:name}" class="cross-ref-target"></span></xsl:template>

<xsl:template match="text:bookmark-end"></xsl:template>

<xsl:template match="text:reference-mark-end"></xsl:template>

<xsl:template match="text:reference-ref|text:bookmark-ref "><a class="crossref-type-page" href="#{@text:ref-name}">→</a></xsl:template>

<!-- ***************************  Tableaux  *********************** -->

<xsl:template match="table:table">
 <div class="table"><div>
 <table border="1">
  <colgroup>
   <xsl:apply-templates select="table:table-column"/>
  </colgroup>
  <xsl:if test="table:table-header-rows/table:table-row">
   <thead>
   <xsl:apply-templates select="table:table-header-rows/table:table-row"/>
 </thead>
  </xsl:if>
  <tbody>
  <xsl:apply-templates select="table:table-row"/>
  </tbody>
 </table>
</div></div>
</xsl:template>
  <xsl:template match="table:table-column">
<col>
 <xsl:if test="@table:number-columns-repeated">
  <xsl:attribute name="span">
   <xsl:value-of select="@table:number-columns-repeated"/>
  </xsl:attribute>
 </xsl:if>
</col>
</xsl:template>
  <xsl:template match="table:table-row">
<tr>
 <xsl:apply-templates select="table:table-cell"/>
</tr>
</xsl:template>
  <xsl:template match="table:table-cell">
 <xsl:variable name="n">
  <xsl:choose>
   <xsl:when test="@table:number-columns-repeated != 0">
 <xsl:value-of select="@table:number-columns-repeated"/>
   </xsl:when>
   <xsl:otherwise>1</xsl:otherwise>
  </xsl:choose>
 </xsl:variable>
 <xsl:call-template name="process-table-cell">
  <xsl:with-param name="n" select="$n"/>
 </xsl:call-template>
</xsl:template>
  <xsl:template name="process-table-cell">
 <xsl:param name="n"/>
 <xsl:if test="$n != 0">
  <td>
  <xsl:if test="@table:number-columns-spanned">
   <xsl:attribute name="colspan">
 <xsl:value-of select="@table:number-columns-spanned"/>
   </xsl:attribute>
  </xsl:if>
  <xsl:if test="@table:number-rows-spanned">
   <xsl:attribute name="rowspan">
 <xsl:value-of select="@table:number-rows-spanned"/>
   </xsl:attribute>
  </xsl:if>
  <xsl:apply-templates/>
  </td>
  <xsl:call-template name="process-table-cell">
   <xsl:with-param name="n" select="$n - 1"/>
  </xsl:call-template>
 </xsl:if>
</xsl:template>




<xsl:template name="StyleSheet_element">
	<xsl:param name="fin" select="0" />
	<xsl:param name="style" select="0" />
	<xsl:call-template name="StyleSheet_replace_element">
         <xsl:with-param name="debut" select="0" />
         <xsl:with-param name="fin" select="$fin" />
         <xsl:with-param name="style" select="$style" />
      </xsl:call-template>
      <xsl:call-template name="StyleSheet_new_element">
      	<xsl:with-param name="debut" select="0" />
      	<xsl:with-param name="fin" select="php:function('ap_styleSheet::count_new_attr',string($style))" />
      	<xsl:with-param name="style" select="$style" />
      </xsl:call-template>
</xsl:template>

<xsl:template name="StyleSheet_replace_element">
   <xsl:param name="debut" select="0" />
   <xsl:param name="fin" select="0" />
   <xsl:param name="style" select="0" />
   <xsl:variable name="name"><xsl:value-of select="php:function('ap_styleSheet::switch_attr',$debut,$style)"/></xsl:variable>
   <xsl:if test="$name!=''">
   <xsl:attribute  name="{$name}"><xsl:value-of select="php:function('ap_styleSheet::value_attr',$debut)"/></xsl:attribute>
   </xsl:if>
   <xsl:if test="$debut &lt; $fin">
      <xsl:call-template name="StyleSheet_replace_element">
         <xsl:with-param name="debut" select="($debut)+1" />
         <xsl:with-param name="fin" select="$fin" />
         <xsl:with-param name="style" select="$style" />
      </xsl:call-template>
   </xsl:if>
</xsl:template>


<xsl:template name="StyleSheet_new_element">
   <xsl:param name="debut" select="0" />
   <xsl:param name="fin" select="0" />
   <xsl:param name="style" select="0" />

   <xsl:if test="$fin!='null'">
   <xsl:variable name="name"><xsl:value-of select="php:function('ap_styleSheet::creat_new_attr',$debut,$style)"/></xsl:variable>
   <xsl:attribute  name="{$name}"><xsl:value-of select="php:function('ap_styleSheet::value_new_attr',$debut,$style)"/></xsl:attribute>
   <xsl:if test="$debut &lt; $fin">
      <xsl:call-template name="StyleSheet_new_element">
         <xsl:with-param name="debut" select="($debut)+1" />
         <xsl:with-param name="fin" select="$fin" />
         <xsl:with-param name="style" select="$style" />
      </xsl:call-template>
   </xsl:if>
   </xsl:if>
</xsl:template>
</xsl:stylesheet>

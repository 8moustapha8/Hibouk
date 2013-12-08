<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:ncx="http://www.daisy.org/z3986/2005/ncx/">
 <xsl:output method="xml" omit-xml-declaration="no"/>

<!-- tous les elements -->
<xsl:template match="*">
  <xsl:element name="ncx:{local-name()}">
   <xsl:apply-templates select="@* | node()"/>
  </xsl:element>
 </xsl:template>

<!-- les attributs -->
 <xsl:template match="@*">
  <xsl:copy/>
 </xsl:template>

</xsl:stylesheet>
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:opf="http://www.idpf.org/2007/opf">
 <xsl:output method="xml" omit-xml-declaration="no"/>

<!-- les elements dublin core -->
<xsl:template match="dc:*">
  <xsl:element name="dc:{local-name()}">
     <xsl:apply-templates select="@* | node()"/>
  </xsl:element>
 </xsl:template>

<!-- tous les elements -->
<xsl:template match="*">
  <xsl:element name="opf:{local-name()}">
   <xsl:apply-templates select="@* | node()"/>
  </xsl:element>
 </xsl:template>

<!-- la racine -->
 <xsl:template match="/*">
  <opf:package xmlns:dc="http://purl.org/dc/elements/1.1/">
   <xsl:apply-templates select="@* | node()"/>
  </opf:package>
 </xsl:template>

<!-- les attributs -->
 <xsl:template match="@*">
  <xsl:copy/>
 </xsl:template>

</xsl:stylesheet>
<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:php="http://php.net/xsl"
xsl:extension-element-prefixes="php" exclude-result-prefixes="php">
<xsl:output method="html" encoding="UTF-8" />

<!-- ++++++++++++++ sophiaXML to HTML ++++++++++++++ -->

<!-- ++++++++++++++ ARTICLE ++++++++++++++ -->
<xsl:template match="ARTICLE|article"><xsl:apply-templates /></xsl:template>

<!-- ++++++++++++++ HEAD ++++++++++++++ -->
<xsl:template match="HEAD|head"></xsl:template>

<xsl:template match="AUTEURS|auteurs" mode="mapHEAD">
<div class="h_auteurs"><xsl:apply-templates mode="mapHEAD"/></div>
</xsl:template>

<xsl:template match="AUTEUR|auteur" mode="mapHEAD">
<div class="h_auteur"><xsl:apply-templates mode="mapHEAD"/></div>
</xsl:template>

<xsl:template match="FULLTEXT|fulltext" mode="mapHEAD">
<p class="h_fulltext"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="INFOAUTEUR|infoauteur" mode="mapHEAD">
<div class="h_infoauteur"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="*" mode="mapHEAD"></xsl:template>

<!--
DATE (#PCDATA)
NUM (#PCDATA)
SCE (#PCDATA)
DOSSIER (#PCDATA)
FOLIO (#PCDATA)
RUB (#PCDATA)
SRUB (#PCDATA)
NBMOTS (#PCDATA)
-->

<!-- ++++++++++++++ BODY ++++++++++++++ -->
<xsl:template match="BODY|body"><xsl:apply-templates/></xsl:template>

<!-- ++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- fichier XML Histoire web-dossier sans head -->

<xsl:template match="URL|url"></xsl:template>

<xsl:template match="PUBLICATION|publication|SCE|sce"></xsl:template>
<xsl:template match="PARUTION|parution"></xsl:template>
<xsl:template match="RUBRIQUE|rubrique"></xsl:template>

<xsl:template match="DOSSIER|dossier"></xsl:template>

<!-- ++++++++++++++++++++++++++++++++++++++++++++++ -->

<!-- BODY -->

<xsl:template match="SURTITRE|surtitre">
<p class="surtitre"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="TITRE|titre"><h1><xsl:apply-templates/></h1>
<xsl:apply-templates select="//HEAD/AUTEUR" mode="mapHEAD"/>
</xsl:template>

<xsl:template match="CHAPO|chapo|CHAPEAU|chapeau">
<div class="chapeau"><xsl:apply-templates/></div>
</xsl:template>

<!-- ML ++++++++++++++++++++++++++++++++++++++++++++++ -->

<xsl:template match="DOSSIER|dossier">
<div class="dossier"><xsl:apply-templates/></div>
</xsl:template>

<!-- livres -->
<xsl:template match="LIVRES|livres">
<div class="l_livres"><xsl:apply-templates mode="livres"/></div>
</xsl:template>

<xsl:template match="LIVRE|livre">
<div class="l_livre"><xsl:apply-templates mode="livres"/></div>
</xsl:template>

<xsl:template match="TITRE|titre" mode="livres">
<p class="l_titre"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="REFERENCE|reference" mode="livres">
<p class="l_reference"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="AUTEURS|auteurs" mode="livres">
<div class="l_auteurs"><xsl:apply-templates mode="livres"/></div>
</xsl:template>

<xsl:template match="AUTEUR|auteur" mode="livres">
<p class="l_auteur"><xsl:apply-templates/></p>
</xsl:template>
<!-- ML ++++++++++++++++++++++++++++++++++++++++++++++ -->

<!-- TEXTE -->

<xsl:template match="TEXTE|texte"><xsl:apply-templates/></xsl:template>

<xsl:template match="INTERTITRE|intertitre|INT|int">
  <xsl:variable name="level" select="count(ancestor-or-self::INTERTITRE|ancestor-or-self::intertitre|ancestor-or-self::INT|ancestor-or-self::int) + 1"/>

<xsl:element name="h{$level}"><xsl:apply-templates/></xsl:element>
</xsl:template>

<xsl:template match="P|p">
<p><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="REFERENCE|reference">
<p class="reference"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="AUTEUR|auteur">
<p class="auteur"><xsl:apply-templates/></p>
</xsl:template>


<!-- SIGNATURE + QUALITE -->
<!-- conflit avec Histoire : ELEMENT SIGNATURE (#PCDATA) -->
<xsl:template match="SIGNATURE|signature">
<div class="signature"><xsl:apply-templates mode="signature"/></div>
</xsl:template>

<xsl:template match="REDACTEUR|redacteur">
<p class="redacteur"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="QUALITE|qualite" mode="signature">
<p class="s_qualite"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="AUTEUR|auteur" mode="signature">
<p class="s_auteur"><xsl:apply-templates/></p>
</xsl:template>


<!-- NOTES -->

<xsl:template match="NOTE|note|NOTES|notes">
<div class="note"><xsl:apply-templates select="P|p" mode="note"/></div>
</xsl:template>

<xsl:template match="P|p" mode="note">
<p><xsl:apply-templates/></p>
</xsl:template>


<!-- ENCADRE -->

<xsl:template match="ENCADRE|encadre">
<div class="encadre"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="ENCSURTITRE|encsurtitre|SURTITRENC|surtitrenc|SURTENC|surtenc">
<p class="encsurtitre"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="ENCTITRE|enctitre|TITRENC|titrenc">
<p class="enctitre"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="ENCCHAPO|encchapo|CHAPENC|chapenc">
<p class="encchapo"><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="ENCTEXTE|enctexte|TEXTENC|textenc">
<div class="enctexte"><xsl:apply-templates/></div>
</xsl:template>


<!--  INFOAUTEUR -->

<xsl:template match="FULLTEXT|fulltext">
<span class="fulltext"><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="INFOAUTEUR|infoauteur">
<div class="infoauteur"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="INFOAUT|infoaut">
<p class="infoaut"><xsl:apply-templates/></p>
</xsl:template>


<!-- COMMUN -->

<xsl:template match="BR|br"><br/></xsl:template>
<xsl:template match="B|b|STRONG|strong"><b><xsl:apply-templates/></b></xsl:template>
<xsl:template match="I|i"><i><xsl:apply-templates/></i></xsl:template>
<xsl:template match="EM|em"><em><xsl:apply-templates/></em></xsl:template>
<xsl:template match="SUP|sup"><sup><xsl:apply-templates/></sup></xsl:template>
<xsl:template match="SUB|sub"><sub><xsl:apply-templates/></sub></xsl:template>
<xsl:template match="SPAN|span"><span style="{@style}"><xsl:apply-templates/></span></xsl:template>
<xsl:template match="WEB|web">
<xsl:variable name="txt"><xsl:copy-of select="current()"/></xsl:variable>
<a href="{$txt}"><xsl:apply-templates/></a>
</xsl:template>

<xsl:template match="ADRESSEWE|adresseweb">
<div class="adresseweb"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="PDF|pdf">
<a class="pdf" href="{@SRC}">PDF : <xsl:apply-templates/></a>
</xsl:template>

</xsl:stylesheet>
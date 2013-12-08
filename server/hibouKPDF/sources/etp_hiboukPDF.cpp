/****************************************************************************
**
****************************************************************************/

#include "etp_hiboukPDF.h"

#include <iostream>
#include <fstream>

HiboukPDF::HiboukPDF(): QObject()
{
    connect(&m_page, SIGNAL(javaScriptWindowObjectCleared()), this, SLOT(attachObject()) );
    attachObject();
}

void HiboukPDF::attachObject()
{
    m_page.mainFrame()->addToJavaScriptWindowObject( QString("HiboukPDF"), this );
}

void HiboukPDF::load(const QUrl &url, const QString &dirSave)
{
    std::cout << "Loading " << qPrintable(url.toString()) << std::endl;

    m_dirSave = dirSave;

    m_page.mainFrame()->load(url);
    m_page.settings()->setAttribute(QWebSettings::LocalContentCanAccessRemoteUrls,true);
    m_page.settings()->setAttribute(QWebSettings::LocalContentCanAccessFileUrls,true);
    m_page.mainFrame()->setZoomFactor(1);
    m_page.mainFrame()->setScrollBarPolicy(Qt::Vertical, Qt::ScrollBarAlwaysOff);
    m_page.mainFrame()->setScrollBarPolicy(Qt::Horizontal, Qt::ScrollBarAlwaysOff);
}

void HiboukPDF::toPDF(const qreal &width, const qreal &height, const QString &fileOut)
{
    saveFrame(m_page.mainFrame(), width, height, fileOut);
    emit finished();
}

void HiboukPDF::saveFile(const QString &content, const QString &name)
{
    std::ofstream file;
    file.open (qPrintable(m_dirSave+name));
    file << qPrintable(content);
    file.close();
    std::cout << "Save File : " << qPrintable(name) << std::endl;
}

void HiboukPDF::debug(const QString &msg)
{
    std::cout << "Save File : " << qPrintable(msg) << std::endl;
}

void HiboukPDF::saveFrame(QWebFrame *frame,const qreal &width, const qreal &height, const QString &fileOut)
{
    QString fileName(m_dirSave+fileOut+".pdf");
    QPrinter printer;

    const QSizeF _size(width,height);
    printer.setPaperSize(_size, QPrinter::Millimeter);
    printer.setPrinterName("HiboukPDF");
    //printer.setDocName("Document");

    qreal marginLeft = 0;
    qreal marginTop = 0;
    qreal marginRight = 0;
    qreal marginBottom = 0;

    printer.setPageMargins(marginLeft, marginTop, marginRight, marginBottom, QPrinter::Point);
    printer.setFullPage(true);
    printer.setOutputFormat(QPrinter::PdfFormat);
    printer.setResolution(300);
    printer.setOutputFileName(fileName);
    frame->print(&printer);
}

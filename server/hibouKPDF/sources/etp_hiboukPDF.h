/****************************************************************************
**
****************************************************************************/

#ifndef HIBOUKPDF_H
#define HIBOUKPDF_H

#include <QtWebKitWidgets>
#include <QWebSettings>

class HiboukPDF : public QObject
{
    Q_OBJECT

public:
    HiboukPDF();
    void load(const QUrl &url, const QString &dirSave);

signals:
    void finished();

private slots:
    void attachObject();

public slots:
    void toPDF(const qreal &width, const qreal &height, const QString &fileOut);
    void saveFile(const QString &content, const QString &name);
    void debug(const QString &msg);

private:
    QWebPage m_page;
    QString m_dirSave;

    void saveFrame(QWebFrame *frame, const qreal &width, const qreal &height, const QString &fileOut);
};

#endif

/****************************************************************************
**
****************************************************************************/

#include "etp_hiboukPDF.h"

#include <iostream>
#include <QApplication>
#include <QtWebKit>
#include <QtGui>
#include <QtWidgets>
#include <QPrinter>


int main(int argc, char * argv[])
{
    if (argc != 3) {
        std::cout << "  hiboukPDF <url> <dirSave>" << std::endl;
        std::cout << std::endl;
        std::cout << "Notes:" << std::endl;
        std::cout << "  'url' is the URL of the web page" << std::endl;
        std::cout << "  'dirSave' is the backup directory" << std::endl;
        std::cout << std::endl;
        return 0;
    }

    QUrl url = QUrl::fromUserInput(QString::fromLatin1(argv[1]));
    QString dirSave = QString::fromLatin1(argv[2]);

    QApplication a(argc, argv);
    HiboukPDF capture;
    QObject::connect(&capture, SIGNAL(finished()), QApplication::instance(), SLOT(quit()));
    capture.load(url, dirSave);

    return a.exec();
}

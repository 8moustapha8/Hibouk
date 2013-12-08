<?php

/**
 * @package Gallina °)>
 * @subpackage core (_g)
 * @author David Dauvergne
 * @licence GNU Lesser General Public Licence see LICENCE file or http://www.gnu.org/licenses/lgpl.html
 */

// séparateur de répertoires simplifiés
define('DS',DIRECTORY_SEPARATOR);

// définition de l'adresse de base
define('GALLINA_ROOT',dirname(__file__).DS);

// nom du dossier server
define('GALLINA_DIRNAME_SERVER','server');

// nom du dossier de config
define('GALLINA_DIRNAME_CONFIG','config');

// nom du dossier de templates
define('GALLINA_DIRNAME_TPL','templates');

// adresse du dossier de server
define('GALLINA_DIR_SERVER',GALLINA_ROOT.GALLINA_DIRNAME_SERVER.DS);

// adresse du dossier de config
define('GALLINA_DIR_CONFIG',GALLINA_DIR_SERVER.GALLINA_DIRNAME_CONFIG.DS);

// adresse du dossier des templates
define('GALLINA_DIR_TPL',GALLINA_DIR_SERVER.GALLINA_DIRNAME_TPL.DS);

// retour chariot
define('N',PHP_EOL);

// nom du dossier de log
define('GALLINA_DIRNAME_LOG','log');

// nom du fichier de debug
define('GALLINA_FILENAME_DEBUG','debug');

// Adresse du fichier html de débugage
define('GALLINA_FILE_DEBUG',GALLINA_DIR_SERVER.DS.GALLINA_DIRNAME_LOG.DS.GALLINA_FILENAME_DEBUG.'.html');

define('GALLINA_FILE_DEBUGR',GALLINA_DIRNAME_SERVER.'/'.GALLINA_DIRNAME_LOG.'/'.GALLINA_FILENAME_DEBUG.'.html');

// Nom du fichier des erreurs PHP
define('GALLINA_FILENAME_DEBUGPHP','errorphp.html');

// Adresse du fichier des erreurs PHP
define('GALLINA_FILE_DEBUGPHP',GALLINA_DIR_SERVER.DS.GALLINA_DIRNAME_LOG.DS.GALLINA_FILENAME_DEBUGPHP);

// Adresse du fichier des erreurs PHP
define('GALLINA_FILE_LOG',GALLINA_DIR_SERVER.DS.GALLINA_DIRNAME_LOG.DS.'log.txt');

// nom du dossier de cache
define('GALLINA_DIRNAME_CACHE','cache');

// adresse du dossier de cache
define('GALLINA_DIR_CACHE',GALLINA_DIR_SERVER.GALLINA_DIRNAME_CACHE.DS);

// Autoloader
require_once(GALLINA_DIR_SERVER.DS.'core'.DS.'g_autoloader.php');
g_autoloader::instance(GALLINA_DIR_CACHE)->addDirectory(GALLINA_DIR_SERVER)->register();

// initialisation des préférences utilisateur
g_configUSER::load();

// initialisation des préférences DB
g_configDB::load();

// initialisation des préférences de lappli
g_configAPPLI::load();

// initialisation des préférences globales
require_once(GALLINA_DIR_CONFIG.'g_conf.php');

// initialisation du core
g_core::Init();

?>
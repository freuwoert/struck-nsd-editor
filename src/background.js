'use strict'

import { app, protocol, BrowserWindow, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { autoUpdater } from 'electron-updater'
import { ipcMain } from 'electron'
import path from 'path'
import log from 'electron-log'
const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow
let gotTheLock = app.requestSingleInstanceLock()



protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

if ( !gotTheLock )
{
    app.quit()
}
else
{
    app.on('second-instance', (event, commandLine, workingDirectory) => {

        mainWindow.webContents.send('open-on-startup', {
            path: commandLine[3]
        })

        // Refocuses the window
        if (mainWindow)
        {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })



    app.on('ready', async () => {

        if (isDevelopment && !process.env.IS_TEST)
        {
            BrowserWindow.addDevToolsExtension('node_modules/vue-devtools/vender')
            require('vue-devtools').install()
        }

        createWindow()
    })
    
    app.on('window-all-closed', () => {
        if( process.platform !== 'darwin' ) app.quit()
    })
    
    app.on('activate', () => {
        if( mainWindow === null ) createWindow()
    })
}



let createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        frame: false,
        icon: path.join(__static, 'icon.png'),
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    } else {
        createProtocol('app')
        mainWindow.loadURL('app://./index.html')
    }

    mainWindow.maximize()
    mainWindow.setTitle('Struck Editor')
    mainWindow.on('closed', () => { mainWindow = null })

    if (isDevelopment && !process.env.IS_TEST)
    {
        globalShortcut.register('f5', () => {
            mainWindow.reload()
        })
    }
}



/*
 *  Before I forget it again: YOU have to trigger "loaded" from the renderer
 *  Geez ._.
 */

ipcMain.on('loaded', (event) => {

    mainWindow.webContents.send('open-on-startup', {
        path: process.argv[1]
    })

    autoUpdater.on('error', function (err) {
        mainWindow.webContents.send('update-error', {
            error: JSON.stringify(err)
        })
    })

    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('checking-for-update')
    })

    autoUpdater.on('update-available', function (info) {
        mainWindow.webContents.send('update-available', {
            version: JSON.stringify(info.version)
        })
    })

    autoUpdater.on('update-not-available', function () {
        mainWindow.webContents.send('update-not-available')
    })

    autoUpdater.on('update-downloaded', function () {
        mainWindow.webContents.send('update-downloaded')
    })

    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'

    log.info('App starting...')

    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify()
    }, 3000)

})
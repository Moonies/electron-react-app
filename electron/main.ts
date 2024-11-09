import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },

    // autoHideMenuBar: true,
    resizable: true,
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    // mainWindow.webContents.openDevTools()
    // mainWindow.removeMenu()
  } else {
    // mainWindow.webContents.openDevTools()
    // mainWindow.removeMenu()
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created', (e, win) => {
  win.removeMenu()
  win.resizable = false
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('close-app', () => {
  app.quit()
})

// List of all options at -
// https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback
const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer',
}

ipcMain.handle('printComponent', (event, url) => {
  let win = new BrowserWindow({ show: false })
  win.loadURL(url)

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOptions, (success, failureReason) => {
      console.log('Print Initiated in Main...')
      if (!success) console.log(failureReason)
    })
  })
  return 'done in main'
})

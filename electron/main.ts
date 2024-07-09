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
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
    mainWindow.removeMenu()
  } else {
    mainWindow.removeMenu()
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

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('close-app', () => {
  app.quit()
})
// Auto-updater events
autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available. Do you want to update now?',
      buttons: ['Yes', 'No'],
    })
    .then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
})

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Install and restart now?',
      buttons: ['Yes', 'Later'],
    })
    .then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(false, true)
      }
    })
})

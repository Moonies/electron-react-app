"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var url = __importStar(require("url"));
var electron_updater_1 = require("electron-updater");
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        // autoHideMenuBar: true,
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
        mainWindow.removeMenu();
    }
    else {
        mainWindow.removeMenu();
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    // Check for updates
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
// Auto-updater events
electron_updater_1.autoUpdater.on('update-available', function () {
    electron_1.dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version of the app is available. Do you want to update now?',
        buttons: ['Yes', 'No']
    }).then(function (result) {
        if (result.response === 0) {
            electron_updater_1.autoUpdater.downloadUpdate();
        }
    });
});
electron_updater_1.autoUpdater.on('update-downloaded', function () {
    electron_1.dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Install and restart now?',
        buttons: ['Yes', 'Later']
    }).then(function (result) {
        if (result.response === 0) {
            electron_updater_1.autoUpdater.quitAndInstall(false, true);
        }
    });
});
//# sourceMappingURL=main.js.map
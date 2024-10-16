interface ElectronBridge {
  closeApp: () => void
  isElectron: boolean
}

const isElectron = () => {
  return !!(typeof process !== 'undefined' && process.versions && process.versions.electron)
}

const electronBridge: ElectronBridge = {
  closeApp: () => {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      // We're in Electron
      ipcRenderer.send('close-app', [])
    } else {
      window.close()
      //   // we can redirect to a blank page
      if (!window.closed) {
        window.location.href = 'about:blank'
      }
    }
  },
  isElectron: isElectron(),
}

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void
      }
    }
  }
}

export default electronBridge

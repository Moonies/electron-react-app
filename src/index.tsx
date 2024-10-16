import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import electronBridge from './electronBridge'

console.log('React app is initializing')
const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

// Electron integration
// declare global {
//   interface Window {
//     require: (module: string) => any
//   }
// }

// const electron = window.require('electron')
// const ipcRenderer = electron.ipcRenderer

// Expose electron to the window object
// ;(window as any).electron = {
//   closeApp: () => ipcRenderer.send('close-app'),
// }

;(window as any).electronBridge = electronBridge

root.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
console.log('React app has rendered')

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'

console.log('React app is initializing')
const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

root.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
console.log('React app has rendered')

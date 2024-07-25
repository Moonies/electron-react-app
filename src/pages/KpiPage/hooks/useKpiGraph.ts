import Chart, { DataPoint } from 'components/Chart'
import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

interface CustomWindowProps {
  content: React.ReactNode
}

interface ChartComponentProps {
  data: DataPoint[]
}

export default function useKpiGrpah() {
  const newWindowRef = useRef<Window | null>(null)

  const openWindow = useCallback(
    <T extends Record<string, unknown>>(Component: React.ComponentType<T>, props: T) => {
      const newWindow = window.open('', '_blank', 'width=800,height=500,menubar=no')

      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Chart Window</title>
            </head>
            <body>
              <div id="root"></div>
              <script>
                const rootElement = document.getElementById('root');
                const observer = new ResizeObserver(() => {
                  window.resizeTo(
                    rootElement.offsetWidth + 40,
                    rootElement.offsetHeight + 40}
                  );
                });
                observer.observe(rootElement);
              });
                window.addEventListener('beforeunload', () => {
                  // Attempt to cleanup ResizeObserver
                  if (window.ResizeObserver) {
                    window.ResizeObserver.prototype.disconnect = () => {};
                    window.ResizeObserver.prototype.observe = () => {};
                    window.ResizeObserver.prototype.unobserve = () => {};
                  }
                });
               
              </script>
            </body>
          </html>`)
        newWindow.document.close()

        const root = ReactDOM.createRoot(newWindow.document.getElementById('root')!)
        root.render(React.createElement(Component, props))

        // Cleanup function
        const cleanup = () => {
          root.unmount()
          newWindow.close()
        }

        // Add cleanup to both parent and child window
        window.addEventListener('beforeunload', cleanup)
        newWindow.addEventListener('beforeunload', cleanup)

        // Return cleanup function in case you want to close programmatically
        return cleanup
      }
    },
    []
  )

  return { openWindow }
}

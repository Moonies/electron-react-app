import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './components/Header'
import DashboardPage from './pages/DashboardPage'
import SideMenu from './components/SideMenu'
import SalePage from './pages/SalePage'
import KpiPage from './pages/KpiPage'
import { Box } from '@mui/system'
import theme from './styles/theme'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import LoginModal from 'components/Modals/loginModal'
import LoadingOverlay from 'components/LoadingOverlay'
import useLoadingRedux from './hooks/useLoading'
import Notification from 'components/Notification'
import { Toolbar } from '@mui/material'

//now recharts and not implement in react ^18.x.x use disable default props just only recharts
const error = console.error
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const { isLoading } = useLoadingRedux()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoginOpen(true)
    }
  }, [isAuthenticated])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display={'flex'} flex={1} minHeight={'100vh'}>
          <Header />
          <SideMenu />
          <Box
            component={'main'}
            sx={{ backgroundColor: theme => theme.palette.secondary.Main }}
            flexGrow={1}
          >
            <Toolbar />
            <Routes>
              <Route path='/' element={<DashboardPage />} />
              <Route path='/sales' element={<SalePage />} />
              {/* <Route path="/orders" element={<OrderPage />} /> */}
              {/* <Route path="/store" element={<StorePage />} /> */}
              <Route path='/kpi' element={<KpiPage />} />
              {/* <Route path="/reports" element={<ReportPage />} /> */}
              {/* <Route path="/products" element={<ProductPage />} /> */}
              {/* <Route path="/settings" element={<SettingPage />} /> */}
            </Routes>
          </Box>
        </Box>
        <LoginModal
          open={loginOpen}
          onClose={() => {
            //exit programe etc.
            if (window.Electron) {
              const { ipcRenderer } = window.require('electron')
              // We're in Electron
              ipcRenderer.send('close', [])
            } else {
              // We're in a web browser
              window.close()
              // If window.close() doesn't work (it often doesn't in modern browsers),
              // we can redirect to a blank page
              if (!window.closed) {
                window.location.href = 'about:blank'
              }
            }
            // setLoginOpen(false)
          }}
          onSuccess={() => setLoginOpen(false)}
        />
        <LoadingOverlay open={isLoading} />
        <Notification />
      </Router>
    </ThemeProvider>
  )
}

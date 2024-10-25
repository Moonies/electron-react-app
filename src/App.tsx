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
import LoginModal from 'components/Modals/LoginModal'
import LoadingOverlay from 'components/LoadingOverlay'
import useLoadingRedux from './hooks/useLoading'
import Notification from 'components/Notification'
import { Toolbar } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ConfirmModalProvider } from 'components/Modals/ConfirmModal'
import ProductPage from 'pages/ProductPage'
import ReportPage from 'pages/ReportPage'
import AccountManagementPage from 'pages/SettingPage/pages/AccountManagementPage'
import MyCompanyManagementPage from 'pages/SettingPage/pages/MyCompanyManagementPage'
import CustomerManagementPage from 'pages/SettingPage/pages/CustomerManagementPage'
import SupplierManagementPage from 'pages/SettingPage/pages/SupplierManagementPage'
import ComponentManagementPage from 'pages/ComponentPage'
import IpSettingModal from 'components/Modals/IpSettingModal'
import useApiConfig from 'hooks/useApiConfig'
import IpConfigManegementPage from 'pages/SettingPage/pages/IpConfigManagementPage'
import PurchasePage from 'pages/PurchasePage'
import OrderPage from 'pages/OrderPage'
import electronBridge from './electronBridge'
//now recharts and not implement in react ^18.x.x use disable default props just only recharts
const error = console.error
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

interface ApiConfig {
  baseUrl: string
  // apiKey?: string
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  //default is false when have a token or time limit should be change in store.
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const { isLoading } = useLoadingRedux()
  const [apiConfigModal, setApiConfigmodal] = useState<boolean>(false)
  const { loadConfig, isConfigSet } = useApiConfig()
  const [loginSuccess, setLoginSuccess] = useState(false)
  useEffect(() => {
    const configLoaded = loadConfig()
    if (!configLoaded) {
      setApiConfigmodal(true)
    } else {
      // console.log(isAuthenticated)
      setLoginOpen(true)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('user')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const handleCloseApiConfig = () => {
    setApiConfigmodal(false)
    // check connection or something
    if (!isAuthenticated) {
      setLoginOpen(true)
    }
  }

  const handleError = (errorCase: string) => {
    switch (errorCase) {
      case 'baseUrl':
        setLoginOpen(false)
        setApiConfigmodal(true)
        break

      default:
        null
        break
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Box display={'flex'} flex={1} minHeight={'100vh'}>
            <ConfirmModalProvider>
              <Header loginStatus={loginSuccess} />
              <SideMenu />
              <Box
                component={'main'}
                sx={{ backgroundColor: theme => theme.palette.secondary.Main }}
                flexGrow={1}
                display={'flex'}
                flexDirection={'column'}
                overflow={'hidden'}
              >
                <Toolbar />
                <Routes>
                  <Route path='/' element={<DashboardPage />} />
                  <Route path='/sales' element={<SalePage />} />
                  <Route path='/orders' element={<OrderPage />} />
                  <Route path='/purchase' element={<PurchasePage />} />
                  <Route path='/kpi' element={<KpiPage />} />
                  <Route path='/reports' element={<ReportPage />} />
                  <Route path='/products' element={<ProductPage />} />
                  <Route path='/component' element={<ComponentManagementPage />} />
                  <Route path='/settings/account' element={<AccountManagementPage />} />
                  <Route path='/settings/mycompany' element={<MyCompanyManagementPage />} />
                  <Route path='/settings/customer' element={<CustomerManagementPage />} />
                  <Route path='/settings/supplier' element={<SupplierManagementPage />} />
                  <Route path='/settings/server' element={<IpConfigManegementPage />} />

                  {/* <Route path="/settings" element={<SettingPage />} /> */}
                </Routes>
              </Box>
              <LoginModal
                open={loginOpen}
                onClose={() => {
                  //exit programe etc.
                  electronBridge.closeApp()
                }}
                onError={handleError}
                //when success is keep user to local storage
                onSuccess={() => {
                  setLoginOpen(false)
                  setLoginSuccess(true)
                }}
              />
              <IpSettingModal open={apiConfigModal} onClose={() => handleCloseApiConfig()} />
              <LoadingOverlay open={isLoading} />
              <Notification />
            </ConfirmModalProvider>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

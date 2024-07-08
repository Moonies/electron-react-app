import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './components/Header'
import DashboardPage from './pages/DashboardPage'
import { Main } from './styles/appStyle'
import SideMenu from './components/SideMenu'
import SalePage from './pages/SalePage'
import KpiPage from './pages/KpiPage'
import { Box } from '@mui/system'
import theme from './styles/theme'
import LoginForm from './pages/LoginPage'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

//now recharts and not implement in react ^18.x.x use disable default props just only recharts
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};


export default function App() {

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display={'flex'} flex={1} minHeight={"100vh"}>
          <Header />
          <SideMenu />
          <Main sx={{ backgroundColor: (theme) => theme.palette.secondary.Main }}>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/sales" element={<SalePage />} />
              {/* <Route path="/orders" element={<OrderPage />} />
                <Route path="/store" element={<StorePage />} /> */}
              <Route path="/kpi" element={<KpiPage />} />
              {/* <Route path="/reports" element={<ReportPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/settings" element={<SettingPage />} /> */}
            </Routes>
          </Main>
        </Box>
      </Router>
    </ThemeProvider>

  );
};
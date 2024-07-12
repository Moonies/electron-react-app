import { ThemeOptions, createTheme } from '@mui/material/styles'
import { jaJP } from '@mui/material/locale'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9e9e9e',
    },
    background: {
      default: '#404040',
      paper: '#303030',
    },
    text: {
      secondary: '#ffffff',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem',
          outline: 2,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#404040',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px !important',
          margin: '16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: '#404040',
        },
      },
    },
  },
  typography: {
    // fontFamily: 'monospace',
  },
}
const theme = createTheme(themeOptions, jaJP)

export default theme

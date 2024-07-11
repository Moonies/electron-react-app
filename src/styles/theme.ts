import { ThemeOptions, createTheme } from '@mui/material/styles'
import { jaJP } from '@mui/material/locale'
import { red } from '@mui/material/colors'

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
    MuiDialogTitle: {
      variants: [{ props: { security: 'error' }, style: { backgroundColor: red[700] } }],
      styleOverrides: {},
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: '#404040',
        },
      },
    },
  },
}
const theme = createTheme(themeOptions, jaJP)

export default theme

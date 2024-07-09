import { ThemeOptions, createTheme } from '@mui/material/styles'

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
}
const theme = createTheme(themeOptions)

export default theme

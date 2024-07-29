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
    MuiInputBase: {
      defaultProps: {
        sx: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: props => ({
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: props.theme.palette.info.light,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
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
    MuiDivider: {
      styleOverrides: {
        root: props => ({
          borderColor: props.theme.palette.primary.dark,
          '&::before': {
            borderTop: `thin solid ${theme?.palette.primary.dark}`,
          },
          '&::after': {
            borderTop: `thin solid ${theme?.palette.primary.dark}`,
          },
        }),
      },
    },
  },
}
const theme = createTheme(themeOptions, jaJP)

export default theme

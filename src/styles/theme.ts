import { ThemeOptions, createTheme } from '@mui/material/styles';
import { minHeight } from '@mui/system';
import { amber, deepOrange, grey, red } from '@mui/material/colors';

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
};
const theme = createTheme(themeOptions);

export default theme;

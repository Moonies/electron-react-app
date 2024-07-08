import { CssBaselineProps, Theme } from '@mui/material';
import { Box, styled } from '@mui/system';

const Main = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  flexGrow: 1,
  display: 'flex'
  // minHeight: 36,
  // '@media (min-width:0px) and (orientation: landscape)': {
  //     minHeight: 24
  // },
  // '@media (min-width:600px)': {
  //     minHeight: 48
  // }
  // offset: offsetAppbar
  // justifyContent: 'flex-start',
  // alignItems: 'center',

  // minHeight: '100vh',

}));


export { Main };
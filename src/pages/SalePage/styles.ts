import { styled, alpha } from '@mui/material/styles'
import { Button, Divider, Box } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

const StyledDivider = styled(Divider)(({ theme }) => ({
  '&.MuiDivider-root': {
    borderColor: theme.palette.primary.dark,
    '&::before': {
      borderTop: `thin solid ${theme?.palette.primary.dark}`,
    },
    '&::after': {
      borderTop: `thin solid ${theme?.palette.primary.dark}`,
    },
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  // height: 27, // Approximately 36px
  // minWidth: 'unset',
  // padding: '4.5pt 12pt', // Approximately 6px 16px
  width: '120pt',
  justifyContent: 'flex-start',
  fontcolor: '#fffff',
  '&.MuiButton-root': {
    color: '#ffffff',
  },
}))
export { StyledDivider, StyledButton }

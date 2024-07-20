import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  // height: 27, // Approximately 36px
  // minWidth: 'unset',
  // padding: '4.5pt 12pt', // Approximately 6px 16px
  width: '128pt',
  justifyContent: 'flex-start',
  whiteSpace: 'nowrap',
  fontcolor: '#fffff',
  '&.MuiButton-root': {
    color: '#ffffff',
  },
}))
export { StyledButton }

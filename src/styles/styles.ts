import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  // height: 27, // Approximately 36px
  // minWidth: 'unset',
  // padding: '4.5pt 12pt', // Approximately 6px 16px
  width: '128pt',
  justifyContent: 'flex-start',
  whiteSpace: 'nowrap',
  fontcolor: '#ffffff',
  '&.MuiButton-root': {
    color: '#ffffff',
  },
}))

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export { StyledButton, VisuallyHiddenInput }

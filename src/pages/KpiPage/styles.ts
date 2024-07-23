import { styled, alpha } from '@mui/material/styles'
import { Box, Card, CardContent } from '@mui/material'

const StyledCard = styled(Card)(({ theme }) => ({
  width: '25%',
  display: 'flex',
  flexDirection: 'column',
  border: 2,
  borderStyle: 'solid',
  borderColor: theme.palette.info.dark,
}))

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  overflow: 'auto',
  flexDirection: 'column',
  height: 400,
  flexGrow: 1,
}))

export { StyledCard, StyledCardContent }

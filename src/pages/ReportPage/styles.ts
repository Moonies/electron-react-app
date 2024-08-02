import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

const StyledCard = styled(Card)(({ theme }) => ({
  width: '20%',
  border: 1,
  borderStyle: 'solid',
}))

export { StyledCard }

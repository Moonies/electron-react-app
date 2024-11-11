import React, { useMemo } from 'react'
import { Typography, Box } from '@mui/material'
import {
  gridColumnFieldsSelector,
  GridFooterContainer,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'
import { formatJPY } from 'utils/formatUtils'

const CustomFooter: React.FC = () => {
  const apiRef = useGridApiContext()
  const rowCount = useGridSelector(apiRef, gridRowCountSelector)
  const columnFields = useGridSelector(apiRef, gridColumnFieldsSelector)

  const totalPrice = useMemo(() => {
    const rows = apiRef.current.getRowModels()
    return Array.from(rows.values()).reduce((sum, row) => {
      const rowTotalPrice = row.quantity * row.productPrice
      return sum + rowTotalPrice
    }, 0)
  }, [apiRef, rowCount, columnFields])

  return (
    <GridFooterContainer>
      <Box
        sx={{
          paddingRight: 15,
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Typography variant='subtitle1'>合計　: {formatJPY(totalPrice)}</Typography>
      </Box>
    </GridFooterContainer>
  )
}

export default CustomFooter

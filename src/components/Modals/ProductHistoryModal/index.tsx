import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Description as MemoIcon } from '@mui/icons-material'
// import { ComponentData, PurchaseOrderDetail } from 'api/component/getComponentPurchaseHistory'
import { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { GridActionsCellItem, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import ViewMemoDialog from 'components/Dialogs/ViewMemoDialog'
import useProductHistory from './hooks/useProductHistory'
import { OrderHistory } from 'api/product/getProductOrderHistory'

export type ProductHistoryData = {
  id: string
  productNumber: string
  productName: string
  orderHistoryList: OrderHistory[]
}

interface ComponentManagementModalProps {
  open: boolean
  onClose: () => void
  initialData: ProductHistoryData
}

export default function ProductHistoryModal({
  open,
  onClose,
  initialData,
}: ComponentManagementModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const componentDataGridRef = useGridApiRef()
  const { columns, paginationModel, handlePaginationModelChange } = useProductHistory()
  const [selectedMemo, setSelctedMemo] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const viewMemo = useCallback((memo: string) => {
    setSelctedMemo(memo)
    setOpenDialog(true)
  }, [])

  const updatedColumns = columns.map(column => {
    if (column.field === 'actions') {
      return {
        ...column,
        getActions: (params: any) => {
          const hasMemo = params.row.memo

          if (hasMemo) {
            return [
              <GridActionsCellItem
                icon={<MemoIcon />}
                label='Memo'
                className='textPrimary'
                onClick={() => viewMemo(hasMemo)}
                color='inherit'
              />,
            ]
          }
          return []
        },
      }
    }
    return column
  })

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth='xl'
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>部品歴史</Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='部品番号'
              value={formData.productNumber}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}
            />
            <TextField
              label='部品名'
              value={formData.productName}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box p={2}>
            <Typography variant='h5' noWrap>
              <Divider textAlign='left'>発注歴史</Divider>
            </Typography>
          </Box>
          <DataTable
            data={formData.orderHistoryList}
            columns={updatedColumns}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            apiref={componentDataGridRef}
            // getRowId={row => row.orderId}
            onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          />
          {openDialog && (
            <ViewMemoDialog
              message={selectedMemo}
              onClose={() => setOpenDialog(false)}
              open={openDialog}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

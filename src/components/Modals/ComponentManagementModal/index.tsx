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
import { ComponentData, PurchaseOrderDetail } from 'api/component/getComponentDetail'
import { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { GridActionsCellItem, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import useComponent from './hooks/useComponent'
import ViewMemoDialog from 'components/Dialogs/ViewMemoDialog'
export type ComponentDetail = {
  id: string
  componentNumber: string
  componentName: string
  lastestPriceDate: string | Dayjs
  price: number
  inStock: number
  purchaseOrderList: PurchaseOrderDetail[]
}
interface ComponentManagementModalProps {
  open: boolean
  onClose: () => void
  initialData: ComponentDetail
}

export default function ComponentManagementModal({
  open,
  onClose,
  initialData,
}: ComponentManagementModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const componentDataGridRef = useGridApiRef()
  const { columns, paginationModel, handlePaginationModelChange } = useComponent()
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
          <Typography variant='h6'>部品詳細</Typography>
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
              value={formData.componentNumber}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}
              // sx={{ flex: 1 }}
            />
            <TextField
              label='部品名'
              value={formData.componentName}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}
              // sx={{ flex: 1 }}
            />
            <TextField
              label='単価'
              value={formData.price}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}

              // sx={{ flex: 1 }}
            />
            <TextField
              label='在庫数'
              value={formData.inStock}
              fullWidth
              margin='normal'
              inputProps={{ readOnly: true }}

              // sx={{ flex: 1 }}
            />
          </Box>
          <Box p={2}>
            <Typography variant='h5' noWrap>
              <Divider textAlign='left'>購入歴</Divider>
            </Typography>
          </Box>
          <DataTable
            data={formData.purchaseOrderList}
            columns={updatedColumns}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            apiref={componentDataGridRef}
            getRowId={row => row.orderId}
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

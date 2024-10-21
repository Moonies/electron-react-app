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
  DialogActions,
  Button,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Description as MemoIcon } from '@mui/icons-material'
import { PurchaseOrderHistory } from 'api/component/getComponentPurchaseHistory'
import { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { GridActionsCellItem, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import useComponent from './hooks/useComponent'
import ViewMemoDialog from 'components/Dialogs/ViewMemoDialog'
import NumericFormatCustom from 'components/NumericFormat'

export type ComponentDetail = {
  id: string
  componentNumber: string
  componentName: string
  // lastestPriceDate: string | Dayjs
  price: number
  inStock: number
  purchaseOrderList?: PurchaseOrderHistory[]
}

export type NewComponent = {
  id?: string
  name: string
  number: string
  price: number
  // inStock:number
}
interface ComponentManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: NewComponent) => Promise<void>
  initialData?: ComponentDetail
  modalMode: 'add' | 'edit' | 'view'
}

const defaultData = {
  id: '',
  componentNumber: '',
  componentName: '',
  lastestPriceDate: '',
  price: 0,
  inStock: 0,
  purchaseOrderList: [],
}
export default function ComponentManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  modalMode,
}: ComponentManagementModalProps) {
  const [formData, setFormData] = useState<ComponentDetail>(initialData ?? defaultData)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // setLoading(true)
    try {
      let newDataComponent: NewComponent
      if (formData) {
        newDataComponent = {
          name: formData?.componentName,
          number: formData?.componentNumber,
          price: formData?.price,
          id: formData?.id,
        }
        await onConfirm(newDataComponent)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    }
  }

  const handleChange = (field: keyof ComponentDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <TextField
                label='部品番号'
                value={formData?.componentNumber}
                fullWidth
                margin='normal'
                inputProps={{ readOnly: modalMode === 'view' }}
                // sx={{ flex: 1 }}
                onChange={e => handleChange('componentNumber', e.target.value)}
              />
              <TextField
                label='部品名'
                value={formData?.componentName}
                fullWidth
                margin='normal'
                inputProps={{ readOnly: modalMode === 'view' }}
                onChange={e => handleChange('componentName', e.target.value)}

                // sx={{ flex: 1 }}
              />
              <TextField
                label='単価'
                value={formData?.price}
                fullWidth
                margin='normal'
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                  readOnly: modalMode === 'view',
                }}
                onChange={e =>
                  handleChange('price', e.target.value ? parseFloat(e.target.value) : 0)
                }

                // sx={{ flex: 1 }}
              />
              <TextField
                label='在庫数'
                value={formData?.inStock}
                fullWidth
                margin='normal'
                inputProps={{ readOnly: modalMode === 'view' }}
                // onChange={e => handleChange('inStock', e.target.value)}

                // sx={{ flex: 1 }}
              />
            </Box>
            {modalMode === 'view' && (
              <>
                <Box p={2}>
                  <Typography variant='h5' noWrap>
                    <Divider textAlign='left'>購入歴</Divider>
                  </Typography>
                </Box>
                <DataTable
                  data={formData?.purchaseOrderList ?? []}
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
              </>
            )}
          </Box>
        </DialogContent>
        {modalMode !== 'view' && (
          <DialogActions>
            <Button onClick={onClose} variant='contained'>
              キャンセル
            </Button>
            <Button
              type='submit'
              variant='outlined'
              sx={theme => ({
                color: 'white',
              })}
            >
              保存
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  )
}

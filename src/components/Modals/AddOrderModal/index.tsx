import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'

import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { api } from 'api/index'
import { ComponentIdData } from 'api/component/getComponentIdList'
import { OrderData, ProductList } from 'api/order/getOrderList'
import DataTable from 'components/DataTable'
import useAddOrder from './hooks/useAddOrder'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid'
import AddnewProductDialog from 'components/Dialogs/AddNewProductListDialog'
interface Option {
  label: string
  id: number
}
interface PurchaseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: OrderData) => Promise<void>
  initialData?: OrderData
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData: OrderData = {
  id: '',
  orderId: '',
  customerCompanyId: '',
  customerCompanyName: '',
  product: [],
  orderRequestEmployeeName: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  paymentDueDate: dayjs(),
  registDate: dayjs(),
  shippingmentDate: dayjs(),
  status: null,
}
export default function OrderModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  const [formData, setFormData] = useState<OrderData>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [componentIdList, setComponentIdList] = useState<ComponentIdData[]>([])
  // const [newProductListData, setNewProductListData] = useState([])
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const addNewProductDataGridRef = useGridApiRef()

  const {
    columns,
    newProductListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    setRowModesModel,
    setNewProductListData,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    handleAddNewProduct,
  } = useAddOrder()

  useEffect(() => {
    console.log(newProductListData)
  }, [newProductListData])

  const updatedColumns = columns.map(column => {
    if (column.field === 'actions') {
      return {
        ...column,
        getActions: ({ id }: any) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label='Save'
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label='Cancel'
                className='textPrimary'
                onClick={handleCancelClick(id)}
                color='inherit'
              />,
            ]
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              className='textPrimary'
              onClick={handleEditClick(id)}
              color='inherit'
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label='Delete'
              onClick={handleDeleteClick(id)}
              color='inherit'
            />,
          ]
        },
      }
    }
    return column
  })

  const handleChange = (field: keyof OrderData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onConfirm({ ...formData, product: newProductListData as ProductList[] })
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const _mockOption: Option[] = [
    { label: 'aaaaa', id: 1 },
    { label: 'bbdbd', id: 2 },
    { label: 'cdfasd', id: 3 },
    { label: 'qwerty', id: 4 },
    { label: 'asddffg', id: 5 },
    { label: 'minoiui', id: 6 },
  ]

  const statusList = [
    { label: '見積書依頼', value: 'invoice_pending' },
    { label: '配達中', value: 'on_delivery' },
    { label: '入庫済', value: 'delivered' },
    { label: '返品中', value: 'rejected' },
    { label: 'キャンセル', value: 'cancelled' },
  ]
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
      maxWidth='lg'
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {mode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'}
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='登録日付'
              value={dayjs(formData.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='注番'
              value={formData.orderId}
              onChange={e => handleChange('orderId', e.target.value)}
              // fullWidth
              margin='normal'
              sx={{ flex: 1 }}
            />
            <TextField
              label='顧客名称'
              value={formData.customerCompanyName}
              onChange={e => handleChange('customerCompanyName', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='見積書日付'
              value={dayjs(formData.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <DatePicker
              label='出荷日付'
              value={dayjs(formData.shippingmentDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('shippingmentDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <DatePicker
              label='支払期限'
              value={dayjs(formData.paymentDueDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('paymentDueDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='状態'
              value={formData.status ?? ''}
              onChange={e => handleChange('status', e.target.value)}
              margin='normal'
              select
              sx={{ flex: 1 }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {statusList.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Box display={'flex'} alignItems={'end'}>
              <Button
                onClick={() => setOpenDialog(true)}
                variant='outlined'
                sx={theme => ({
                  color: 'white',
                  // height: '50%',
                })}
                // size='small'
              >
                Add Product
              </Button>
            </Box>
            <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ width: '35%' }}
              renderInput={params => <TextField {...params} label='担当者' />}
            />
          </Box>
        </Box>
        <DataTable
          data={newProductListData}
          columns={updatedColumns}
          apiref={addNewProductDataGridRef}
          // getRowId={row => row.productNumber}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          sx={{ height: 300, mt: 2 }}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          // slots={{
          //   toolbar: EditToolbar as GridSlots['toolbar'],
          // }}
          // slotProps={{
          //   toolbar: { setNewProductListData, setRowModesModel, newProductListData },
          // }}
        />
        {openDialog && (
          <AddnewProductDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSubmit={newProduct => {
              setOpenDialog(false)
              handleAddNewProduct(newProduct)
            }}
            // initialData={selectedOrder}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant='contained'
          // sx={theme => ({
          //   color: 'white',
          // })}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant='outlined'
          sx={theme => ({
            color: 'white',
          })}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import { useState, useEffect, useCallback, forwardRef, useMemo } from 'react'
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
  Slide,
} from '@mui/material'

import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material'
import { debounce } from '@mui/material/utils'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { api } from 'api/index'
import { ComponentIdData } from 'api/component/getComponentIdList'
import { OrderData, ProductList } from 'api/order/getOrderList'
import DataTable from 'components/DataTable'
// import useAddOrder from './hooks/useAddOrder'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid'
import useOrderDetail from './hooks/useOrderDetail'
import { TransitionProps } from '@mui/material/transitions'
import AddnewProductDialog from 'components/Dialogs/AddNewProductListDialog'
// import { EditToolbar } from './components/EditToolBar'
// import DialogProduct from './components/DialogProduct'
interface Option {
  label: string
  id: number
}
interface OrderDetailPopupProps {
  open: boolean
  onClose: () => void
  onConfirm: (data?: OrderData) => Promise<void>
  initialData?: OrderData
  mode: 'view' | 'edit'
}

const defaultOrderData: OrderData = {
  id: '',
  orderId: '',
  customerCompanyId: '',
  customerCompanyName: '',
  product: [],
  orderRequestEmployeeName: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: '',
  registDate: '',
  shippingmentDate: '',
  paymentDueDate: '',
  status: null,
}

export default function OrderDetailPopup({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: OrderDetailPopupProps) {
  const [formData, setFormData] = useState(initialData ?? defaultOrderData)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [componentIdList, setComponentIdList] = useState<ComponentIdData[]>([])
  // const [newProductListData, setNewProductListData] = useState([])
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const addNewProductDataGridRef = useGridApiRef()
  const [popupMode, setPopupMode] = useState<'view' | 'edit'>(mode)

  const {
    baseColumns,
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
  } = useOrderDetail(formData)

  // useEffect(() => {
  //   if (mode === 'edit' && initialData) {
  //     setFormData(initialData)
  //   } else {
  //     setFormData(defaultFormData)
  //   }
  // }, [initialData])

  const Transition = useCallback(
    forwardRef(function Transition(
      props: TransitionProps & {
        children: React.ReactElement<any, any>
      },
      ref: React.Ref<unknown>
    ) {
      return <Slide direction='up' ref={ref} {...props} />
    }),
    []
  )

  const updateColumn = baseColumns.map(column => {
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

  const handleChange = (field: keyof OrderData, value: OrderData[keyof OrderData]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // setLoading(true)
    try {
      onConfirm({ ...formData, product: newProductListData as ProductList[] })
      // onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const columnVisibilityModel = useMemo(() => {
    if (popupMode === 'edit') {
      return {
        actions: true,
      }
    }
    return {
      actions: false,
    }
  }, [popupMode])

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
      fullScreen
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {mode === 'view' ? 'OrderDetail' : '編集モーダルウィンドウ'}
          </Typography>
          <Box>
            {popupMode === 'view' && (
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => setPopupMode('edit')}
                aria-label='edit'
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='登録日付'
              value={dayjs(formData?.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
              readOnly={popupMode === 'view'}
            />
            <TextField
              label='注番'
              value={formData?.orderId}
              onChange={e => handleChange('id', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
              InputProps={{
                readOnly: popupMode === 'view',
              }}
            />
            <TextField
              label='顧客名称'
              value={formData?.customerCompanyName}
              onChange={e => handleChange('customerCompanyName', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
              InputProps={{
                readOnly: popupMode === 'view',
              }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='見積書日付'
              value={dayjs(formData?.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
              readOnly={popupMode === 'view'}
            />
            <DatePicker
              label='出荷日付'
              value={dayjs(formData?.shippingmentDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('shippingmentDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
              readOnly={popupMode === 'view'}
            />
            <DatePicker
              label='支払期限'
              value={dayjs(formData?.paymentDueDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('paymentDueDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
              readOnly={popupMode === 'view'}
            />
            <TextField
              label='状態'
              value={formData?.status ?? ''}
              onChange={e => handleChange('status', e.target.value)}
              margin='normal'
              select
              sx={{ flex: 1 }}
              InputLabelProps={{
                component: 'span',
              }}
              InputProps={{
                readOnly: popupMode === 'view',
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
                  visibility: popupMode === 'view' ? 'hidden' : 'inherit',
                })}
              >
                Add Product
              </Button>
            </Box>
            <Autocomplete
              options={_mockOption}
              sx={{ width: '35%' }}
              renderInput={params => <TextField {...params} label='担当者' />}
              readOnly={popupMode === 'view'}
            />
          </Box>
        </Box>
        <DataTable
          data={newProductListData}
          columns={updateColumn}
          apiref={addNewProductDataGridRef}
          // getRowId={row => row.productNumber}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          sx={{ height: 475, mt: 2 }}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          disableColumnSelector
          columnVisibilityModel={columnVisibilityModel}
        />
        {openDialog && popupMode === 'edit' && (
          <AddnewProductDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSubmit={newProduct => {
              setOpenDialog(false)
              handleAddNewProduct(newProduct)
            }}
          />
        )}
      </DialogContent>
      {popupMode === 'edit' && (
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
      )}
    </Dialog>
  )
}

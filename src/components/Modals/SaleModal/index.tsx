import { useState, useEffect, useCallback, useMemo, forwardRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  IconButton,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { OrderData } from 'api/order/getOrderList'
import DataTable from 'components/DataTable'
import useAddProductOrder from './hooks/useAddProductOrder'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  GridSlots,
  useGridApiRef,
} from '@mui/x-data-grid'
import AddnewProductDialog from 'components/Dialogs/AddNewProductListDialog'
import { TransitionProps } from '@mui/material/transitions'
import useLoading from 'hooks/useLoading'
import { UserData } from 'api/user/getUserList'
import customer from 'api/customer'
import SlideTransition from 'components/Transition/Slide'
import CustomFooter from './components/CustomerFooter'
import { OrderStatus } from 'api/order'
interface Option {
  label: string
  id: number
}
export type SaleNewProductList = {
  name: string
  number: string
  price: number
  quantity: number
}
export type SaleModalDataProps = {
  id?: string
  orderCode: string
  saleCode: string
  invoiceNumber: string
  customerCompanyId: string
  customerCompanyName: string
  product: SaleNewProductList[]
  // orderRequestEmployeeId: string
  // orderRequestEmployeeName: string
  // orderApprovedEmployeeId: string
  // orderApprovedEmployeeName: string
  quotationRequestDate: Dayjs | string
  paymentDueDate: Dayjs | string
  registDate: Dayjs | string
  shippingmentDate: Dayjs | string
  status: string
  owners: {
    id: string
    name: string
  }[]
}

interface PurchaseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: SaleModalDataProps) => Promise<void>
  initialData?: SaleModalDataProps
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData = {
  // id: '',
  orderCode: '',
  saleCode: '',
  invoiceNumber: '',
  customerCompanyId: '',
  customerCompanyName: '',
  product: [],
  // orderRequestEmployeeId: '',
  // orderRequestEmployeeName: '',
  // orderApprovedEmployeeId: '',
  // orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  paymentDueDate: dayjs(),
  registDate: dayjs(),
  shippingmentDate: dayjs(),
  status: OrderStatus.PENDING,
  owners: [],
}
export default function SaleModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  //waiting new order
  const [formData, setFormData] = useState(initialData ?? defaultFormData)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const addNewProductDataGridRef = useGridApiRef()
  const { setLoading } = useLoading()
  const { Slide } = SlideTransition({ direction: 'up' })

  const {
    columns,
    newProductListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    handleAddNewProduct,
    getUserList,
    getCustomerList,
    userListData,
    customerListData,
  } = useAddProductOrder(formData)

  useEffect(() => {
    //when have new function or condition should to move loading
    setLoading(true)
    getUserList()
    getCustomerList().finally(() => setLoading(false))
  }, [])

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

  const handleChange = (field: keyof SaleModalDataProps, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      //waiting sale task
      await onConfirm({ ...formData, product: newProductListData as SaleNewProductList[] })
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const findUserById = (userId: string | null) => {
    return userListData?.find(user => user.id === userId) || null
  }

  const findCustomerById = (customerId: string | null) => {
    return customerListData?.find(customer => customer.companyCode === customerId) || null
  }

  const statusList = [
    { label: '見積書依頼', value: 'invoice_pending' },
    { label: '配達中', value: 'on_delivery' },
    { label: '入庫済', value: 'delivered' },
    { label: '返品中', value: 'rejected' },
    { label: 'キャンセル', value: 'cancelled' },
  ]

  const columnVisibilityModel = useMemo(() => {
    return {
      actions: modalMode !== 'view',
    }
  }, [modalMode])

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
      TransitionComponent={Slide}
      keepMounted
      scroll={'paper'}
      fullWidth
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {/* {modalMode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'} */}
            {modalMode === 'view'
              ? '受注詳細'
              : modalMode === 'edit'
                ? '編集モーダルウィンドウ'
                : '追加モーダルウィンドウ'}
          </Typography>
          <Box display={'flex'} gap={4}>
            {modalMode === 'view' && (
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => setModalMode('edit')}
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
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display={'flex'} flexDirection={'column'} flexGrow={1}>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <DatePicker
                label='登録日付'
                value={dayjs(formData.quotationRequestDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange(
                    'quotationRequestDate',
                    newValue ? newValue.format('YYYY-MM-DD') : ''
                  )
                }
                sx={{ marginTop: 2, width: '100%' }}
                readOnly={modalMode === 'view'}
              />
              <TextField
                label='受注番号'
                value={formData.orderCode}
                onChange={e => handleChange('orderCode', e.target.value)}
                margin='normal'
                fullWidth
                // sx={{ flex: 1 }}
                InputProps={{
                  readOnly: modalMode === 'view',
                }}
                required
              />
              <TextField
                label='注番'
                value={formData.saleCode}
                onChange={e => handleChange('saleCode', e.target.value)}
                margin='normal'
                fullWidth
                // sx={{ flex: 1 }}
                InputProps={{
                  readOnly: modalMode === 'view',
                }}
                required
              />
              <TextField
                label='伝票番号'
                value={formData.invoiceNumber}
                onChange={e => handleChange('invoiceNumber', e.target.value)}
                fullWidth
                margin='normal'
                required
                inputProps={
                  {
                    // readOnly: !(
                    //   (modalMode === 'add' || modalMode === 'edit') &&
                    //   (currentStatus === undefined || currentStatus === 'PENDING')
                    // ),
                  }
                }
              />
              <Autocomplete
                options={customerListData}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props
                  return (
                    <Box key={key} component='li' {...optionProps}>
                      {option.companyInfo.name}
                    </Box>
                  )
                }}
                getOptionLabel={option => option.companyInfo.name}
                renderInput={params => <TextField {...params} label='顧客名' />}
                readOnly={modalMode === 'view'}
                isOptionEqualToValue={(option, value) => option.companyCode === value.companyCode}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue !== null) {
                    setFormData(prev => ({
                      ...prev,
                      customerCompanyId: newValue.companyCode,
                    }))
                  }
                }}
                // waiting prepare new type in SaleModal
                value={findCustomerById(formData.customerCompanyId)}
                sx={{ marginTop: 2 }}
                fullWidth
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              {/* <DatePicker
                label='見積書日付'
                value={dayjs(formData.quotationRequestDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange(
                    'quotationRequestDate',
                    newValue ? newValue.format('YYYY-MM-DD') : ''
                  )
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={modalMode === 'view'}
              /> */}
              <DatePicker
                label='出荷日付'
                value={dayjs(formData.shippingmentDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange('shippingmentDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={modalMode === 'view'}
              />
              {/* <DatePicker
                label='支払期限'
                value={dayjs(formData.paymentDueDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange('paymentDueDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={modalMode === 'view'}
              /> */}
              {modalMode !== 'add' && (
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
                  InputProps={{
                    readOnly: modalMode === 'view',
                  }}
                >
                  {statusList.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              gap={2}
              justifyContent={'space-between'}
              sx={{ marginTop: 2 }}
            >
              <Box display={'flex'} alignItems={'end'}>
                <Button
                  onClick={() => setOpenDialog(true)}
                  variant='outlined'
                  sx={theme => ({
                    color: 'white',
                    visibility: modalMode === 'view' ? 'hidden' : 'inherit',
                    // height: '50%',
                  })}
                >
                  Add Product
                </Button>
              </Box>
              <Autocomplete
                options={userListData}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props
                  return (
                    <Box key={key} component='li' {...optionProps}>
                      {option.name}
                    </Box>
                  )
                }}
                getOptionLabel={option => option.name}
                sx={{ width: '35%' }}
                renderInput={params => <TextField {...params} label='担当者' />}
                readOnly={modalMode === 'view'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue !== null) {
                    setFormData(prev => ({
                      ...prev,
                      owners: [
                        {
                          id: newValue.id,
                          name: newValue.name,
                        },
                      ],
                    }))
                  }
                }}
                value={findUserById(formData.owners[0]?.id ?? null)}
              />
            </Box>
            <DataTable
              data={newProductListData}
              columns={updatedColumns}
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
              isCellEditable={() => modalMode !== 'view'}
              slots={{
                footer: CustomFooter,
              }}
            />
          </Box>
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
        {modalMode !== 'view' && (
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
              type='submit'
              // onClick={handleSubmit}
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

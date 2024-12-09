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
  GridRowParams,
  gridDataRowIdsSelector,
} from '@mui/x-data-grid'
import AddnewProductDialog from 'components/Dialogs/AddNewProductListDialog'
import { TransitionProps } from '@mui/material/transitions'
import useLoading from 'hooks/useLoading'
import { UserData } from 'api/user/getUserList'
import customer from 'api/customer'
import SlideTransition from 'components/Transition/Slide'
import CustomFooter from './components/CustomerFooter'
import { OrderStatus } from 'api/order'
import { SaleStatus } from 'api/sale'
import AddNewMemoDialog from 'components/Dialogs/AddNewMemoDialog'
import { useConfirmModal } from 'hooks/useConfirmModal'
import CustomColumn from './components/CustomColumn'
interface Option {
  label: string
  id: number
}
export type SaleNewProductList = {
  productId?: string
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
  memo?: string
  // quotationRequestDate: Dayjs | string
  // paymentDueDate: Dayjs | string
  registrationDate: Dayjs | string
  shippingmentDate: Dayjs | string
  status: string
  totalAmount: number
  owners: {
    id: string
    name: string
  }[]
}

interface SaleModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: (data: SaleModalDataProps) => Promise<void>
  initialData?: SaleModalDataProps
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData = {
  orderCode: '',
  saleCode: '',
  invoiceNumber: '',
  customerCompanyId: '',
  customerCompanyName: '',
  product: [],
  totalAmount: 0,
  registrationDate: dayjs(),
  shippingmentDate: dayjs(),
  status: OrderStatus.PENDING,
  owners: [],
}
export default function SaleModal({ open, onClose, onConfirm, initialData, mode }: SaleModalProps) {
  const [formData, setFormData] = useState<SaleModalDataProps>(initialData ?? defaultFormData)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const currentStatus = mode === 'view' ? '' : initialData?.status
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const addNewProductDataGridRef = useGridApiRef()
  const [openDialogAddMemo, setOpenDialogAddMemo] = useState(false)
  const { setLoading } = useLoading()
  const { Slide } = SlideTransition({ direction: 'up' })
  const { openConfirmModal } = useConfirmModal()

  const {
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

  const columns = CustomColumn({
    cancle: handleCancelClick,
    edit: handleEditClick,
    save: handleSaveClick,
    remove: handleDeleteClick,
    rowModesModel,
  })

  useEffect(() => {
    //when have new function or condition should to move loading
    setLoading(true)
    getUserList()
    getCustomerList().finally(() => setLoading(false))
  }, [])

  const handleChange = async (field: keyof SaleModalDataProps, value: string | number) => {
    if (field === 'status' && value === 'CONFIRMED') {
      const confirmed = await openConfirmModal({
        title: 'ご注意ください',
        message:
          'If you change status to confirm, data can be not change. \n if your click "OK", edited data they are to be return to after edit \n if you need to update data should be not change status.',
      })
      if (confirmed) {
        setFormData(initialData ?? defaultFormData)
        setFormData(prev => ({ ...prev, [field]: value }))
        setModalMode('view')
      }

      return
    } else if (field === 'status' && value === 'PENDING') {
      setModalMode('edit')
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setLoading(true)
    try {
      const rows = addNewProductDataGridRef.current.getRowModels()
      const totalAmount = Array.from(rows.values()).reduce((sum, row) => {
        const rowTotalPrice = row.quantity * row.price
        return sum + rowTotalPrice
      }, 0)
      onConfirm &&
        (await onConfirm({
          ...formData,
          totalAmount: totalAmount,
          product: newProductListData as SaleNewProductList[],
        }))
    } catch (error) {
      console.error('Error submitting data:', error)
    } finally {
      setLoading(false)
    }
  }

  const findUserById = (userId: string | null) => {
    return userListData?.find(user => user.id === userId) || null
  }

  const findCustomerById = (customerId: string | null) => {
    return customerListData?.find(customer => customer.id === customerId) || null
  }

  const statusList = [
    { label: '見積', value: 'PENDING' },
    { label: '受注', value: 'CONFIRMED' },
    { label: '出荷', value: 'SHIPPED' },
    { label: '出荷済', value: 'COMPLETED' }, //売上
    { label: '返品', value: 'rejected' },
    { label: 'キャンセル', value: 'CANCELLED' },
  ]

  const getAvailableStatuses = (
    currentStatus: SaleStatus | string,
    statusList: { label: string; value: string }[]
  ) => {
    switch (currentStatus) {
      case 'PENDING':
        return statusList.filter(status =>
          ['PENDING', 'CONFIRMED', 'CANCEL'].includes(status.value)
        )
      case 'CONFIRMED':
        return statusList.filter(status =>
          ['CONFIRMED', 'SHIPPED', 'CANCEL', 'rejected'].includes(status.value)
        )
      case 'SHIPPED':
        return statusList.filter(status =>
          ['SHIPPED', 'COMPLETED', 'rejected', 'CANCEL'].includes(status.value)
        )

      default:
        return statusList
    }
  }

  const columnVisibilityModel = useMemo(() => {
    return {
      actions:
        (modalMode === 'add' || modalMode === 'edit') &&
        (currentStatus === undefined || currentStatus === 'PENDING'),
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
                ? '受注編集モーダルウィンドウ'
                : '受注追加モーダルウィンドウ'}
          </Typography>
          <Box display={'flex'} gap={4}>
            {/* {modalMode === 'view' && (
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => setModalMode('edit')}
                aria-label='edit'
              >
                <EditIcon />
              </IconButton>
            )} */}
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
                value={dayjs(formData.registrationDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange('registrationDate', newValue ? newValue.format('YYYY-MM-DD') : '')
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
                  readOnly: !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  ),
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
                  readOnly: !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  ),
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
                inputProps={{
                  readOnly: !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  ),
                }}
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
                      customerCompanyId: newValue.id,
                    }))
                  }
                }}
                // waiting prepare new type in SaleModal
                value={findCustomerById(formData.customerCompanyId)}
                sx={{ marginTop: 2 }}
                fullWidth
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent='space-between'>
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
                readOnly={
                  !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  )
                }
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
                  sx={{ width: '30%' }}
                  InputLabelProps={{
                    component: 'span',
                  }}
                  InputProps={{
                    readOnly: modalMode === 'view' && currentStatus === '',
                  }}
                >
                  {getAvailableStatuses(currentStatus ?? '', statusList).map(item => (
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
              <Box display={'flex'} alignItems={'end'} flex={1}>
                <Button
                  onClick={() => setOpenDialog(true)}
                  variant='outlined'
                  sx={theme => ({
                    color: 'white',
                    visibility:
                      (modalMode === 'add' || modalMode === 'edit') &&
                      (currentStatus === undefined || currentStatus === 'PENDING')
                        ? 'inherit'
                        : 'hidden',
                  })}
                >
                  商品追加
                </Button>
              </Box>
              <Box display={'flex'} alignItems={'end'}>
                <Button
                  onClick={() => setOpenDialogAddMemo(true)}
                  variant='outlined'
                  sx={{ color: 'white' }}
                >
                  {(modalMode === 'add' || modalMode === 'edit') &&
                  (currentStatus === undefined || currentStatus === 'PENDING')
                    ? 'メモ追加'
                    : 'メモ'}
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
              columns={columns}
              apiref={addNewProductDataGridRef}
              getRowId={row => row.productId}
              onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
              sx={{ height: 475, mt: 2 }}
              editMode='row'
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              disableColumnSelector
              columnVisibilityModel={columnVisibilityModel}
              isCellEditable={() =>
                (modalMode === 'add' || modalMode === 'edit') &&
                (currentStatus === undefined || currentStatus === 'PENDING')
              }
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
            />
          )}
          {openDialogAddMemo && (
            <AddNewMemoDialog
              open={openDialogAddMemo}
              onClose={() => setOpenDialogAddMemo(false)}
              editable={
                (modalMode === 'add' || modalMode === 'edit') &&
                (currentStatus === undefined || currentStatus === 'PENDING')
              }
              initailData={formData.memo}
              onSubmit={memo => {
                setFormData(prev => ({
                  ...prev,
                  memo: memo,
                }))
                setOpenDialogAddMemo(false)
              }}
            />
          )}
        </DialogContent>
        {(currentStatus !== '' || modalMode !== 'view') && (
          <DialogActions>
            <Button onClick={onClose} variant='contained'>
              キャンセル
            </Button>
            {(!currentStatus ||
              (currentStatus === OrderStatus.PENDING && formData.status === OrderStatus.PENDING) ||
              (formData.status !== currentStatus && formData.status !== OrderStatus.PENDING)) && (
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
            )}
          </DialogActions>
        )}
      </form>
    </Dialog>
  )
}

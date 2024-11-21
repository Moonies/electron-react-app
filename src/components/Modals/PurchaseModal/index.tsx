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
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { debounce } from '@mui/material/utils'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { api } from 'api/index'
import { TransitionProps } from '@mui/material/transitions'
import useAddComponent from './hooks/useAddComponent'
import DataTable from 'components/DataTable'
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowSelectionModel,
  useGridApiRef,
} from '@mui/x-data-grid'
import AddNewComponentListDialog from 'components/Dialogs/AddNewComponentListDialog'
import useLoading from 'hooks/useLoading'
import CustomFooter from './components/CustomerFooter'
import AddNewMemoDialog from 'components/Dialogs/AddNewMemoDialog'
import SlideTransition from 'components/Transition/Slide'
import { PurchaseStatus } from 'api/purchase'
import useNotification from 'hooks/useNotification'
import { useConfirmModal } from 'hooks/useConfirmModal'
interface Option {
  label: string
  id: number
}
export type PurchaseNewComponentList = {
  name: string
  number: string
  price: number
  quantity: number
}
type OwnerList = {
  id: string
  name: string
}
export type PurchaseModalDataProps = {
  id?: string
  orderCode: string
  purchaseCode?: string
  invoiceNumber?: string
  supplierCompanyId: string
  supplierCompanyName: string
  component: PurchaseNewComponentList[]
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  registrationDate: string | Dayjs
  deliveryDate: string | Dayjs
  // quotationRequestDate: string | Dayjs
  // purchaseApprovedDate: string | Dayjs
  // stockApprovalDate: string | Dayjs
  owners: OwnerList[]
  memo?: string
  totalAmount: number
  status?: string
}
interface PurchaseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: PurchaseModalDataProps) => Promise<void>
  initialData?: PurchaseModalDataProps
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData: PurchaseModalDataProps = {
  orderCode: '',
  purchaseCode: '',
  invoiceNumber: '',
  supplierCompanyId: '',
  supplierCompanyName: '',
  component: [],
  orderRequestEmployeeId: '',
  orderRequestEmployeeName: '',
  orderApprovedEmployeeId: '',
  orderApprovedEmployeeName: '',
  // quotationRequestDate: dayjs(),
  // purchaseApprovedDate: dayjs(),
  // stockApprovalDate: dayjs(),
  owners: [],
  memo: '',
  registrationDate: dayjs(),
  deliveryDate: dayjs(),
  totalAmount: 0,
  status: PurchaseStatus.PENDING,
}
export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  const [formData, setFormData] = useState<PurchaseModalDataProps>(initialData ?? defaultFormData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const currentStatus = mode === 'view' ? '' : initialData?.status
  const addNewComponentDataGridRef = useGridApiRef()
  const [openDialogAddComponent, setOpenDialogAddComponent] = useState(false)
  const [openDialogAddMemo, setOpenDialogAddMemo] = useState(false)
  const { Slide } = SlideTransition({ direction: 'up' })
  const { setLoading } = useLoading()
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()

  const {
    columns,
    componentData,
    getCustomerList,
    getUserList,
    userListData,
    supplierCompanyListData,
    rowModesModel,
    processRowUpdate,
    handleRowModesModelChange,
    handleRowEditStop,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
    newComponentListData,
    handleAddNewComponent,
  } = useAddComponent(formData)

  useEffect(() => {
    //when have new function or condition should to move loading
    setLoading(true)
    getUserList()
    getCustomerList().finally(() => setLoading(false))
  }, [])

  const handleChange = async (field: keyof PurchaseModalDataProps, value: string | number) => {
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
    try {
      const rows = addNewComponentDataGridRef.current.getRowModels()
      const totalAmount = Array.from(rows.values()).reduce((sum, row) => {
        const rowTotalPrice = row.quantity * row.price
        return sum + rowTotalPrice
      }, 0)
      await onConfirm({
        ...formData,
        totalAmount: totalAmount,
        component: newComponentListData as PurchaseNewComponentList[],
      })
      // onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    }
  }

  const statusList = [
    { label: '未発注', value: 'PENDING' },
    { label: '発注', value: 'CONFIRMED' },
    { label: '配達中', value: 'SHIPPED' },
    { label: '入庫済', value: 'COMPLETED' },
    { label: '返品中', value: 'rejected' },
    { label: 'キャンセル', value: 'CANCELLED' },
  ]

  const columnVisibilityModel = useMemo(() => {
    return {
      actions:
        (modalMode === 'add' || modalMode === 'edit') &&
        (currentStatus === undefined || currentStatus === 'PENDING'),
    }
  }, [modalMode])

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

  const findUserById = (userId: string | null) => {
    return userListData?.find(user => user.id === userId) || null
  }

  const findCustomerById = (customerId: string | null) => {
    return supplierCompanyListData?.find(customer => customer.id === customerId) || null
  }

  const getAvailableStatuses = (
    currentStatus: PurchaseStatus | string,
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

  const getTextHeader = () =>
    modalMode === 'add'
      ? '追加モーダルウィンドウ'
      : currentStatus
        ? '編集モーダルウィンドウ'
        : '仕入詳細'

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      // fullWidth
      // maxWidth='md'
      fullScreen
      TransitionComponent={Slide}
      // keepMounted
      scroll={'paper'}
      // aria-labelledby='purchase-modal-title'
      // aria-describedby='purchase-modal-description'
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {getTextHeader()}
            {/* {modalMode === 'view'
              ? '仕入詳細'
              : modalMode === 'edit'
                ? '編集モーダルウィンドウ'
                : '追加モーダルウィンドウ'} */}
          </Typography>
          <Box display={'flex'} gap={4}>
            <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-around'}>
              <DatePicker
                label='登録日付'
                value={dayjs(formData.registrationDate)}
                format='YYYY-MM-DD'
                onChange={newValue =>
                  handleChange('registrationDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '100%' }}
                readOnly={
                  !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  )
                }
              />
              <TextField
                label='受注番号'
                value={formData.orderCode}
                onChange={e => handleChange('orderCode', e.target.value)}
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
              <TextField
                label='注番'
                value={formData.purchaseCode}
                onChange={e => handleChange('purchaseCode', e.target.value)}
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
                options={supplierCompanyListData}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props
                  return (
                    <Box key={key} component='li' {...optionProps}>
                      {option.companyInfo.name}
                    </Box>
                  )
                }}
                getOptionLabel={option => option.companyInfo.name}
                sx={{ marginTop: 2 }}
                renderInput={params => <TextField {...params} label='仕入先名' />}
                readOnly={
                  !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  )
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue !== null) {
                    console.log(newValue)
                    setFormData(prev => ({
                      ...prev,
                      supplierCompanyId: newValue.id,
                    }))
                  }
                }}
                value={findCustomerById(formData.supplierCompanyId)}
                fullWidth
              />
            </Box>
            {/* waiting for confirm */}
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent='space-between'>
              {/* <DatePicker
                label='発注承認済'
                value={dayjs(formData.purchaseApprovedDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange(
                    'purchaseApprovedDate',
                    newValue ? newValue.format('YYYY-MM-DD') : ''
                  )
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={(modalMode === 'add' || modalMode === 'edit') &&
        (currentStatus === undefined || currentStatus === 'PENDING')}
              /> */}
              <DatePicker
                label='配達納期'
                value={dayjs(formData.deliveryDate) ?? ''}
                format='YYYY-MM-DD'
                onChange={newValue =>
                  handleChange('deliveryDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={
                  !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  )
                }
              />
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
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
              <Box display={'flex'} alignItems={'end'} flex={1}>
                <Button
                  onClick={() => setOpenDialogAddComponent(true)}
                  variant='outlined'
                  sx={theme => ({
                    color: 'white',
                    visibility:
                      (modalMode === 'add' || modalMode === 'edit') &&
                      (currentStatus === undefined || currentStatus === 'PENDING')
                        ? 'inherit'
                        : 'hidden',
                    // height: '50%',
                  })}
                >
                  部品追加
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
                readOnly={
                  !(
                    (modalMode === 'add' || modalMode === 'edit') &&
                    (currentStatus === undefined || currentStatus === 'PENDING')
                  )
                }
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
              data={newComponentListData}
              columns={updatedColumns}
              apiref={addNewComponentDataGridRef}
              onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
              sx={{ height: 450, mt: 2 }}
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
              // getRowId={row => (modalMode !== 'add' ? row.name + row.number : row.id)}
            />
            {openDialogAddComponent && (
              <AddNewComponentListDialog
                open={openDialogAddComponent}
                onClose={() => setOpenDialogAddComponent(false)}
                onSubmit={newProduct => {
                  setOpenDialogAddComponent(false)
                  handleAddNewComponent(newProduct)
                }}
                // initialData={selectedOrder}
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
          </Box>
        </DialogContent>
        {(currentStatus !== '' || modalMode !== 'view') && (
          <DialogActions>
            <Button
              onClick={onClose}
              variant='contained'
              // sx={theme => ({
              //   color: 'white',
              // })}
              aria-hidden='true'
            >
              キャンセル
            </Button>
            {(!currentStatus ||
              (currentStatus === PurchaseStatus.PENDING &&
                formData.status === PurchaseStatus.PENDING) ||
              (formData.status !== currentStatus &&
                formData.status !== PurchaseStatus.PENDING)) && (
              <Button
                // onClick={handleSubmit}
                variant='outlined'
                type='submit'
                sx={theme => ({
                  color: 'white',
                })}
                aria-hidden='true'
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

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
import dayjs from 'dayjs'
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
export type PurchaseModalDataProps = {
  purchaseId?: string
  invoiceNumber?: string
  supplierCompanyId: string
  supplierCompanyName: string
  component: PurchaseNewComponentList[]
  orderRequestEmployeeId: string
  orderRequestEmployeeName: string
  orderApprovedEmployeeId: string
  orderApprovedEmployeeName: string
  quotationRequestDate: string | dayjs.Dayjs
  purchaseApprovedDate: string | dayjs.Dayjs
  stockApprovalDate: string | dayjs.Dayjs
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
  purchaseId: '',
  invoiceNumber: '',
  supplierCompanyId: '',
  supplierCompanyName: '',
  component: [],
  orderRequestEmployeeId: '',
  orderRequestEmployeeName: '',
  orderApprovedEmployeeId: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  purchaseApprovedDate: dayjs(),
  stockApprovalDate: dayjs(),
  totalAmount: 0,
  status: '',
}
export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  const [formData, setFormData] = useState<PurchaseModalDataProps>(initialData ?? defaultFormData)
  const [inputValue, setInputValue] = useState('')
  // const [componentIdList, setComponentIdList] = useState<ComponentIdData[]>([])
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>(mode)
  const addNewComponentDataGridRef = useGridApiRef()
  const [openDialog, setOpenDialog] = useState(false)
  const { setLoading } = useLoading()

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

  const handleChange = (field: keyof PurchaseModalDataProps, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
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

  useEffect(() => {
    //when have new function or condition should to move loading
    setLoading(true)
    getUserList()
    getCustomerList().finally(() => setLoading(false))
  }, [])

  const findUserById = (userId: string | null) => {
    return userListData?.find(user => user.id === userId) || null
  }

  const findCustomerById = (customerId: string | null) => {
    return supplierCompanyListData?.find(customer => customer.id === customerId) || null
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
      // fullWidth
      // maxWidth='md'
      fullScreen
      TransitionComponent={Transition}
      keepMounted
      scroll={'paper'}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {/* {mode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'} */}
            {modalMode === 'view'
              ? '仕入詳細'
              : modalMode === 'edit'
                ? '編集モーダルウィンドウ'
                : '追加モーダルウィンドウ'}
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
        <DialogContent>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
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
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={modalMode === 'view'}
              />
              <TextField
                label='注番'
                value={formData.purchaseId}
                onChange={e => handleChange('purchaseId', e.target.value)}
                fullWidth
                margin='normal'
                required
                inputProps={{
                  readOnly: modalMode === 'view',
                }}
              />
              {/* <TextField
              label='顧客名'
              value={formData.supplierCompanyName}
              onChange={e => handleChange('supplierCompanyName', e.target.value)}
              margin='normal'
              fullWidth
            /> */}
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
                sx={{ width: '35%', marginTop: 2 }}
                renderInput={params => <TextField {...params} label='顧客名' />}
                readOnly={modalMode === 'view'}
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
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <DatePicker
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
                readOnly={modalMode === 'view'}
              />
              <DatePicker
                label='入庫承認済'
                value={dayjs(formData.stockApprovalDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange('stockApprovalDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '25%' }}
                readOnly={modalMode === 'view'}
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
                inputProps={{
                  readOnly: modalMode === 'view',
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
                    visibility: modalMode === 'view' ? 'hidden' : 'inherit',
                    // height: '50%',
                  })}
                >
                  Add Component
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
                      orderApprovedEmployeeId: newValue.id,
                    }))
                  }
                }}
                value={findUserById(formData.orderApprovedEmployeeId)}
              />
            </Box>
            <DataTable
              data={newComponentListData}
              columns={updatedColumns}
              apiref={addNewComponentDataGridRef}
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
            {openDialog && (
              <AddNewComponentListDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={newProduct => {
                  setOpenDialog(false)
                  handleAddNewComponent(newProduct)
                }}
                // initialData={selectedOrder}
              />
            )}
          </Box>
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
              // onClick={handleSubmit}
              variant='outlined'
              type='submit'
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

import React, { useState, useEffect, useCallback, forwardRef } from 'react'
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
  Slide,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { SaleData } from 'api/sale/getSaleList'
import { TransitionProps } from '@mui/material/transitions'
import DataTable from 'components/DataTable'
import useLoading from 'hooks/useLoading'
import useSaleDetail from './hooks/useSaleDetail'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import CustomFooter from './components/CustomeFooter/inex'

interface SalesModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: SaleData) => Promise<void>
  initialData?: SaleData
  mode: 'add' | 'edit' | 'view'
}
const defaultFormData: SaleData = {
  id: '',
  orderId: '',
  customerCompanyId: '',
  customerCompanyName: '',
  product: [],
  orderRequestEmployeeId: '',
  orderRequestEmployeeName: '',
  orderApprovedEmployeeId: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  paymentDueDate: dayjs(),
  registDate: dayjs(),
  shippingmentDate: dayjs(),
  status: null,
}
const SalesModal: React.FC<SalesModalProps> = ({ open, onClose, onConfirm, initialData, mode }) => {
  const [formData, setFormData] = useState<SaleData>(initialData ?? defaultFormData)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const viewSaleProductDetail = useGridApiRef()
  const { setLoading } = useLoading()
  const { columns } = useSaleDetail()

  // useEffect(() => {
  //   if (mode === 'edit' && initialData) {
  //     setFormData(initialData)
  //   } else {
  //     setFormData(defaultFormData)
  //   }
  // }, [initialData])

  const handleChange = (field: keyof SaleData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onConfirm(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

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
          <Typography variant='h6'>売上詳細</Typography>
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
              readOnly
            />
            <TextField
              label='注番'
              value={formData.orderId}
              onChange={e => handleChange('orderId', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
              InputProps={{
                readOnly: mode === 'view',
              }}
              required
            />
            <TextField
              label='顧客名'
              sx={{ width: '35%', marginTop: 2 }}
              InputProps={{
                readOnly: mode === 'view',
              }}
              value={formData.customerCompanyName}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='見積書日付'
              value={dayjs(formData.quotationRequestDate)}
              format='YYYY/MM/DD'
              sx={{ marginTop: 2, width: '25%' }}
              readOnly
            />
            <DatePicker
              label='出荷日付'
              value={dayjs(formData.shippingmentDate)}
              format='YYYY/MM/DD'
              sx={{ marginTop: 2, width: '25%' }}
              readOnly
            />
            <DatePicker
              label='支払期限'
              value={dayjs(formData.paymentDueDate)}
              format='YYYY/MM/DD'
              sx={{ marginTop: 2, width: '25%' }}
              readOnly
            />
            {/* <TextField
              label='状態'
              value={convertStatus(formData.status) ?? ''}
              margin='normal'
              sx={{ flex: 1 }}
              InputProps={{
                readOnly: mode === 'view',
              }}
            /> */}
          </Box>
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            justifyContent={'flex-end'}
            marginTop={2}
          >
            <TextField
              sx={{ width: '35%' }}
              InputProps={{
                readOnly: mode === 'view',
              }}
              label='担当者'
              value={formData.orderApprovedEmployeeName}
            />
          </Box>
        </Box>
        <DataTable
          data={formData.product}
          columns={columns}
          apiref={viewSaleProductDetail}
          // getRowId={row => row.productNumber}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          sx={{ height: 500, mt: 2 }}
          slots={{
            footer: CustomFooter,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SalesModal

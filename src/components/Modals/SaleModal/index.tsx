import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { SalesData } from 'api/sales/saleList'

interface SalesModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: SalesData) => Promise<void>
  initialData?: SalesData
  mode: 'add' | 'edit'
}
const defaultFormData: SalesData = {
  saleId: 0,
  invoiceNumber: 0,
  customerName: '',
  deliveryDate: dayjs(),
  productId: '',
  productName: '',
  quantity: 0,
  unitPrice: 0,
  totalPrice: 0,
  employeeName: '',
  orderApprovedEmployee: '',
  orderId: 0,
}
const SalesModal: React.FC<SalesModalProps> = ({ open, onClose, onConfirm, initialData, mode }) => {
  const [formData, setFormData] = useState<SalesData>(defaultFormData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (field: keyof SalesData, value: string | number) => {
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

  const _mockOption = [
    { label: 'aaaaa', id: 1 },
    { label: 'bbdbd', id: 2 },
    { label: 'cdfasd', id: 3 },
    { label: 'qwerty', id: 4 },
    { label: 'asddffg', id: 5 },
    { label: 'minoiui', id: 6 },
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
      maxWidth='md'
    >
      <DialogTitle>
        {mode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'}
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='登録日付'
                value={dayjs(formData.deliveryDate)}
                format='YYYY/MM/DD'
                onChange={newValue =>
                  handleChange('deliveryDate', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                sx={{ marginTop: 2, width: '25%' }}
              />
            </LocalizationProvider>
            <TextField
              label='Invoice Number'
              value={formData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              // fullWidth
              margin='normal'
            />
            <TextField
              label='Customer Name'
              value={formData.customerName}
              onChange={e => handleChange('customerName', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <TextField
              label='Product ID'
              value={formData.productId}
              onChange={e => handleChange('productId', e.target.value)}
              // fullWidth
              margin='normal'
              sx={{ flex: 1 }}
            />
            <TextField
              label='Quantity'
              type='number'
              value={formData.quantity}
              onChange={e => handleChange('quantity', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              sx={{ width: '20%' }}
            />
            <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ marginTop: 2, width: '35%' }}
              renderInput={params => <TextField {...params} label='Approved Employee' />}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SalesModal

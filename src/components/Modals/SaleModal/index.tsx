import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
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

const SalesModal: React.FC<SalesModalProps> = ({ open, onClose, onConfirm, initialData, mode }) => {
  const [formData, setFormData] = useState<SalesData>({
    saleId: 0,
    invoiceNumber: 0,
    customerName: '',
    deliveryDate: '',
    productId: '',
    productName: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    employeeName: '',
    orderApprovedEmployee: '',
    orderId: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
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

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>{mode === 'add' ? 'Add New Sale' : 'Edit Sale'}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            value={dayjs(formData.deliveryDate)}
            onChange={newValue =>
              handleChange('deliveryDate', newValue ? newValue.format('YYYY-MM-DD') : '')
            }
          />
        </LocalizationProvider>
        <TextField
          label='ProductId'
          value={formData.productId}
          onChange={e => handleChange('productId', e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Amount'
          type='number'
          value={formData.quantity}
          onChange={e => handleChange('quantity', parseFloat(e.target.value))}
          fullWidth
          margin='normal'
        />
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

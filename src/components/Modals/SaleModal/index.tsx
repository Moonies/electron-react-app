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
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
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
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <DatePicker
              label='登録日付'
              value={dayjs(formData.deliveryDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('deliveryDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='伝票番号'
              value={formData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              // fullWidth
              margin='normal'
            />
            <TextField
              label='顧客名称'
              value={formData.customerName}
              onChange={e => handleChange('customerName', e.target.value)}
              margin='normal'
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <TextField
              label='商品番号'
              value={formData.productId}
              onChange={e => handleChange('productId', e.target.value)}
              // fullWidth
              margin='normal'
              sx={{ flex: 1 }}
            />
            <TextField
              label='数量'
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
              renderInput={params => <TextField {...params} label='担当者' />}
            />
          </Box>
        </Box>
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

export default SalesModal

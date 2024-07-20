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
import { ProductData } from 'api/products/productList'

interface SalesModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ProductData) => Promise<void>
  initialData?: ProductData
  mode: 'add' | 'edit'
}
const defaultFormData: ProductData = {
  productId: '',
  productName: '',
  stockQuantity: 0,
  productCost: 0,
  productPrice: 0,
  productUnit: '',
}
const ProductModal: React.FC<SalesModalProps> = ({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductData>(defaultFormData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      console.log('first')
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof ProductData, value: string | number) => {
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

  const productUnitList = [
    {
      value: 'piece',
      label: '個',
    },
    {
      value: 'unit',
      label: '台',
    },
    {
      value: 'sheet',
      label: '枚',
    },
    {
      value: 'set',
      label: 'セット',
    },
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
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='商品番号'
              value={formData.productId}
              onChange={e => handleChange('productId', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='商品品名'
              type='text'
              value={formData.productName}
              onChange={e => handleChange('productName', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='原価'
              type='number'
              value={formData.productCost}
              onChange={e => handleChange('productCost', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='単価'
              type='number'
              value={formData.productPrice}
              onChange={e => handleChange('productPrice', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='粗利益'
              type='number'
              value={formData.productPrice}
              onChange={e => handleChange('productPrice', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='在庫数'
              type='number'
              value={formData.stockQuantity}
              onChange={e => handleChange('stockQuantity', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='単位'
              type='text'
              value={formData.productUnit}
              defaultValue={undefined}
              onChange={e => handleChange('productUnit', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '40%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {productUnitList.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant='outlined'
          sx={{
            color: 'white',
          }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductModal

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
import { CustomerData } from 'api/customer/getCustomerList'
import { AddNewCustomerProps } from 'api/customer/addNewCustomer'
import { SaveAs as SaveIcon, Search as SearchIcon } from '@mui/icons-material'
import { StyledButton } from 'styles/styles'
import useLoading from 'hooks/useLoading'
import { api } from 'api/index'

interface CustomerManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: AddNewCustomerProps) => Promise<void>
  initialData?: CustomerData
  mode: 'add' | 'edit'
}
const defaultFormData: AddNewCustomerProps = {
  customerName: '',
  closeingDay: '',
  phoneNumber: '',
  postalCode: '',
  prefecture: '',
  city: '',
  street: '',
  buildingName: '',
  paymentDueDate: '',
  email: '',
}
export default function CustomerManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: CustomerManagementModalProps) {
  const [formData, setFormData] = useState<AddNewCustomerProps>(defaultFormData)
  const { withLoading } = useLoading()

  const dateNumber = Array.from(Array(30).keys())

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof AddNewCustomerProps, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      await onConfirm(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
    }
  }
  //when function has to be more 1 function should move to hook
  const handlePostCodeClick = async () => {
    const result = await withLoading(api.postCode().getPostCode({ postCode: formData.postalCode }))
    if (result.code === 200) {
      //data is now for test and mock
      setFormData(prev => ({
        ...prev,
        ['prefecture']: 'aaaa',
        ['city']: 'bbbbbb',
      }))
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
      fullWidth
      maxWidth='lg'
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
              label='名称'
              value={formData.customerName}
              onChange={e => handleChange('customerName', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='締日'
              value={formData.closeingDay}
              onChange={e => handleChange('closeingDay', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '30%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {dateNumber.map(item => (
                <MenuItem key={item} value={item + 1}>
                  {item + 1}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label='電話番号'
              type='text'
              value={formData.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              fullWidth
              margin='normal'
            />
            <TextField
              label='メール'
              type='text'
              value={formData.email}
              onChange={e => handleChange('email', parseFloat(e.target.value))}
              fullWidth
              margin='normal'
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
            <TextField
              label='郵便番号'
              type='text'
              value={formData.postalCode}
              defaultValue={undefined}
              onChange={e => handleChange('postalCode', e.target.value)}
              // fullWidth
              margin='normal'
              // select
            />
            <StyledButton
              variant='outlined'
              startIcon={<SearchIcon />}
              size='large'
              sx={{ height: 48 }}
              onClick={handlePostCodeClick}
            >
              検索
            </StyledButton>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='都道府県'
              type='text'
              value={formData.prefecture}
              onChange={e => handleChange('prefecture', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
            />
            {/* <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ marginTop: 2, width: '35%' }}
              // value={formData.prefecture}

              renderInput={params => (
                <TextField {...params} label='prefecture' value={formData.prefecture} />
              )}
            /> */}
            <TextField
              label='市区町村'
              type='text'
              value={formData.city}
              defaultValue={undefined}
              onChange={e => handleChange('city', e.target.value)}
              // fullWidth
              margin='normal'
              // sx={{ width: '40%' }}
            />
            <TextField
              label='番地'
              type='text'
              value={formData.street}
              onChange={e => handleChange('street', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
            />
            <TextField
              label='建物名・部屋番号'
              type='text'
              value={formData.buildingName}
              defaultValue={undefined}
              onChange={e => handleChange('buildingName', e.target.value)}
              // fullWidth
              margin='normal'
            />
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

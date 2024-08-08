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
import { SaveAs as SaveIcon, Search as SearchIcon } from '@mui/icons-material'
import { StyledButton } from 'styles/styles'
import useLoading from 'hooks/useLoading'
import { api } from 'api/index'
import { SupplierData } from 'api/supplier/getSupplierList'
import { AddNewComponentProps } from 'api/component/addNewComponent'
import { ComponentData } from 'api/component/getComponentList'

interface ComponentManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: AddNewComponentProps | ComponentData) => Promise<void>
  initialData?: ComponentData
  mode: 'add' | 'edit'
}
interface UpdateComponentData {
  price: string
  closeingDate: string
  purchaseId: string
  id: string
  componentName: string
}
const defaultFormData: AddNewComponentProps | ComponentData = {
  price: '',
  lastestPriceDate: '',
  purchaseId: '',
  id: '',
  componentName: '',
  componentNumber: '',
}
export default function ComponentManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: ComponentManagementModalProps) {
  const [formData, setFormData] = useState<AddNewComponentProps | ComponentData>(defaultFormData)
  const { withLoading } = useLoading()

  const dateNumber = Array.from(Array(30).keys())

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof AddNewComponentProps, value: string | number) => {
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
              label='component number'
              value={formData.componentNumber}
              onChange={e => handleChange('componentNumber', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='component name'
              value={formData.componentName}
              onChange={e => handleChange('componentName', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='price'
              value={formData.price}
              onChange={e => handleChange('price', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='単価時点'
              value={formData.lastestPriceDate}
              onChange={e => handleChange('lastestPriceDate', e.target.value)}
              fullWidth
              margin='normal'
              select
              // sx={{ width: '30%' }}
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

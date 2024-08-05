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
import { UserData } from 'api/user/getUserList'
import { AddNewUserData } from 'api/user/addNewUser'

interface AccountManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: AddNewUserData) => Promise<void>
  initialData?: UserData
  mode: 'add' | 'edit'
}
const defaultFormData: AddNewUserData = {
  fullName: '',
  role: '',
  username: '',
  password: '',
}
export default function AccountManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: AccountManagementModalProps) {
  const [formData, setFormData] = useState<AddNewUserData>(defaultFormData)

  const roleList = [
    {
      value: 'normal',
      label: 'normal-level',
    },
    {
      value: 'senior',
      label: 'senior-level',
    },
    {
      value: 'manager',
      label: 'manager-level',
    },
    {
      value: 'admin',
      label: 'administator-level',
    },
  ]

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      console.log('first')
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof AddNewUserData, value: string | number) => {
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
              label='ユーザーネーム'
              value={formData.username}
              onChange={e => handleChange('username', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            <TextField
              label='パスワード'
              type='text'
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='名前'
              type='text'
              value={formData.fullName}
              onChange={e => handleChange('fullName', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='役柄'
              type='text'
              value={formData.role}
              defaultValue={undefined}
              onChange={e => handleChange('role', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '40%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {roleList.map(item => (
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

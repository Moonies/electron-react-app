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
  name: '',
  roles: '',
  identifier: '',
  // username: '',
  password: '',
  userNumber: '',
}
export default function AccountManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: AccountManagementModalProps) {
  const [formData, setFormData] = useState<AddNewUserData | UserData>(defaultFormData)

  const roleList = [
    {
      value: 'normal',
      label: '一般',
    },
    {
      value: 'senior',
      label: '課長',
    },
    {
      value: 'manager',
      label: 'マネジャー',
    },
    {
      value: 'admin',
      label: '管理人',
    },
  ]

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log(initialData)
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof AddNewUserData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      await onConfirm(formData)
      // onClose()
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
              value={formData.identifier}
              onChange={e => handleChange('identifier', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            {/* <TextField
              label='パスワード'
              type='text'
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            /> */}
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            {/* <TextField
              label='社員番号'
              type='text'
              value={formData.userNumber}
              onChange={e => handleChange('name', e.target.value)}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            /> */}
            <TextField
              label='名前'
              type='text'
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='役柄'
              type='text'
              value={formData.roles}
              // defaultValue={undefined}
              onChange={e => handleChange('roles', e.target.value)}
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
        <Button onClick={onClose} variant='contained' aria-label='close'>
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

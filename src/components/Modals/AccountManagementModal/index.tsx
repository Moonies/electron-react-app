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
import { api } from 'api/index'
import { RoleData } from 'api/role/getRoleList'

export type ModalInitalData = {
  name: string
  role: string
  username: string
  number: string
  mail: string
  password?: string
}
interface AccountManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ModalInitalData) => Promise<void>
  initialData?: ModalInitalData
  mode: 'add' | 'edit'
}
const defaultFormData: ModalInitalData = {
  name: '',
  role: '',
  // identifier: '',
  username: '',
  password: '',
  number: '',
  mail: '',
}
export default function AccountManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: AccountManagementModalProps) {
  const [formData, setFormData] = useState<ModalInitalData>(initialData ?? defaultFormData)
  const [roleList, setRoleList] = useState<RoleData[]>([])
  // const roleList = [
  //   {
  //     value: 'normal',
  //     label: '一般',
  //   },
  //   {
  //     value: 'senior',
  //     label: '課長',
  //   },
  //   {
  //     value: 'manager',
  //     label: 'マネジャー',
  //   },
  //   {
  //     value: 'admin',
  //     label: '管理人',
  //   },
  // ]

  useEffect(() => {
    getRoleList()
  }, [])

  const handleChange = (field: keyof AddNewUserData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getRoleList = async () => {
    const result = await api.role.getRoleList()
    if (result.code === 200 && result.data) {
      setRoleList(result.data)
    }
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
            {/* <TextField
              label='ユーザーネーム'
              value={formData.identifier}
              onChange={e => handleChange('identifier', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            /> */}
            <TextField
              label='メール'
              value={formData.mail}
              onChange={e => handleChange('mail', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '70%' }}
            />
            <TextField
              label='パスワード'
              type='password'
              value={formData.password ?? ''}
              onChange={e => handleChange('password', e.target.value)}
              fullWidth
              margin='normal'

              // sx={{ width: '20%' }}
            />
          </Box>
          {/* <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='メール'
              value={formData.mail}
              onChange={e => handleChange('mail', e.target.value)}
              // fullWidth
              margin='normal'
              sx={{ width: '70%' }}
            />
          </Box> */}
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <TextField
              label='社員番号'
              type='text'
              value={formData.number}
              onChange={e => handleChange('number', e.target.value)}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
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
              value={formData.role}
              // defaultValue={undefined}
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
                <MenuItem key={item.id} value={item.name}>
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

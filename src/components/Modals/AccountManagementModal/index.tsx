import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { AddNewUserData } from 'api/user/addNewUser'
import { RoleData } from 'api/role/getRoleList'
import useHttp from 'hooks/useHttp'

export type ModalInitalData = {
  id?: string
  name: string
  roleId: string
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
  roleId: '',
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
  const { api } = useHttp()
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
            <TextField
              label='ユーザーネーム'
              value={formData.username}
              onChange={e => handleChange('username', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            />
            {/* <TextField
              label='メール'
              value={formData.mail}
              onChange={e => handleChange('mail', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ width: '70%' }}
            /> */}
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
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            {/* <TextField
              label='名前'
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              fullWidth
              margin='normal'
              // sx={{ flex: 1 }}
            /> */}
            <TextField
              label='メール'
              value={formData.mail}
              onChange={e => handleChange('mail', e.target.value)}
              // fullWidth
              margin='normal'
              sx={{ width: '70%' }}
            />
          </Box>
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
              value={formData.name ?? ''}
              onChange={e => handleChange('name', e.target.value)}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
            <TextField
              label='役柄'
              // type='text'
              value={roleList.length > 0 ? formData.roleId : ''} //for waiting roleList is loaded
              onChange={e => handleChange('roleId', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '40%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {roleList.map(item => (
                <MenuItem key={item.id} value={item.id}>
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

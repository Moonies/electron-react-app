import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material'
import useLoading from 'hooks/useLoading'
import { useNavigate } from 'react-router-dom'
import useNotification from 'hooks/useNotification'
import useAuth from 'hooks/useAuth'
import useApiConfig from 'hooks/useApiConfig'
import useApi from 'hooks/useHttp'
import ResetPasswordDialog from 'components/Dialogs/ResetPasswordDialog'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  onError: (result: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onSuccess, onError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { notificationSnackbar, notificationModal } = useNotification()
  const { setUserLogin, removeUserLogin, setToken } = useAuth()
  const { resetConfig } = useApiConfig()
  const { withLoading, setLoading } = useLoading()
  const [openDialog, setOpenDialog] = useState(false)
  const { api } = useApi()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // navigate('/')
    // onSuccess()
    setLoading(true)
    const result = await api.user.checkAuth(username, password)

    if (result.code === 200 && result.data) {
      // dispatch(login(result.data))
      setToken(result.data)
      const resultUser = await api.user.getUserDetail(username)
      if (resultUser.code === 200 && resultUser.data) {
        setUserLogin(resultUser.data)
        notificationSnackbar.success('ログイン完了')
        navigate('/')
        onSuccess()
      } else {
        notificationModal.error(resultUser.message)
      }
    } else {
      setLoading(false)
      switch (result.code) {
        case 403:
          resetConfig()
          notificationSnackbar.error('Authentication failed:' + result.message)
          onError('baseUrl')
          break
        case 'ERR_NETWORK':
          notificationModal.error(
            'Authentication failed:' + result.message + '\n Please Check IP Again'
          )
          onError('baseUrl')
          break
        default:
          notificationSnackbar.error('Authentication failed:' + result.message)

          break
      }
      // notificationModal.error('Authentication failed:' + result.message)
    }
  }

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      removeUserLogin()
      onClose
    }
  }

  const handleForgotPassword = async (email: string) => {
    const result = await withLoading(api.user.getResetPasswordCode(email))
    if (result.code === 200) {
      notificationModal.info('reset password Effective for 20 minutes.')
      setOpenDialog(false)
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true}>
      <DialogTitle>ログイン</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin='normal'
            id='username'
            label='ユーザーネーム'
            type='text'
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin='normal'
            id='password'
            label='パスワード'
            type='password'
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <ResetPasswordDialog
            onClose={() => setOpenDialog(false)}
            onSubmit={handleForgotPassword}
            open={openDialog}
          />
        </DialogContent>
        <DialogActions>
          <Box display={'flex'} marginRight={'auto'}>
            <Button onClick={() => setOpenDialog(true)}>forgot password</Button>
          </Box>
          <Box display={'flex'}>
            <Button onClick={onClose}>キャンセル</Button>
            <Button type='submit'>ログイン</Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LoginModal

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import { login } from 'store/authSlice'
import { api } from 'api'
import useLoading from 'hooks/useLoading'
import { showNotification } from 'store/notificationSlice'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { withLoading } = useLoading()
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await withLoading(api.user().checkAuth(username, password))

    if (result.code === 200 && result.data) {
      dispatch(login(result.data))
      dispatch(
        showNotification({
          message: result.message,
          type: 'snackbar',
          severity: 'success',
        })
      )
      navigate('/')
      onSuccess()
    } else {
      dispatch(
        showNotification({
          message: 'Authentication failed:' + result.message,
          type: 'modal',
          severity: 'error',
        })
      )
    }
  }

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true}>
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='username'
            label='Username'
            type='text'
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin='dense'
            id='password'
            label='Password'
            type='password'
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit'>Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LoginModal

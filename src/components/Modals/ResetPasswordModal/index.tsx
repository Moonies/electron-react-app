import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import useApi from 'hooks/useHttp'
import { Box } from '@mui/system'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (newPassword: string, rePasswordCode: string) => void
}

const ResetPasswordModal: React.FC<LoginModalProps> = ({ open, onClose, onSubmit }) => {
  const [rePasswordCode, setRepasswordCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { notificationSnackbar, notificationModal } = useNotification()
  const { withLoading, setLoading } = useLoading()
  const { api } = useApi()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newPassword, rePasswordCode)
  }

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true}>
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>パスワードリーセット</Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin='normal'
            id='new-password'
            label='新パスワード'
            type='password'
            fullWidth
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            margin='normal'
            id='repassword-code'
            label='リセットパスコード'
            type='text'
            fullWidth
            onChange={e => setRepasswordCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit'>確認</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ResetPasswordModal

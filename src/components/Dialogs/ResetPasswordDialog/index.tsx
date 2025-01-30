import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'

interface DialogResetPassword {
  open: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function ResetPasswordDialog({ open, onClose, onSubmit }: DialogResetPassword) {
  const [email, setEmail] = useState<string>('')
  const handleSubmit = () => {
    onSubmit(email)
  }
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      maxWidth='sm'
      fullWidth
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle>reset password</DialogTitle>
      <DialogContent>
        <TextField type={'email'} fullWidth onChange={e => setEmail(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' aria-label='close'>
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          color='primary'
          variant='outlined'
          sx={{ color: 'white' }}
          aria-label='close'
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  )
}

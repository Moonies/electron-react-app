import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import { login } from 'store/authSlice'
import { api } from 'api'
import useLoading from 'hooks/useLoading'
import { showNotification } from 'store/notificationSlice'
import { useNavigate } from 'react-router-dom'
import useApiConfig from 'hooks/useApiConfig'

interface SettingModalProps {
  open: boolean
  onClose: () => void
}

const IpSettingModal: React.FC<SettingModalProps> = ({ open, onClose }) => {
  const [baseUrl, setBaseUrl] = useState('')
  const { updateConfig } = useApiConfig()
  // const { withLoading } = useLoading()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateConfig({ baseUrl })
    onClose()

    //test connection before call onSuccess()
  }

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true}>
      <DialogTitle>IP Setting</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            id='ipAdress'
            label='ip servser'
            type='text'
            fullWidth
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit'>confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default IpSettingModal

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material'
import { RootState } from 'store/index'
import { clearNotification } from 'store/notificationSlice'
import { StyledAlert } from './styles'
import { red } from '@mui/material/colors'

const Notification: React.FC = () => {
  const dispatch = useDispatch()
  const { message, type, severity } = useSelector((state: RootState) => state.notification)

  const handleClose = () => {
    dispatch(clearNotification())
  }

  if (type === 'modal') {
    return (
      <Dialog open={!!message} onClose={handleClose} maxWidth='sm' fullWidth={true}>
        <DialogTitle
          sx={theme => ({
            backgroundColor: (() => {
              switch (severity) {
                case 'error':
                  return theme.palette.error.main
                case 'warning':
                  return theme.palette.warning.main
                case 'success':
                  return theme.palette.success.main
                case 'info':
                default:
                  return theme.palette.info.main
              }
            })(),
          })}
        >
          {severity === 'error' ? 'Error' : 'Notification'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText p={2} m={2}>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={type === 'alert' ? null : 6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <StyledAlert
        onClose={handleClose}
        severity={severity}
        variant='filled'
        sx={{ width: '100%', color: 'white' }}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  )
}

export default Notification

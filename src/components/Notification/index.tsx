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
  Slide,
  IconButton,
} from '@mui/material'
import { RootState } from 'store/index'
import { clearNotification } from 'store/notificationSlice'
import { StyledAlert } from './styles'
import { red } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import { Box } from '@mui/system'
import { Close as CloseIcon } from '@mui/icons-material'

const Notification: React.FC = () => {
  const dispatch = useDispatch()
  const { message, type, severity, onConfirm, onCancel } = useSelector(
    (state: RootState) => state.notification
  )

  const handleClose = () => {
    if (onCancel) {
      onCancel()
    }
    dispatch(clearNotification())
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    dispatch(clearNotification())
  }

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction='up' ref={ref} {...props} />
  })

  if (type === 'modal') {
    return (
      <Dialog
        open={!!message}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        maxWidth='sm'
        fullWidth={true}
        keepMounted
        TransitionComponent={Transition}
      >
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
            color: (() => {
              switch (severity) {
                case 'error':
                  return theme.palette.error.contrastText
                case 'warning':
                  return theme.palette.warning.contrastText
                case 'success':
                  return theme.palette.success.contrastText
                case 'info':
                default:
                  return theme.palette.info.contrastText
              }
            })(),
          })}
        >
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            {/* {severity === 'error' ? 'Error' : 'Notification'} */}
            {severity === 'error' ? 'エラー' : '通知表'}
            <IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions> */}
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

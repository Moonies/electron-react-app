import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

interface DialogSelectTypeOrder {
  open: boolean
  message: string
  onClose: () => void
}

export default function ViewMemoDialog({ open, onClose, message }: DialogSelectTypeOrder) {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      maxWidth='xs'
      fullWidth
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle>Memo Detail</DialogTitle>
      <DialogContent>
        <Typography variant='body1' gutterBottom></Typography>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  )
}

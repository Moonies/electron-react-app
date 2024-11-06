import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'

interface DialogMemoProps {
  open: boolean
  onClose: () => void
  onSubmit: (memo: string) => void
  editable: boolean
  initailData?: string
}

export default function AddNewMemoDialog({
  open,
  onClose,
  onSubmit,
  editable,
  initailData,
}: DialogMemoProps) {
  const [memo, setMemo] = useState(initailData ?? '')
  const handleSubmit = () => {
    onSubmit(memo)
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
      <DialogTitle>{editable ? '追加したいのメモ' : 'メモ'}</DialogTitle>
      <DialogContent>
        <TextField
          id='outlined-select-currency'
          fullWidth
          onChange={e => setMemo(e.target.value)}
          value={memo}
          multiline
          maxRows={4}
          InputProps={{
            readOnly: !editable,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          キャンセル
        </Button>
        {editable && (
          <Button onClick={handleSubmit} color='primary' variant='outlined' sx={{ color: 'white' }}>
            確認
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

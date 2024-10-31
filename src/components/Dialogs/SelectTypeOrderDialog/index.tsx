import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import React, { useState } from 'react'

interface DialogSelectTypeOrder {
  open: boolean
  onClose: () => void
  onSubmit: (typeOrder?: 'Sale' | 'Purchase') => void
}

export default function SelectTypeOrderDialog({ open, onClose, onSubmit }: DialogSelectTypeOrder) {
  const [typeOrder, setTypeOrder] = useState<'Sale' | 'Purchase'>()
  const submitType = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSubmit(typeOrder)
  }
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
      <DialogTitle>追加したいの受注を</DialogTitle>
      <form onSubmit={submitType}>
        <DialogContent>
          <TextField
            id='outlined-select-currency'
            select
            label='受注タイプ'
            // defaultValue={''}
            required
            fullWidth
            onChange={e => setTypeOrder(e.target.value as 'Sale' | 'Purchase')}
            value={typeOrder ?? ''}
          >
            <MenuItem value={'Sale'}>売上へ</MenuItem>
            <MenuItem value={'Purchase'}>仕入へ</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='contained'>
            キャンセル
          </Button>
          <Button type='submit' color='primary' variant='outlined' sx={{ color: 'white' }}>
            確認
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

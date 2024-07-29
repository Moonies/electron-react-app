import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'

interface KpiSettingModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputYear: string) => void
}

export default function KpiSettingModal({ open, onClose, onSubmit }: KpiSettingModalProps) {
  const [inputYear, setInputYear] = useState('')
  const [errors, setErrors] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^\d{4}$/.test(inputYear)) {
      setErrors('year format is wrong !! ex.20xx')
      return false
    } else {
      onSubmit(inputYear)
    }
  }
  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown={true} maxWidth='sm' fullWidth>
      <DialogTitle>KPI 設定したい希望年を入力してください</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            id='inputYear'
            label='年（西暦）'
            type='text'
            fullWidth
            error={!!errors}
            helperText={errors}
            value={inputYear}
            onChange={e => {
              setErrors('')
              setInputYear(e.target.value)
            }}
          />
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

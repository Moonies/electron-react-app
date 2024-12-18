import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { SaveAs as SaveIcon, Search as SearchIcon } from '@mui/icons-material'
import { StyledButton } from 'styles/styles'
import useLoading from 'hooks/useLoading'
import { AddNewSupplierProps } from 'api/supplier/addNewSupplier'
import { SupplierData } from 'api/supplier/getSupplierList'
import MarkInputPhoneNumber from 'components/MarkInput/MarkInputPhoneNumber'
import MarkInputPostalCode from 'components/MarkInput/MarkInputPostalCode'
import { Dayjs } from 'dayjs'
import MarkInputFaxNumber from 'components/MarkInput/MarkInputFaxNumber'
import useNotification from 'hooks/useNotification'
import { deConvertPostalCode } from 'utils/formatUtils'
import useHttp from 'hooks/useHttp'

interface SupplierManagementModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: ModalSupplierProps) => Promise<void>
  initialData?: ModalSupplierProps
  mode: 'add' | 'edit'
}

export type ModalSupplierProps = {
  id?: string
  companyCode: string
  companyType: string
  name: string
  buildingName: string
  streetAddress: string
  city: string
  prefecture: string
  postalCode: string
  phoneNumber: string
  email: string
  fax?: string
  closingDay: string
  paymentDeadline: string | Dayjs
}
const defaultFormData: ModalSupplierProps = {
  phoneNumber: '',
  postalCode: '',
  prefecture: '',
  city: '',
  buildingName: '',
  email: '',
  closingDay: '',
  paymentDeadline: '',
  companyCode: '',
  companyType: '',
  fax: '',
  name: '',
  streetAddress: '',
}
export default function SupplierManagementModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: SupplierManagementModalProps) {
  const [formData, setFormData] = useState<ModalSupplierProps>(defaultFormData)
  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const { api } = useHttp()
  const dateNumber = Array.from(Array(30).keys())

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [defaultFormData, initialData])

  const handleChange = (field: keyof ModalSupplierProps, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await onConfirm(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
    }
  }
  //when function has to be more 1 function should move to hook
  const handlePostCodeClick = async () => {
    const result = await withLoading(
      api.postCode.getPostCode(deConvertPostalCode(formData.postalCode))
    )
    if (result.code === 200 && result.data) {
      //data is now for test and mock
      setFormData(prev => ({
        ...prev,
        ['prefecture']: result.data?.prefecture ?? '',
        ['city']: result.data?.city ?? '',
        ['postalCode']: result.data?.postCode ?? deConvertPostalCode(formData.postalCode),
      }))
    } else {
      notificationSnackbar.warning('postalCode not found')
      setFormData(prev => ({
        ...prev,
        ['prefecture']: '',
        ['city']: '',
        ['postalCode']: deConvertPostalCode(formData.postalCode),
      }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>{mode === 'add' ? '仕入先追加' : '仕入先編集'}</Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <TextField
                label='名称'
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                fullWidth
                margin='normal'
                required
                // sx={{ flex: 1 }}
              />
              <TextField
                label='会社コード'
                value={formData.companyCode}
                onChange={e => handleChange('companyCode', e.target.value)}
                fullWidth
                margin='normal'
                required
                // sx={{ flex: 1 }}
              />
              {/* <TextField
              label='締日'
              value={formData.closingDay}
              onChange={e => handleChange('closingDay', e.target.value)}
              // fullWidth
              margin='normal'
              select
              sx={{ width: '30%' }}
              InputLabelProps={{
                component: 'span',
              }}
            >
              {dateNumber.map(item => (
                <MenuItem key={item} value={item + 1}>
                  {item + 1}
                </MenuItem>
              ))}
            </TextField> */}
              <TextField
                label='電話番号'
                type='text'
                value={formData.phoneNumber}
                onChange={e => handleChange('phoneNumber', e.target.value)}
                fullWidth
                margin='normal'
                required
                InputProps={{
                  inputComponent: MarkInputPhoneNumber as any,
                }}
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <TextField
                label='メール'
                type='text'
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                label='fax'
                type='text'
                value={formData.fax}
                onChange={e => handleChange('fax', e.target.value)}
                fullWidth
                margin='normal'
                InputProps={{
                  inputComponent: MarkInputFaxNumber as any,
                }}
                sx={{ width: '70%' }}
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <TextField
                label='郵便番号'
                type='text'
                value={formData.postalCode}
                defaultValue={undefined}
                onChange={e => handleChange('postalCode', e.target.value)}
                // fullWidth
                margin='normal'
                // select
                InputProps={{
                  inputComponent: MarkInputPostalCode as any,
                }}
              />
              <StyledButton
                variant='outlined'
                startIcon={<SearchIcon />}
                size='large'
                sx={{ height: 48 }}
                onClick={handlePostCodeClick}
              >
                検索
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <TextField
                label='都道府県'
                type='text'
                value={formData.prefecture}
                onChange={e => handleChange('prefecture', e.target.value)}
                // fullWidth
                margin='normal'
              />
              {/* <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ marginTop: 2, width: '35%' }}
              // value={formData.prefecture}

              renderInput={params => (
                <TextField {...params} label='prefecture' value={formData.prefecture} />
              )}
            /> */}
              <TextField
                label='市区町村'
                type='text'
                value={formData.city}
                defaultValue={undefined}
                onChange={e => handleChange('city', e.target.value)}
                // fullWidth
                margin='normal'
                // sx={{ width: '40%' }}
              />
              <TextField
                label='番地'
                type='text'
                value={formData.streetAddress}
                onChange={e => handleChange('streetAddress', e.target.value)}
                // fullWidth
                margin='normal'
              />
              <TextField
                label='建物名・部屋番号'
                type='text'
                value={formData.buildingName}
                defaultValue={undefined}
                onChange={e => handleChange('buildingName', e.target.value)}
                // fullWidth
                margin='normal'
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='contained'>
            キャンセル
          </Button>
          <Button
            type='submit'
            variant='outlined'
            sx={{
              color: 'white',
            }}
          >
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

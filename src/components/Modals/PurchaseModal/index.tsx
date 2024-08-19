import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { debounce } from '@mui/material/utils'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { api } from 'api/index'
import { ComponentIdData } from 'api/component/getComponentIdList'
interface Option {
  label: string
  id: number
}
interface PurchaseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: PurchaseData) => Promise<void>
  initialData?: PurchaseData
  mode: 'add' | 'edit'
}
const defaultFormData: PurchaseData = {
  purchaseId: '',
  invoiceNumber: '',
  supplierCompanyId: '',
  supplierCompanyName: '',
  componentNumber: '',
  componentName: '',
  quantity: 0,
  unitPrice: 0,
  totalPrice: 0,
  orderRequestEmployeeName: '',
  orderApprovedEmployeeName: '',
  quotationRequestDate: dayjs(),
  purchaseApprovedDate: dayjs(),
  purchaseReciptDate: dayjs(),
}
export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  initialData,
  mode,
}: PurchaseModalProps) {
  const [formData, setFormData] = useState<PurchaseData>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [componentIdList, setComponentIdList] = useState<ComponentIdData[]>([])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (field: keyof PurchaseData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onConfirm(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting data:', error)
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const fetchedOptions = await api.component().getComponentIdList(query)
          setComponentIdList(fetchedOptions.data ?? [])
        } catch (error) {
          console.error('Error fetching options:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedFetchOptions(inputValue)
  }, [inputValue, debouncedFetchOptions])

  const _mockOption: Option[] = [
    { label: 'aaaaa', id: 1 },
    { label: 'bbdbd', id: 2 },
    { label: 'cdfasd', id: 3 },
    { label: 'qwerty', id: 4 },
    { label: 'asddffg', id: 5 },
    { label: 'minoiui', id: 6 },
  ]
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
      maxWidth='md'
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {mode === 'add' ? '追加モーダルウィンドウ' : '編集モーダルウィンドウ'}
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'}>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <DatePicker
              label='登録日付'
              value={dayjs(formData.quotationRequestDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <TextField
              label='伝票番号'
              value={formData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              // fullWidth
              margin='normal'
            />
            <TextField
              label='顧客名称'
              value={formData.supplierCompanyName}
              onChange={e => handleChange('supplierCompanyName', e.target.value)}
              margin='normal'
              // sx={{ flex: 1 }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <DatePicker
              label='発注承認済'
              value={dayjs(formData.purchaseApprovedDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
            <DatePicker
              label='入庫承認済'
              value={dayjs(formData.purchaseReciptDate)}
              format='YYYY/MM/DD'
              onChange={newValue =>
                handleChange('quotationRequestDate', newValue ? newValue.format('YYYY-MM-DD') : '')
              }
              sx={{ marginTop: 2, width: '25%' }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              // fullWidth
              options={_mockOption}
              sx={{ marginTop: 2, width: '35%' }}
              renderInput={params => <TextField {...params} label='担当者' />}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              // fullWidth
              options={componentIdList}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option
                }
                if (option && option.componentNumber) {
                  return option.componentNumber
                }
                return ''
              }}
              freeSolo
              // disableClearable
              sx={{ marginTop: 2, flex: 1 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='商品番号'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color='inherit' size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
                setFormData(prev => ({ ...prev, ['productId']: newInputValue }))
              }}
              //comment for check error
              // onChange={(event, newValue) => {
              //   if (typeof newValue === 'string') {
              //     setFormData(prev => ({ ...prev, ['productId']: newValue }))
              //     console.log('choose from list', newValue)
              //   } else if (newValue && newValue.componentNumber) {
              //     // Create a new value from the user input
              //     setFormData(prev => ({ ...prev, ['productId']: newValue.componentNumber }))
              //     console.log('new input value', newValue.componentNumber)
              //   } else {
              //     // setValue(newValue)
              //     console.log('other', newValue)
              //   }
              // }}
              isOptionEqualToValue={(option, value) =>
                option.componentNumber === value.componentNumber
              }
              value={formData.componentNumber}
            />
            <TextField
              label='数量'
              type='number'
              value={formData.quantity}
              onChange={e => handleChange('quantity', parseFloat(e.target.value))}
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant='contained'
          // sx={theme => ({
          //   color: 'white',
          // })}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant='outlined'
          sx={theme => ({
            color: 'white',
          })}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

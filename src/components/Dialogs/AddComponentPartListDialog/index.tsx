import {
  Autocomplete,
  Button,
  CircularProgress,
  createFilterOptions,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { ComponentData } from 'api/component/getComponentData'
// import { api } from 'api/index'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import React, { useCallback, useEffect, useState } from 'react'
import NumericFormatCustom from 'components/NumericFormat'
import useNotification from 'hooks/useNotification'

export type ComponentDetail = {
  id: string
  number: string
  name: string
  quantity: number
  price: number
  // totalPrice: number
}

interface ComponentDataExtended extends ComponentData {
  inputValue?: string
}

interface DialogAddComponentPartProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputProduct: ComponentDetail) => void
}

export default function AddComponentPartListDialog({
  open,
  onClose,
  onSubmit,
}: DialogAddComponentPartProps) {
  const [formData, setFormData] = useState<ComponentDetail>({
    id: '',
    number: '',
    name: '',
    quantity: 1,
    price: 0,
  })
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [componentList, setComponentList] = useState<ComponentData[]>([])
  const { notificationModal } = useNotification()
  const { api } = useHttp()
  const submitProduct = async (e: React.FormEvent) => {
    const selectedComponent = componentList.find(item => item.id === formData.id)
    if (selectedComponent && selectedComponent?.inStock < formData.quantity) {
      notificationModal.warning('部品の在庫が足りません。在庫を確認してください。')
      return
    }
    e.preventDefault()
    e.stopPropagation()
    onSubmit(formData)
  }

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const { data } = await api.component.getComponentData(query)
          setComponentList(data ?? [])
        } catch (error) {
          console.error('Error fetching options:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 500),
    []
  )

  useEffect(() => {
    debouncedFetchOptions(inputValue)
  }, [inputValue, debouncedFetchOptions])

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      maxWidth={formData.id !== '' ? 'lg' : 'sm'}
      fullWidth
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle>商品の部品を選んでください。</DialogTitle>
      <form onSubmit={submitProduct}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              options={componentList}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                  <Box component='li' {...optionProps} key={option.id || option.number}>
                    {option.number}: {option.name} (¥{option.price})
                  </Box>
                )
              }}
              getOptionLabel={option => {
                return typeof option === 'string' ? option : option.number
              }}
              sx={{ flex: 1, width: '40%' }}
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
                  required
                />
              )}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
                setFormData(prev => ({ ...prev, componentNumber: newInputValue }))
              }}
              onChange={(event, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                  setFormData({
                    id: newValue.id,
                    number: newValue.number,
                    name: newValue.name,
                    quantity: 1,
                    price: newValue.price,
                  })
                } else {
                  setFormData({ id: '', number: '', name: '', quantity: 1, price: 0 })
                }
              }}
              isOptionEqualToValue={option => option.number === formData.number}
            />
            {formData.id !== '' && (
              <>
                <TextField
                  label='商品名'
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  InputProps={{ readOnly: true }}
                  sx={{ width: '40%' }}
                />
                <TextField
                  label='価格'
                  // type='number'
                  value={formData.price}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))
                  }
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    readOnly: true,
                  }}
                  required
                  sx={{ width: '15%' }}
                />
              </>
            )}
            <TextField
              label='数量'
              value={formData?.quantity ?? ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))
              }
              sx={{ width: '15%' }}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
            />
          </Box>
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

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
export type NewComponentDetail = {
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

interface DialogAddNewComponentDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputProduct: NewComponentDetail) => void
}

export default function AddNewComponentListDialog({
  open,
  onClose,
  onSubmit,
}: DialogAddNewComponentDialogProps) {
  const [formData, setFormData] = useState<NewComponentDetail>({
    id: '',
    number: '',
    name: '',
    quantity: 1,
    price: 0,
  })
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [componentList, setComponentList] = useState<ComponentData[]>([])
  const [isNewValue, setIsNewValue] = useState(false)
  const { api } = useHttp()
  const submitProduct = async (e: React.FormEvent) => {
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
    }, 300),
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
      <DialogTitle>Please Select Component</DialogTitle>
      <form onSubmit={submitProduct}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              options={componentList}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                  <Box component='li' {...optionProps} key={option.id || option.number}>
                    {/* {option.componentNumber}: {option.name} (¥{option.price}) */}
                    {/* cannot use before confirmed */}
                    {option.name.startsWith('Add "')
                      ? option.name
                      : `${option.number}: ${option.name} (¥${option.price})`}
                  </Box>
                )
              }}
              getOptionLabel={option => {
                return typeof option === 'string' ? option : option.number
              }}
              freeSolo
              sx={{ flex: 1 }}
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
                  // cannot use before confirmed
                  newValue.name.startsWith('Add "') ? setIsNewValue(true) : setIsNewValue(false)
                  setFormData({
                    id: newValue.id,
                    number: newValue.number,
                    // componentName: newValue.componentName,
                    // cannot use before confirmed
                    name: newValue.name.startsWith('Add "')
                      ? '' // Clear componentName if it's a new value
                      : newValue.name,
                    quantity: 1,
                    price: newValue.price,
                  })
                }
              }}
              // cannot use before confirmed
              filterOptions={(options, params) => {
                const filtered: any = options.filter(option =>
                  option.number.toLowerCase().includes(params.inputValue.toLowerCase())
                )
                if (params.inputValue !== '' && !filtered.length) {
                  filtered.push({
                    id: `new-${params.inputValue}`,
                    number: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                    price: 0,
                  } as ComponentData)
                }
                return filtered
              }}
              value={formData.number || null}
            />
            {formData.id !== '' && (
              <>
                <TextField
                  label='商品名'
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  InputProps={{ readOnly: !isNewValue }}
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
                    readOnly: !isNewValue,
                  }}
                  required
                />
              </>
            )}
            <TextField
              label='数量'
              // type='number'
              value={formData?.quantity ?? ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))
              }
              sx={{ width: '30%' }}
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

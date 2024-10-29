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

export type NewComponentDetail = {
  id: string
  componentNumber: string
  componentName: string
  quantity: number
  unitPrice: number
  // totalPrice: number
}

interface ComponentDataExtended extends ComponentData {
  inputValue?: string
}

interface DialogProductProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputProduct: NewComponentDetail) => void
}

export default function AddNewComponentListDialog({ open, onClose, onSubmit }: DialogProductProps) {
  const [formData, setFormData] = useState<NewComponentDetail>({
    id: '',
    componentNumber: '',
    componentName: '',
    quantity: 1,
    unitPrice: 0,
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
      maxWidth={isNewValue ? 'lg' : 'sm'}
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
                  <Box key={key} component='li' {...optionProps}>
                    {option.componentNumber}: {option.componentName} (¥{option.price})
                    {/* cannot use before confirmed */}
                    {/* {option.componentName.startsWith('Add "')
                      ? option.componentName
                      : `${option.componentNumber}: ${option.componentName} (¥${option.price})`} */}
                  </Box>
                )
              }}
              getOptionLabel={option => {
                return typeof option === 'string' ? option : option.componentNumber
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
                  // newValue.componentName.startsWith('Add "')
                  //   ? setIsNewValue(true)
                  //   : setIsNewValue(false)
                  setFormData({
                    id: newValue.id,
                    componentNumber: newValue.componentNumber,
                    componentName: newValue.componentName,
                    // cannot use before confirmed
                    // componentName: newValue.componentName.startsWith('Add "')
                    //   ? '' // Clear componentName if it's a new value
                    //   : newValue.componentName,
                    quantity: 1,
                    unitPrice: newValue.price,
                  })
                }
              }}
              // cannot use before confirmed
              // filterOptions={(options, params) => {
              //   const filtered = options.filter(option =>
              //     option.componentNumber.toLowerCase().includes(params.inputValue.toLowerCase())
              //   )
              //   if (params.inputValue !== '' && !filtered.length) {
              //     filtered.push({
              //       componentNumber: params.inputValue,
              //       componentName: `Add "${params.inputValue}"`,
              //       price: 0,
              //     } as ComponentData)
              //   }
              //   return filtered
              // }}
              value={formData.componentNumber || null}
            />
            {/* cannot use before confirmed */}
            {/* {isNewValue && (
              <>
                <TextField
                  label='商品名'
                  value={formData.componentName}
                  onChange={e => setFormData(prev => ({ ...prev, componentName: e.target.value }))}
                  required
                />
                <TextField
                  label='価格'
                  type='number'
                  value={formData.unitPrice}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) }))
                  }
                  required
                />
              </>
            )} */}
            <TextField
              label='数量'
              type='number'
              value={formData?.quantity ?? ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))
              }
              sx={{ width: '30%' }}
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

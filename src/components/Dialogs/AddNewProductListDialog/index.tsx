import {
  Autocomplete,
  Button,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { ProductDetail as ProductDetailList } from 'api/product/getProductData'
import NumericFormatCustom from 'components/NumericFormat'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import React, { useCallback, useEffect, useState } from 'react'

export type ProductDetail = {
  id?: string
  number: string | null
  name: string | null
  quantity: number
  price: number
}
interface DialogProductProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputProduct: ProductDetail) => void
  // productData: ProductDataDetail[]
}

export default function AddnewProductDialog({
  open,
  onClose,
  onSubmit,
  // productData,
}: DialogProductProps) {
  const [formData, setFormData] = useState<ProductDetail>({
    number: null,
    name: null,
    quantity: 1,
    price: 0,
  })
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [productList, setProductList] = useState<ProductDetailList[]>([])
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
          const fetchedOptions = await api.product.getProductData('number', query)
          setProductList(fetchedOptions.data ?? [])
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
      maxWidth={formData.id ? 'lg' : 'sm'}
      fullWidth
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle>商品を選んでください</DialogTitle>
      <form onSubmit={submitProduct}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              options={productList}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                  <Box key={key} component='li' {...optionProps}>
                    {option.number + '  :  ' + option.name + `(${option.price})`}
                  </Box>
                )
              }}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option
                }
                if (option && option.number) {
                  return option.number
                }
                return ''
              }}
              // freeSolo
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
                setFormData(prev => ({ ...prev, productNumber: newInputValue }))
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === 'object' && newValue !== null) {
                  setFormData(prev => ({
                    ...prev,
                    id: newValue.id,
                    number: newValue.number || null,
                    name: newValue.name || null,
                    price: newValue.price || 0,
                  }))
                } else {
                  setFormData({
                    id: undefined,
                    number: null,
                    name: null,
                    price: 0,
                    quantity: 1,
                  })
                }
              }}
              isOptionEqualToValue={option => option.number === formData?.number}
              // value={formData?.productNumber}
            />
            {formData.id && (
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
                  sx={{ width: '15%' }}
                />
                <TextField
                  label='数量'
                  value={formData?.quantity ?? ''}
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                  }}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))
                  }
                  sx={{ width: '15%' }}
                />
              </>
            )}
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

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
import { api } from 'api/index'
import { ProductDataDetail } from 'api/product/getProductData'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'

export type ProductDetail = {
  productNumber: string | null
  productName: string | null
  quantity: number | null
}
interface DialogProductProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputProduct: ProductDetail) => void
  // productData: ProductDataDetail[]
}

export default function DialogProduct({
  open,
  onClose,
  onSubmit,
  // productData,
}: DialogProductProps) {
  const [inputYear, setInputYear] = useState({})
  const [errors, setErrors] = useState('')
  const [formData, setFormData] = useState<ProductDetail>({
    productNumber: null,
    productName: null,
    quantity: null,
  })
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [productList, setProductList] = useState<ProductDataDetail[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // if (!/^\d{4}$/.test(inputYear)) {
    //   setErrors('year format is wrong !! ex.20xx')
    //   return false
    // } else {
    //   onSubmit(inputYear)
    // }
  }

  const debouncedFetchOptions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const fetchedOptions = await api.product().getProductData(query)
          setProductList(fetchedOptions.data?.data ?? [])
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
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown={true} maxWidth='sm' fullWidth>
      <DialogTitle>Please Select Product</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display={'flex'} flexDirection={'row'} gap={2} justifyContent={'space-between'}>
            <Autocomplete
              options={productList}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                  <Box key={key} component='li' {...optionProps}>
                    {option.productId + '  :  ' + option.productName + `(${option.productPrice})`}
                  </Box>
                )
              }}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option
                }
                if (option && option.productId) {
                  return option.productId
                }
                return ''
              }}
              freeSolo
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
                setFormData(prev => ({ ...prev, productNumber: newInputValue }))
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === 'object' && newValue !== null) {
                  setFormData(prev => ({
                    ...prev,
                    productNumber: newValue.productId || null,
                    productName: newValue.productName || null,
                    productPrice: newValue.productPrice || null,
                  }))
                }
              }}
              isOptionEqualToValue={(option, value) => option.productId === value.productId}
              value={formData?.productNumber}
            />
            <TextField
              label='数量'
              type='number'
              value={formData?.quantity ?? ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))
              }
              // fullWidth
              margin='normal'
              // sx={{ width: '20%' }}
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

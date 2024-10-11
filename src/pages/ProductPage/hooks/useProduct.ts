import { GridColDef } from '@mui/x-data-grid'
import { ProductData, SearchCriteriaProductList } from 'api/product/getProductList'
import { api } from 'api'
import useLoading from 'hooks/useLoading'
import React, { useCallback, useMemo, useState } from 'react'
import { orderHistory } from 'api/product/getProductOrderHistory'

interface PaginationModel {
  page: number
  pageSize: number
}

interface CategoryProductSearch {
  value: string
  display: string
}

export type ProductHistoryData = {
  id: number
  productNumber: string
  productName: string
  orderHistoryList: orderHistory[]
}

export default function useProduct() {
  const [categorySearch, setCategorySearch] = useState<CategoryProductSearch[]>()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaProductList>({
    category: '',
    keyword: '',
  })
  const [productData, setProductData] = useState<ProductData[]>([])
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const { withLoading } = useLoading()

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const productUnitConverter = (rawProductUnit: string): string => {
    switch (rawProductUnit) {
      case 'piece':
        return '個'
      case 'unit':
        return '台'
      case 'sheet':
        return '枚'
      case 'set':
        return 'セット'

      default:
        return ''
    }
  }

  const handleChange = (name: string, value: string) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'productNumber', headerName: '図番', flex: 1, headerAlign: 'center' },
      { field: 'productName', headerName: '品名', flex: 1, headerAlign: 'center' },
      {
        field: 'productPrice',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        // minWidth: 200,
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      {
        field: 'productCost',
        headerName: '原価',
        type: 'number',
        headerAlign: 'center',
        // minWidth: 200,
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      {
        field: 'grossProfitMargin',
        headerName: '粗利益率',
        headerAlign: 'center',
        valueGetter: (value, row) => {
          return (((row.productPrice - row.productCost) / row.productCost) * 100).toFixed(3) + '%'
        },
      },
      {
        field: 'productUnit',
        headerName: '単位',
        type: 'number',
        headerAlign: 'center',
        valueGetter: value => productUnitConverter(value),
      },
      { field: 'stockQuantity', headerName: '在庫数', type: 'number', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategoryProductSearch[] = []
    columns.forEach(item => {
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const handleSearch = useCallback(async () => {
    const result = await withLoading(api.product.getProductList(searchCriteria))
    if (result.code === 200 && result.data) {
      setProductData(result.data.data)
    }
  }, [searchCriteria, withLoading])

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel)
    //call APi
  }

  const getComponentDetailList = async (componentId: string) => {
    //get component detail
    //get total remain
  }

  const getProductOrderHistoryList = async (productId: string) => {
    const result = await api.product.getProductOrderHistory(productId)
    if (result.code === 200 && result.data) {
      return result.data
    }
    return undefined
  }

  return {
    columns,
    prepareCategorySearch,
    categorySearch,
    searchCriteria,
    productData,
    handleSearch,
    handleChange,
    handlePaginationModelChange,
    paginationModel,
    getComponentDetailList,
    getProductOrderHistoryList,
  }
}

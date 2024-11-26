import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { ProductData, SearchCriteriaProductList } from 'api/product/getProductList'
import { api } from 'api'
import useLoading from 'hooks/useLoading'
import React, { useCallback, useMemo, useState } from 'react'
// import { orderHistory } from 'api/product/getProductOrderHistory'
import useHttp from 'hooks/useHttp'
import { AddNewProductProps } from 'api/product/addNewProduct'
import useNotification from 'hooks/useNotification'
import { formatJPY } from 'utils/formatUtils'
import { ProductDetailModalProps } from 'components/Modals/ProductModal'
import { NewProductDetailProps } from 'api/product/updateProductDetail'
import { OrderHistory } from 'api/product/getProductOrderHistory'

interface PaginationModel {
  page: number
  pageSize: number
}

interface CategoryProductSearch {
  value: string
  display: string
}
interface CachedData {
  [key: string]: ProductData[]
}

export default function useProduct() {
  const [categorySearch, setCategorySearch] = useState<CategoryProductSearch[]>()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaProductList>({
    category: '',
    keyword: '',
    page: 0,
    pageSize: 10,
  })
  const [productData, setProductData] = useState<ProductData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const { api } = useHttp()

  const handleChange = (name: string, value: string) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: '図番', flex: 1, headerAlign: 'center' },
      { field: 'name', headerName: '品名', flex: 1, headerAlign: 'center' },
      {
        field: 'price',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        // minWidth: 200,
        valueFormatter: value => formatJPY(Number(value)),
      },
      {
        field: 'cost',
        headerName: '原価',
        type: 'number',
        headerAlign: 'center',
        // minWidth: 200,
        valueFormatter: value => formatJPY(Number(value)),
      },
      {
        field: 'grossProfitMarginRate',
        headerName: '粗利益率',
        headerAlign: 'center',
        valueGetter: (value, row) => {
          return (((row.price - row.cost) / row.cost) * 100).toFixed(3) + '%'
        },
      },
      {
        field: 'productUnit',
        headerName: '単位',
        type: 'number',
        headerAlign: 'center',
        valueGetter: (value: { id: string; label: string; name: string }) => value.label,
      },
      {
        field: 'inStock',
        headerName: '在庫数',
        type: 'number',
        headerAlign: 'center',
        valueFormatter: value => (value === null ? 0 : value),
      },
      {
        field: 'howManyProductsCanBeMade',
        headerName: '製作できる製品',
        type: 'number',
        headerAlign: 'center',
      },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategoryProductSearch[] = []
    columns.forEach(item => {
      if (item.field === 'number' || item.field === 'name') {
        result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
      }
    })
    setCategorySearch(result)
  }, [])

  const prepareProductDetail = (selectedData: ProductData) => {
    let productDetailModalData: ProductDetailModalProps = {
      id: selectedData.id,
      productNumber: selectedData.number,
      productName: selectedData.name,
      stockQuantity: selectedData.inStock,
      productCost: selectedData.cost,
      productPrice: selectedData.price,
      productUnit: selectedData.productUnitId,
      productPriceMargin: selectedData.price - selectedData.cost,
      components: selectedData.components.map(item => ({
        id: item.number + item.name,
        name: item.name,
        number: item.number,
        quantity: item.quantity,
        price: item.price,
      })),
    }
    return productDetailModalData
  }

  const handleSearch = useCallback(async () => {
    //condition and prepare data put here
    getProductList(paginationModel)
  }, [searchCriteria, withLoading])

  const handleAddNewProduct = async (formData: ProductDetailModalProps) => {
    let newProduct: AddNewProductProps = {
      name: formData.productName,
      number: formData.productNumber,
      price: formData.productPrice,
      cost: formData.productCost,
      grossMarginRate: formData.productPriceMargin ?? 0,
      productUnitId: formData.productUnit,
      // taxCategory: formData.productName,
      components: formData.components.map(item => ({
        name: item.name,
        number: item.number,
        quantity: item.quantity,
        price: item.price,
      })),
    }
    const response = await addNewProduct(newProduct)
    if (response) return response
  }

  const handleUpdateProductDetail = async (
    formData: ProductDetailModalProps,
    needUpdateInStock: boolean
  ) => {
    let newProductDetail: NewProductDetailProps = {
      id: formData.id ?? '',
      name: formData.productName,
      number: formData.productNumber,
      price: formData.productPrice,
      lastestPriceDecisionDate: '',
      cost: formData.productCost,
      grossMarginRate:
        ((formData.productPrice - formData.productCost) / formData.productCost) * 100,
      productUnitId: formData.productUnit,
      components: formData.components,
      // inStock: formData.stockQuantity,
    }

    const response = await updateProductDetail(newProductDetail)
    if (response && needUpdateInStock) {
      const response = await updateProductInStock(newProductDetail.id, formData.stockQuantity)
      return response
    } else {
      return response
    }
  }

  const handleOrderProductHistory = async (
    productId: string
  ): Promise<OrderHistory[] | undefined> => {
    const response = await getProductOrderHistoryList(productId)
    if (response) {
      return response.map(item => ({
        ...item,
        products: item.products.filter(subItem => Object.values(subItem).includes(productId)),
      }))
    }
  }

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`

    if (cachedData[cacheKey]) {
      setProductData(cachedData[cacheKey])
      return
    }
    getProductList(newModel)
  }

  const getProductOrderHistoryList = async (productId: string) => {
    const result = await api.product.getProductOrderHistory(productId)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }

  const getProductList = async ({ page, pageSize }: GridPaginationModel) => {
    let prepareSearhCriteria = {
      ...searchCriteria,
      page: page,
      pageSize: pageSize,
    }
    const result = await api.product.getProductList(prepareSearhCriteria)
    if (result.code === 200 && result.data) {
      setProductData(() => result.data || [])
      setTotalRows(result.page?.totalElements ?? 0)
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
      }))
    }
  }

  const getAllProductData = async () => {
    let prepareSearhCriteria = {
      ...searchCriteria,
      pageSize: totalRows,
    }
    const result = await api.product.getProductList(prepareSearhCriteria)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }

  const addNewProduct = async (data: AddNewProductProps) => {
    const result = await api.product.addNewProduct(data)
    if (result.code === 200 && result.data) {
      notificationSnackbar.success('追加完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const updateProductDetail = async (data: NewProductDetailProps) => {
    const result = await api.product.updateProductDetail(data)
    if (result.code === 200 && result.data) {
      notificationSnackbar.success('編集完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const updateProductInStock = async (prodictId: string, newQuantity: number) => {
    const result = await api.product.updateProductInStock(prodictId, newQuantity)
    if (result.code === 200) {
      return true
    }
  }

  const deleteProduct = async (productId: string) => {
    const result = await api.product.deleteProduct(productId)
    if (result.code === 200) {
      notificationSnackbar.success('削除完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
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
    getProductOrderHistoryList,
    handleAddNewProduct,
    totalRows,
    handleUpdateProductDetail,
    deleteProduct,
    prepareProductDetail,
    handleOrderProductHistory,
    getAllProductData,
  }
}

import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { AddNewComponentProps } from 'api/component/addNewComponent'
import { ComponentData, SearchCriteriaComponentList } from 'api/component/getComponentList'
import { PurchaseOrderHistory } from 'api/component/getComponentPurchaseHistory'
import { UpdateComponentProps } from 'api/component/updateComponents'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'

type CategoryProductSearch = {
  value: string
  display: string
}

interface CachedData {
  [key: string]: ComponentData[]
}

export default function useComponent() {
  const [categorySearch, setCategorySearch] = useState<CategoryProductSearch[]>()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaComponentList>({
    category: '',
    keyword: '',
    page: 0,
    pageSize: 10,
  })
  const [componentListData, setComponentListData] = useState<ComponentData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const { api } = useHttp()
  const { withLoading, setLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: '部品番号', headerAlign: 'center', flex: 1 },

      { field: 'name', headerName: '部品名', headerAlign: 'center', flex: 1 },
      {
        field: 'price',
        headerName: '単価',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => formatJPY(Number(value)),
        // minWidth: 200,
      },
      {
        field: 'inStock',
        headerName: '数量',
        headerAlign: 'center',
        flex: 1,
        type: 'number',
        valueFormatter: value => (value === null ? 0 : value),
      },
      { field: 'latestPriceDecisionDate', headerName: '単価時点', headerAlign: 'center', flex: 1 },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategoryProductSearch[] = []
    columns.forEach(item => {
      if (item.field === 'lastestPriceDate') return
      result.push({ value: item.field, display: item.headerName ? item.headerName : '' })
    })
    setCategorySearch(result)
  }, [])

  const handleChange = (name: string, value: string) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const prepareComponents = (
    componentPurchaseHistory: PurchaseOrderHistory[],
    componentName: string
  ) => {
    const selectedComponentHistory = componentPurchaseHistory
      .map(purchaseHistory => {
        const selectedComponent = purchaseHistory.components.find(
          item => item.name === componentName
        )

        if (selectedComponent) {
          return {
            ...purchaseHistory,
            components: [selectedComponent], // Keep only selected component
          }
        }
        return null // Return null if no selected component found
      })
      .filter(Boolean) // Remove null entries

    return selectedComponentHistory
  }

  const handleSearch = useCallback(async () => {
    //if have another event
    setCachedData({})
    getComponentListData(paginationModel)
  }, [searchCriteria, withLoading, paginationModel])

  const handleComponentPurchaseHistoryList = async (componentName: string) => {
    const purchaseHistoryResponse = await getComponentPurchaseHistory(componentName)
    let componentDetail
    if (purchaseHistoryResponse) {
      componentDetail = prepareComponents(purchaseHistoryResponse, componentName)
      // componentDetail = await Promise.all(
      //   componentDetail.map(async item => {
      //     const { data } = await api.supplier.getSupplierDetailWithId(item?.companyId ?? '')
      //     console.log(data)
      //     return { ...item, companyName: data?.companyInfo.name }
      //   })
      // )
      return componentDetail as PurchaseOrderHistory[]
    }
  }
  const getComponentListData = async ({ page, pageSize }: GridPaginationModel) => {
    let prepareSearhCriteria = {
      ...searchCriteria,
      page: page,
      pageSize: pageSize,
    }
    const result = await withLoading(api.component.getComponentList(prepareSearhCriteria))
    if (result.code === 200 && result.data) {
      setComponentListData(result.data)
      setTotalRows(result.page?.totalElements ?? 0)
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
      }))
    }
  }

  const getComponentPurchaseHistory = async (componentName: string) => {
    const result = await api.component.getComponentPurchaseHistory(componentName)
    if (result.code === 200 && result.data) {
      setLoading(false)
      return result.data
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const addNewComponent = async (newComponentData: AddNewComponentProps) => {
    const result = await api.component.addNewComponent(newComponentData)
    if (result.code === 200) {
      setLoading(false)
      notificationSnackbar.success('追加完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const updateComponent = async (newComponentDetail: UpdateComponentProps) => {
    const result = await api.component.updateComponents(newComponentDetail)
    if (result.code === 200) {
      setLoading(false)
      notificationSnackbar.success('編集完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const deleteComponent = async (componentId: string) => {
    const result = await api.component.deleteComponent(componentId)
    if (result.code === 200) {
      setLoading(false)
      notificationSnackbar.success('削除完了しました。')
      return true
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      setCachedData({})
    } else {
      setPaginationModel({ ...newModel })
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`
    if (cachedData[cacheKey]) {
      setComponentListData(cachedData[cacheKey])
      return
    } else if (componentListData.length !== 0) {
      getComponentListData(newModel)
    }
  }
  return {
    paginationModel,
    columns,
    getComponentListData,
    componentListData,
    handlePaginationModelChange,
    categorySearch,
    searchCriteria,
    handleChange,
    prepareCategorySearch,
    handleSearch,
    getComponentPurchaseHistory,
    addNewComponent,
    updateComponent,
    deleteComponent,
    handleComponentPurchaseHistoryList,
    totalRows,
  }
}

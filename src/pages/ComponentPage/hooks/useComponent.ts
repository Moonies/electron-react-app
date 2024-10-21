import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { AddNewComponentProps } from 'api/component/addNewComponent'
import { ComponentData, SearchCriteriaComponentList } from 'api/component/getComponentList'
import { UpdateComponentProps } from 'api/component/updateComponents'
import { api } from 'api/index'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import React, { useCallback, useMemo, useState } from 'react'
import { formatJPY } from 'utils/formatUtils'
type CategoryProductSearch = {
  value: string
  display: string
}

export default function useComponent() {
  const [categorySearch, setCategorySearch] = useState<CategoryProductSearch[]>()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaComponentList>({
    category: '',
    keyword: '',
  })
  const [componentListData, setComponentListData] = useState<ComponentData[]>([])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const { withLoading, setLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: '商品番号', headerAlign: 'center', flex: 1 },

      { field: 'name', headerName: '商品名', headerAlign: 'center', flex: 1 },
      {
        field: 'price',
        headerName: '単価',
        headerAlign: 'center',
        flex: 1,
        valueFormatter: value => formatJPY(Number(value)),
        // minWidth: 200,
      },
      { field: 'quantity', headerName: '数量', headerAlign: 'center', flex: 1 },
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

  const handleSearch = useCallback(async () => {
    //if have another event
    getComponentListData()
  }, [searchCriteria, withLoading])

  const getComponentListData = async () => {
    const result = await withLoading(api.component.getComponentList(searchCriteria))
    if (result.code === 200 && result.data) {
      setComponentListData(result.data)
    }
  }

  const getComponentDetail = async (componentId: string) => {
    const result = await api.component.getComponentDetail(componentId)
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

  const handlePaginationModelChange = () => {}
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
    getComponentDetail,
    addNewComponent,
    updateComponent,
  }
}

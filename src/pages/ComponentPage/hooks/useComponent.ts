import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { ComponentData, SearchCriteriaComponentList } from 'api/component/getComponentList'
import { api } from 'api/index'
import useLoading from 'hooks/useLoading'
import React, { useCallback, useMemo, useState } from 'react'

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

  const { withLoading } = useLoading()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'componentNumber', headerName: '商品番号', headerAlign: 'center', flex: 1 },

      { field: 'componentName', headerName: '商品名', headerAlign: 'center', flex: 1 },
      {
        field: 'price',
        headerName: '単価',
        headerAlign: 'center',
        flex: 1,
        // minWidth: 200,
      },
      { field: 'inStock', headerName: '数量', headerAlign: 'center', flex: 1 },
      { field: 'lastestPriceDate', headerName: '単価時点', headerAlign: 'center', flex: 1 },
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
    console.log(searchCriteria)
    //if condition when search put in here, may be is not use when column filed is equal column in table
    // let newCategory: string
    // switch (searchCriteria.category) {
    //   case 'componentNumber':
    //     break
    //   case 'componentName':
    //     break
    //   case 'price':
    //     break
    //   case 'inStock':
    //     break

    //   default:
    //     break
    // }
    // getComponentListData(paginationModel)
    getComponentListData()
  }, [searchCriteria, withLoading])

  const getComponentListData = async () => {
    const result = await withLoading(api.component.getComponentList())
    if (result.code === 200 && result.data) {
      setComponentListData(result.data)
    }
  }

  const getComponentDetail = async (componentId: string) => {
    const result = await api.component.getComponentDetail(componentId)
    if (result.code === 200 && result.data) {
      return result.data
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
  }
}

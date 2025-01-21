import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { OrderStatus } from 'api/order'
// import { api } from 'api/index'
import { PurchaseStatus } from 'api/purchase'
import { PurchaseData, SearchCriteria } from 'api/purchase/getPurchaseList'
import { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import dayjs from 'dayjs'
import useHttp from 'hooks/useHttp'
import useLoading from 'hooks/useLoading'
import React, { useCallback, useMemo, useState } from 'react'

interface CategorySaleSearch {
  value: string
  display: string
}
interface CachedData {
  [key: string]: PurchaseData[]
}

export default function usePurchase() {
  const dateThreeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const { withLoading, setLoading } = useLoading()
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([])
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const statusPurchase = Object.values(PurchaseStatus)
  const { api } = useHttp()
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
    dateType: '',
  })
  const dateTypeList = [
    { value: 'registrationDate', display: '登録日' },
    { value: 'deliveryDate', display: '入庫日付' },
  ]

  const handleChange = (name: string, value: string | Date | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>()

  const handleSearch = useCallback(async () => {
    //if condition when search put in here
    setCachedData({})
    getPurchaseListData(paginationModel)
  }, [searchCriteria, withLoading, paginationModel])

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderCode',
        headerName: '受注番号',
        headerAlign: 'center',
      },
      {
        field: 'purchaseCode',
        headerName: '注番',
        headerAlign: 'center',
      },
      {
        field: 'companyName',
        headerName: '仕入先名',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (value, row: any) => (row.company ? row.company.companyInfo.name : ''),
      },
      // { field: 'orderId', headerName: '注番', headerAlign: 'center' },
      { field: 'registrationDate', headerName: '登録日', headerAlign: 'center' },
      {
        field: 'owners',
        headerName: '担当者',
        headerAlign: 'center',
        valueGetter: (value: { id: string; name: string }[]) =>
          value.length > 0 ? value[0].name : '',
      },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      // { field: 'quotationRequestDate', headerName: '見積日', headerAlign: 'center' },
      { field: 'deliveryDate', headerName: '入庫日付', headerAlign: 'center' },
      // { field: 'orderApprovedEmployeeName', headerName: '承認者', headerAlign: 'center' },
      // { field: 'purchaseApprovedDate', headerName: '見積書依頼', headerAlign: 'center' },
      // { field: 'purchaseReciptDate', headerName: '入庫承認済', headerAlign: 'center' },
    ],
    []
  )

  const prepareCategorySearch = useMemo(() => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      if (['status', 'registrationDate', 'deliveryDate'].includes(item.field)) {
        return
      }
      if (item.field === 'companyName') {
        return result.push({
          value: 'company.companyInfo.name',
          display: item.headerName || '',
        })
      }

      if (item.field === 'owners') {
        return result.push({
          value: 'owners.name',
          display: item.headerName || '',
        })
      }

      result.push({
        value: item.field,
        display: item.headerName || '',
      })
    })
    setCategorySearch(result)
  }, [])

  const mappingStatus = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'PENDING'
      case OrderStatus.CONFIRM:
        return 'CONFIRM'
      case OrderStatus.COMPLETE:
        return 'COMPLETE'
      case OrderStatus.CANCEL:
        return 'CANCEL'
      case OrderStatus.REJECT:
        return 'REJECT'

      default:
        return ''
    }
  }

  const handleSelectedSaleDetail = (selectedData: PurchaseData) => {
    let purchaseDetail: PurchaseModalDataProps = {
      id: selectedData.id,
      orderCode: selectedData.orderCode,
      purchaseCode: selectedData.purchaseCode,
      invoiceNumber: selectedData.invoiceNumber,
      supplierCompanyId: selectedData.companyId ?? '',
      supplierCompanyName: selectedData.company?.companyInfo.name ?? '',
      component: selectedData.components.map(item => ({
        ...item,
        id: item.number + item.name,
      })),
      orderRequestEmployeeId: selectedData.createdBy,
      memo: selectedData.memo,
      registrationDate: selectedData.registrationDate,
      totalAmount: selectedData.totalAmount,
      status: mappingStatus(selectedData.status),
      owners: selectedData.owners,
      deliveryDate: selectedData.deliveryDate,
    }
    return purchaseDetail
  }
  const getPurchaseListData = async ({ page, pageSize }: GridPaginationModel) => {
    setLoading(true)
    let prepareSearhCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      page,
      pageSize,
    }

    const result = await api.purchase.getPurchaseList(prepareSearhCriteria)
    if (result.code === 200 && result.data) {
      setPurchaseData(result.data)
      setTotalRows(result.page?.totalElements ?? 0)
      setCachedData(prevCache => ({
        ...prevCache,
        [`${page}-${pageSize}`]: result.data ? result.data : [],
      }))
    }
    setLoading(false)
  }

  const getAllPurchaseData = async () => {
    let allSearchCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
      pageSize: totalRows,
    }
    const result = await api.purchase.getPurchaseList(allSearchCriteria)
    if (result.code === 200 && result.data) {
      return result.data
    }
    return []
  }
  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
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
      setPurchaseData(cachedData[cacheKey])
      return
    } else if (purchaseData.length !== 0) {
      getPurchaseListData(newModel)
    }
  }
  return {
    searchCriteria,
    handleChange,
    handleSearch,
    columns,
    purchaseData,
    paginationModel,
    handlePaginationModelChange,
    prepareCategorySearch,
    categorySearch,
    statusPurchase,
    dateTypeList,
    totalRows,
    getAllPurchaseData,
    handleSelectedSaleDetail,
  }
}

import { useState, useCallback, useMemo } from 'react'
import { subMonths } from 'date-fns'
import { saleList } from 'api'
import useLoading from 'hooks/useLoading'
import { GridColDef } from '@mui/x-data-grid'
import { SalesData, SalesSummary, SearchCriteria } from 'api/sales/saleList'

interface PaginationModel {
  page: number
  pageSize: number
}

export default function useSales() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
  })

  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const { withLoading } = useLoading()

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'invoiceNumber',
        headerName: '伝票番号',
        headerAlign: 'center',
        // minWidth: 100,
        // flex: 1,
        // valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
      },
      { field: 'customerName', headerName: '取引先', minWidth: 150, headerAlign: 'center' },
      { field: 'deliveryDate', headerName: '納入日', headerAlign: 'center' },
      { field: 'productId', headerName: '図番', minWidth: 100, headerAlign: 'center' },
      { field: 'productName', headerName: '品名', minWidth: 100, headerAlign: 'center' },
      { field: 'quantity', headerName: '数量', type: 'number', headerAlign: 'center' },
      {
        field: 'unitPrice',
        headerName: '単価',
        type: 'number',
        headerAlign: 'center',
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      {
        field: 'totalPrice',
        headerName: '金額',
        type: 'number',
        headerAlign: 'center',
        valueFormatter: value => currencyFormatter.format(Number(value)),
      },
      { field: 'employeeName', headerName: '担当者名', headerAlign: 'center' },
      { field: 'orderApprovedEmployee', headerName: '発注担当', headerAlign: 'center' },
      { field: 'orderId', headerName: '受注番号', headerAlign: 'center' },
    ],
    []
  )

  const handleSearch = useCallback(async () => {
    const result = await withLoading(saleList(searchCriteria))
    if (result.code === 200 && result.data) {
      setSalesSummary(result.data.summary)
      setSalesData(result.data.data)
    }
  }, [searchCriteria, withLoading])

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    console.log('change pagination')
    setPaginationModel(newModel)
    //call APi
  }

  const addNewSaleData = useCallback(() => {
    //call api to insert
  }, [])

  const updateSaleData = useCallback(() => {
    //call api to update
    //and refersh dataTable
  }, [])

  return {
    searchCriteria,
    handleChange,
    handleSearch,
    salesSummary,
    salesData,
    columns,
    handlePaginationModelChange,
    paginationModel,
    currencyFormatter,
    addNewSaleData,
    updateSaleData,
  }
}

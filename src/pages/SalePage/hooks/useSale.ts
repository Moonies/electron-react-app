import { useState, useCallback } from 'react'
import { subMonths } from 'date-fns'
import { saleList } from 'api'
import useLoading from 'hooks/useLoading'
import { GridColDef } from '@mui/x-data-grid'
import { SalesData, SalesSummary, SearchCriteria } from 'api/sales/saleList'

export default function useSales() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
  })

  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])

  const { withLoading } = useLoading()

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }
  const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  })
  const columns: GridColDef[] = [
    {
      field: 'invoiceNumber',
      headerName: '伝票番号',
      // flex: 1,
      // valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
    },
    { field: 'customerName', headerName: '取引先', flex: 1 },
    { field: 'deliveryDate', headerName: '納入日' },
    { field: 'productId', headerName: '図番' },
    { field: 'productName', headerName: '品名' },
    { field: 'quantity', headerName: '数量' },
    {
      field: 'unitPrice',
      headerName: '単価',
      valueFormatter: value => currencyFormatter.format(Number(value)),
    },
    {
      field: 'totalPrice',
      headerName: '金額',
      valueFormatter: value => currencyFormatter.format(Number(value)),
    },
    { field: 'employeeName', headerName: '担当者名' },
    { field: 'orderApprovedEmployee', headerName: '発注担当' },
    { field: 'orderId', headerName: '受注番号' },
  ]

  const handleSearch = useCallback(async () => {
    const result = await withLoading(saleList(searchCriteria))
    if (result.code === 200 && result.data) {
      setSalesSummary(result.data.summary)
      setSalesData(result.data.data)
    }
  }, [searchCriteria, withLoading])

  return {
    searchCriteria,
    handleChange,
    handleSearch,
    salesSummary,
    salesData,
    columns,
  }
}

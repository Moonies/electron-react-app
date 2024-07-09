import { useState, useCallback } from 'react'
import { subMonths } from 'date-fns'
import { ApiResponse } from 'api'
import useLoading from 'hooks/useLoading'

interface SearchCriteria {
  category: string
  keyword: string
  startDate: Date
  endDate: Date
}

interface SalesSummary {
  totalSales: number
  averageOrderValue: number
  topSellingProduct: string
}

interface SalesData {
  id: number
  date: string
  product: string
  amount: number
}

// This should be replaced with your actual API call
const fetchSalesData = async (
  criteria: SearchCriteria
): Promise<ApiResponse<{ summary: SalesSummary; data: SalesData[] }>> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: {
      summary: {
        totalSales: 10000,
        averageOrderValue: 100,
        topSellingProduct: 'Product A',
      },
      data: [
        { id: 1, date: '2023-01-01', product: 'Product A', amount: 100 },
        { id: 2, date: '2023-01-02', product: 'Product B', amount: 150 },
        { id: 3, date: '2023-01-02', product: 'Product c', amount: 20 },
        { id: 4, date: '2023-01-02', product: 'Product D', amount: 10 },
        { id: 5, date: '2023-01-02', product: 'Product E', amount: 166660 },

        // Add more mock data as needed
      ],
    },
  }
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

  const { withLoading } = useLoading()

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = useCallback(async () => {
    const result = await withLoading(fetchSalesData(searchCriteria))
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
  }
}

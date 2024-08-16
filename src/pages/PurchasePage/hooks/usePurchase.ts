import { SearchCriteria } from 'api/purchase/getPurchaseList'
import dayjs from 'dayjs'
import React, { useState } from 'react'

interface CategorySaleSearch {
  value: string
  display: string
}

export default function usePurchase() {
  const dateThreeMonthsAgo = dayjs().subtract(6, 'month').toDate()

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
    startDate: dateThreeMonthsAgo,
    endDate: new Date(),
  })

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }
  return { searchCriteria, handleChange }
}

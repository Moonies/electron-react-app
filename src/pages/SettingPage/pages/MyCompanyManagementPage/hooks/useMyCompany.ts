import { api } from 'api/index'
import { MyCompanyDetail } from 'api/myCompany/getMyCompanyDetail'
import useLoading from 'hooks/useLoading'
import { useState } from 'react'

export default function useMyCompany() {
  const [myCompanyDetail, setMyCompanyDetail] = useState<Partial<MyCompanyDetail | null>>()
  const { withLoading } = useLoading()
  const getMyCompanyDetail = async () => {
    const result = await withLoading(api.myCompany.getMyCompanyDetail())
    if (result.code === 200) {
      setMyCompanyDetail(result.data)
    }
  }
  const getPostCode = async (postCode: string) => {
    const result = await withLoading(api.postCode.getPostCode({ postCode: postCode }))
    if (result.code === 200) {
      setMyCompanyDetail(prev => ({
        ...prev,
        ['companyPerfecture']: 'aaaa',
        ['companyCity']: 'bbbbbb',
      }))
    }
  }

  return { myCompanyDetail, getMyCompanyDetail, getPostCode }
}

import { api } from 'api/index'
import useLoading from 'hooks/useLoading'
import React, { useState } from 'react'
import { formatPhoneNumber } from 'utils/formatUtils'
import { DeliverySlipData, SlipDetail } from '..'

const initSlip: SlipDetail = {
  customerNumber: '',
  customerName: '',
  customerFullAddress: '',
  customerTel: '',
  customerFax: '',
  myCompanyName: '',
  myCompanyFullAddress: '',
  myCompanyTel: '',
  myCompanyFax: '',
  id: '',
  orderNumber: '',
  orderShippingDate: '',
  orderShippingExpireDate: '',
  totalProduct: 0,
}
export default function useSubOrder(data: DeliverySlipData) {
  const [slipData, setSlipData] = useState<SlipDetail>(initSlip)
  // const { setLoading } = useLoading()
  const prepareNewSlipData = async () => {
    // setLoading(true)
    const [customer, myCompany] = await Promise.all([
      getCustomerDetail(data.customerCompanyId),
      getMyCompanyDetail(),
    ])
    let newSlipData: SlipDetail = {
      customerNumber: customer?.id ?? '',
      customerName: customer?.name ?? '',
      customerFullAddress: customer?.fullAddress ?? '',
      customerTel: customer?.phoneNumber ?? '',
      customerFax: customer?.fax ?? '',
      myCompanyName: myCompany?.name ?? '',
      myCompanyFullAddress: myCompany?.fullAddress ?? '',
      myCompanyTel: myCompany?.phoneNumber ?? '',
      myCompanyFax: myCompany?.fax ?? '',
      id: data.id,
      orderNumber: data.orderId,
      orderShippingDate: data.shippingmentDate,
      orderShippingExpireDate: '',
      totalProduct: data.product.length,
    }

    setSlipData(newSlipData)
    // setLoading(false)
  }

  const getCustomerDetail = async (customerId: string) => {
    const { data } = await api.customer().getCustomerDetailById(customerId)
    if (data) {
      return {
        id: data.id,
        name: data.customerName,
        fullAddress: data.prefecture + data.city + data.street + data.addressCode,
        phoneNumber: formatPhoneNumber(data.phoneNumber),
        fax: formatPhoneNumber(data.faxNumber) ?? '',
      }
    }
  }

  const getMyCompanyDetail = async () => {
    const { data } = await api.myCompany().getMyCompanyDetail()
    if (data) {
      return {
        name: data.companyName,
        fullAddress: data.companyPerfecture + data.companyCity + data.companyAddressCode,
        phoneNumber: formatPhoneNumber(data.companyPhoneNumber),
        fax: formatPhoneNumber(data.companyFax),
      }
    }
  }

  return { slipData, prepareNewSlipData }
}

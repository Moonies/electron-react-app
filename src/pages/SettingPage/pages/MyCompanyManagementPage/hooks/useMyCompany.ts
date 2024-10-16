import { api } from 'api/index'
import { NewMyCompanyDetailData } from 'api/myCompany/addNewMyCompanyDetail'
// import { MyCompanyDetail } from 'api/myCompany/getMyCompanyDetail'
import { UpdateMyCompanyDetailData } from 'api/myCompany/updateMyCompanyDetail'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useState } from 'react'
import { deConvertPostalCode } from 'utils/formatUtils'

export type MyCompanyDetail = {
  id: string
  name: string
  buildingName: string
  streetAddress: string
  city: string
  prefecture: string
  postalCode: string
  phoneNumber: string
  email: string
  fax?: string
  accountNumber: string
  corporationNumber: string
  tax: number
}

interface UploadedImage {
  file?: File
  previewUrl: string
}

export default function useMyCompany() {
  const [formCompanyDetail, setFormCompanyDetail] = useState<Partial<MyCompanyDetail>>({})
  const { withLoading, setLoading } = useLoading()
  const { notificationModal, notificationSnackbar } = useNotification()
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)

  const getMyCompanyDetail = async () => {
    const result = await withLoading(api.myCompany.getMyCompanyDetail())
    if (result.code === 200 && result.data) {
      let newData: MyCompanyDetail = {
        id: result.data.id,
        accountNumber: result.data.accountNumber,
        corporationNumber: result.data.corporationNumber,
        tax: result.data.tax,
        city: result.data.companyInfo.address.city,
        postalCode: result.data.companyInfo.address.postalCode,
        prefecture: result.data.companyInfo.address.prefecture,
        streetAddress: result.data.companyInfo.address.streetAddress,
        buildingName: result.data.companyInfo.buildingName ?? '',
        email: result.data.companyInfo.email,
        fax: result.data.companyInfo.fax ?? '',
        name: result.data.companyInfo.name,
        phoneNumber: result.data.companyInfo.phoneNumber,
      }

      setFormCompanyDetail(newData)
      getSeal(result.data.id)
    }
  }

  const getPostCode = async (postCode: string) => {
    const result = await withLoading(api.postCode.getPostCode(postCode))
    if (result.code === 200 && result.data) {
      setFormCompanyDetail(prev => ({
        ...prev,
        ['postalCode']: postCode,
        ['prefecture']: result.data?.prefecture ?? '',
        ['city']: result.data?.city,
      }))
    } else {
      notificationSnackbar.error(result.message)
      setFormCompanyDetail(prev => ({
        ...prev,
        ['postalCode']: postCode,
        ['prefecture']: undefined,
        ['city']: undefined,
      }))
    }
  }

  //just first time to setting
  const addNewMyCompanyDetail = async (data: MyCompanyDetail, file?: File) => {
    setLoading(true)
    let newData: NewMyCompanyDetailData = {
      accountNumber: data.accountNumber,
      corporationNumber: data.corporationNumber,
      tax: data.tax,
      companyInfo: {
        address: {
          city: data.city,
          postalCode: deConvertPostalCode(data.postalCode),
          prefecture: data.prefecture,
          streetAddress: data.streetAddress,
        },
        buildingName: data.buildingName ?? '',
        email: data.email,
        fax: data.fax ?? '',
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
    }
    const result = await api.myCompany.addNewMyCompanyDetail(newData)
    console.log(result)
    if (result.code === 200 && result.data) {
      if (file) {
        updateSeal(file, result.data.id)
      }
    } else {
      notificationSnackbar.error(result.message)
    }
    setLoading(false)
  }

  const updateCompanyDetail = async (data: MyCompanyDetail, file?: File) => {
    let newData: UpdateMyCompanyDetailData = {
      accountNumber: data.accountNumber,
      corporationNumber: data.corporationNumber,
      id: data.id,
      tax: data.tax,
      companyInfo: {
        address: {
          city: data.city,
          postalCode: data.postalCode,
          prefecture: data.prefecture,
          streetAddress: data.streetAddress,
        },
        buildingName: data.buildingName ?? '',
        email: data.email,
        fax: data.fax ?? '',
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
    }
    const result = await api.myCompany.updateMyCompanyDetail(newData)
    if (result.code === 200 && result.data) {
      if (file) {
        updateSeal(file, newData.id)
      } else {
        //delete seal
        if (uploadedImage?.previewUrl) {
          deleteSeal(newData.id)
        }
      }
      notificationModal.success('編集完了しました。')
    }
  }

  const updateSeal = async (sealFile: File, myCompanyId: string) => {
    //if company id should auto update but at confirm is shuold be update
    const result = await api.myCompany.updateMyCompanySeal({ id: myCompanyId, seal: sealFile })
    if (result.code === 200 && result.data) {
      notificationModal.success('編集完了しました。')
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const getSeal = async (myCompanyId: string) => {
    const result = await api.myCompany.getMyCompanySeal(myCompanyId)
    if (result.code === 200 && result.data?.seal) {
      setUploadedImage({ previewUrl: result.data.seal })
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  const deleteSeal = async (myCompanyId: string) => {
    const result = await api.myCompany.deleteMyCompanySeal(myCompanyId)
    if (result.code === 200) {
      //may be something but now is not process
    } else {
      notificationSnackbar.error(result.message)
    }
  }

  return {
    formCompanyDetail,
    setFormCompanyDetail,
    getMyCompanyDetail,
    getPostCode,
    updateCompanyDetail,
    addNewMyCompanyDetail,
    uploadedImage,
    setUploadedImage,
  }
}

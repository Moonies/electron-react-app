import useHttp from 'hooks/useHttp'
import { useState } from 'react'

export interface UploadedImage {
  file?: File
  previewUrl: string
}

export default function useProductImage() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage>()

  const { api } = useHttp()
  const getProductImage = async (productId: string) => {
    const result = await api.product.getProductImage(productId)
    if (result.code === 200 && result.data) {
      setUploadedImage({ previewUrl: result.data.image })
    }
  }
  return { getProductImage, uploadedImage, setUploadedImage }
}

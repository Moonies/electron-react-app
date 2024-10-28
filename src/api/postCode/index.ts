import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'
import { default as getPostCode, AddressData } from './getPostCode'

export interface PostCodeApi {
  getPostCode: (postCode: string) => Promise<ApiResponse<AddressData>>
}

export default function postCode(httpRequest: HttpRequest): PostCodeApi {
  return { getPostCode: postCode => getPostCode(httpRequest, postCode) }
}

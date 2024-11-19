import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as getStatusList, StatusDetail } from './getStatusList'

export interface StatusApi {
  getStatusList: () => Promise<ApiResponse<StatusDetail[]>>
}

export default function status(httpRequest: HttpRequest) {
  return { getStatusList: () => getStatusList(httpRequest) }
}

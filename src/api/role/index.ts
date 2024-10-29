import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as getRoleList, RoleData } from './getRoleList'

export interface RoleApi {
  getRoleList: () => Promise<ApiResponse<RoleData[]>>
}
export default function role(httpRequest: HttpRequest): RoleApi {
  return {
    getRoleList: () => getRoleList(httpRequest),
  }
}

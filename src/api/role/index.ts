import { ApiResponse } from 'api'
import { HttpRequest } from 'hooks/useHttp'
import { default as getRoleList, RoleData } from './getRoleList'

export interface ComponentApi {
  getRoleList: () => Promise<ApiResponse<RoleData[]>>
}

// export default function user(httpRequest: HttpRequest): UserApi {
//   return {
//     addNewUser: params => addNewUser(httpRequest, params),
//     checkAuth: (username, password) => checkAuth(username, password),
//     deleteUser: userid => deleteUser(httpRequest, userid),
//     getNewToken: (username, refreshToken) => getNewToken(httpRequest, username, refreshToken),
//     getUserDetail: username => getUserDetail(httpRequest, username),
//     getUserList: (page, pageSize) => getUserList(httpRequest, page, pageSize),
//     updateUser: params => updateUser(httpRequest, params),
//   }
// }

export default function component(httpRequest: HttpRequest): ComponentApi {
  return {
    getRoleList: () => getRoleList(httpRequest),
  }
}

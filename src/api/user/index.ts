import { default as checkAuth, AuthData } from './checkAuth'
import { default as getUserList, UserData } from './getUserList'
import { default as getUserDetail, UserDetail } from './getUserDetail'
import { default as addNewUser, AddNewUserData } from './addNewUser'
import { default as deleteUser } from './deleteUser'
import { default as updateUser, UpdateUserData } from './updateUser'
import { default as getNewToken } from './getNewToken'
import { default as getResetPasswordCode } from './getResetPasswordCode'
import { default as updatePassword, UpdatePasswordData } from './updatePassword'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'

export interface UserApi {
  addNewUser: (params: AddNewUserData) => Promise<ApiResponse<{}>>
  checkAuth: (username: string, password: string) => Promise<ApiResponse<AuthData>>
  deleteUser: (userId: string) => Promise<ApiResponse<{}>>
  getNewToken: (username: string, refreshToken: string) => Promise<ApiResponse<AuthData>>
  getUserDetail: (username: string) => Promise<ApiResponse<UserDetail>>
  getUserList: (page?: number, pageSize?: number) => Promise<ApiResponse<UserData[]>>
  updateUser: (params: UpdateUserData) => Promise<ApiResponse<null>>
  getResetPasswordCode: (email: string) => Promise<ApiResponse<{}>>
  updatePassword: (params: UpdatePasswordData) => Promise<ApiResponse<{}>>
}

export default function user(httpRequest: HttpRequest): UserApi {
  return {
    addNewUser: params => addNewUser(httpRequest, params),
    checkAuth: (username, password) => checkAuth(username, password), //not use authorization bearer
    deleteUser: userid => deleteUser(httpRequest, userid),
    getNewToken: (username, refreshToken) => getNewToken(username, refreshToken), //not use authorization bearer
    getUserDetail: username => getUserDetail(httpRequest, username),
    getUserList: (page, pageSize) => getUserList(httpRequest, page, pageSize),
    updateUser: params => updateUser(httpRequest, params),
    getResetPasswordCode: email => getResetPasswordCode(httpRequest, email),
    updatePassword: params => updatePassword(httpRequest, params),
  }
}

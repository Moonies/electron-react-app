import { default as componentApi } from 'api/component'
import { default as customerApi } from 'api/customer'
import { default as kpiApi } from 'api/kpi'
import { default as myCompanyApi } from 'api/myCompany'
import { default as orderApi } from 'api/order'
import { default as postCodeApi } from 'api/postCode'
import { default as prefectureApi } from 'api/perfecture'
import { default as productApi } from 'api/product'
import { default as purchaseApi } from 'api/purchase'
import { default as reportApi } from 'api/report'
import { default as roleApi } from 'api/role'
import { default as saleApi } from 'api/sale'
import { default as supplierApi } from 'api/supplier'
import { default as userApi } from 'api/user'

import axios, { AxiosResponse, AxiosError } from 'axios'
import useNotification from './useNotification'
import { useConfirmModal } from './useConfirmModal'
import useAuth from './useAuth'
import useLoading from './useLoading'

export type HttpRequest = (
  apiFunction: () => Promise<AxiosResponse>,
  disbleDisplayError?: boolean
  // options?: HttpRequestOptions
) => Promise<AxiosResponse | AxiosError | undefined>

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { getCurrentUser, getCurrentToken, setToken } = useAuth()
  const { setLoading } = useLoading()

  const httpRequest = async (
    apiFunction: () => Promise<AxiosResponse>,
    disbleDisplayError = false
  ): Promise<AxiosResponse | AxiosError | undefined> => {
    try {
      const response: AxiosResponse = await apiFunction()
      return response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (disbleDisplayError) return error
        if (error.response) {
          setLoading(false)
          switch (error.response.status) {
            case 401:
              const confirmed = await openConfirmModal({
                title: 'Token Expired',
                message: 'Please reconnect to refresh your session.',
              })

              if (confirmed) {
                const userData = getCurrentUser()
                const token = getCurrentToken()
                const result = await api.user.getNewToken(
                  userData?.username ?? '',
                  token?.refreshToken ?? ''
                )

                if (result.code === 200 && result.data) {
                  setToken(result.data)
                  // configApiManager.getToken()
                  notificationModal.info('Please try your action again.')
                } else {
                  notificationSnackbar.error('Authentication failed: ' + error.message)
                }
              }
              break

            default:
              notificationSnackbar.error(
                'Error: ' + error.message + `\n ${error.response.data.message}`
              )
              break
          }
        }
        return error
      }
      // return null
    }
  }

  // Pass `httpRequest` to the `user` API group
  const api = {
    user: userApi(httpRequest),
    role: roleApi(httpRequest),
    myCompany: myCompanyApi(httpRequest),
    postCode: postCodeApi(httpRequest),
    customer: customerApi(httpRequest),
  }

  return { api }
}

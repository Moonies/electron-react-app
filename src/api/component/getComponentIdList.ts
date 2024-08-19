import axios from 'axios'
import { ApiResponse } from 'api'
import dayjs from 'dayjs'

export interface ComponentIdData {
  id: string
  componentNumber: string
  componentName: string
}

export default async function getComponentIdList(
  query: string
): Promise<ApiResponse<ComponentIdData[]>> {
  //for beta:test
  //use props query to filter in component
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    code: 200,
    message: 'Success',
    data: [
      {
        id: '66b4118dcb5d152039f74147',
        componentNumber: 'HW327351070',
        componentName: 'Kulas - Will',
      },
      {
        id: '66b4118dcb5d152039f74149',
        componentNumber: 'HW206241140',
        componentName: 'Gleason - Schimmel',
      },
      {
        id: '66b4118dcb5d152039f7414b',
        componentNumber: 'HW206241150',
        componentName: 'Mayer - Mohr',
      },
      {
        id: '66b4118dcb5d152039f7414d',
        componentNumber: '66b4118dcb5d152039f7414d',
        componentName: 'Brekke Group',
      },
      {
        id: '66b4118dcb5d152039f7414f',
        componentNumber: '66b4118dcb5d152039f7414f',
        componentName: 'Kessler Group',
      },
    ],
  }
  // when use real API
  // try {
  //     const response = await axios.post<ApiResponse<AuthData>>('/api/auth', { username, password });
  //     return response.data;
  // } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //         return {
  //             code: error.response.status,
  //             message: error.response.data.message || 'An error occurred during authentication',
  //             data: null
  //         };
  //     }
  //     return {
  //         code: 500,
  //         message: 'An unexpected error occurred',
  //         data: null
  //     };
  // }
}

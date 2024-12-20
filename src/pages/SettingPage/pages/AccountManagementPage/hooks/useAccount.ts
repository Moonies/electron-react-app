import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { AddNewUserData } from 'api/user/addNewUser'
import { UserData } from 'api/user/getUserList'
import { UpdateUserData } from 'api/user/updateUser'
import useHttp from 'hooks/useHttp'
// import { UpdateUserData } from 'api/user/updateUser'
import useLoading from 'hooks/useLoading'
import useNotification from 'hooks/useNotification'
import { useMemo, useState } from 'react'

interface PaginationModel {
  page: number
  pageSize: number
}
interface CachedData {
  [key: string]: UserData[]
}

export default function useAccount() {
  const [userListData, setUserListData] = useState<UserData[]>([])
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 100,
  })
  const [cachedData, setCachedData] = useState<CachedData>({})
  const { notificationModal } = useNotification()
  const { api } = useHttp()
  const { withLoading, setLoading } = useLoading()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: '社員番号', headerAlign: 'center' },
      { field: 'mail', headerName: 'メール', headerAlign: 'center' },
      // {
      //   field: 'password',
      //   headerName: 'パスワード',
      //   headerAlign: 'center',
      //   // minWidth: 200,
      // },
      { field: 'name', headerName: '名前', headerAlign: 'center' },
      {
        field: 'role',
        headerName: '役柄',
        headerAlign: 'center',
        // minWidth: 200,
        valueGetter: (value: { id: string; label: string }) => value.label, //now backend is progressing
      },
    ],
    []
  )

  const getUserList = async ({ page, pageSize }: GridPaginationModel) => {
    const result = await withLoading(api.user.getUserList(page, pageSize))
    if (result.code === 200 && result.data) {
      setUserListData(result.data)
    }
  }

  const addNewUser = async (newUserData: AddNewUserData) => {
    setLoading(true)
    const result = await api.user.addNewUser(newUserData)
    // console.log(result)
    if (result.code === 200) {
      return true
    }
    setLoading(false)
  }

  const deleteUser = async (selectedUserId: string) => {
    setLoading(true)
    const result = await api.user.deleteUser(selectedUserId)
    if (result.code === 200) {
      return true
      // notificationModal.success('削除完了しました。')
      // getUserList(paginationModel)
    }
    // setLoading(false)
  }

  const updateUser = async (newDataUser: UpdateUserData) => {
    setLoading(true)
    const result = await api.user.updateUser(newDataUser)
    if (result.code === 200) {
      return true
      // notificationModal.success('編集完了しました。')
      // getUserList(paginationModel)
    }
    // setLoading(false)
  }

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel)
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`
    if (cachedData[cacheKey]) {
      setUserListData(cachedData[cacheKey])
      return
    } else if (userListData.length !== 0) {
      getUserList(newModel)
    }
    //call APi
  }
  return {
    columns,
    getUserList,
    userListData,
    paginationModel,
    handlePaginationModelChange,
    addNewUser,
    deleteUser,
    updateUser,
  }
}

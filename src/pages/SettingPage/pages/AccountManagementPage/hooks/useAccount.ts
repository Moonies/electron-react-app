import { GridColDef } from '@mui/x-data-grid'
import { api } from 'api/index'
import { UserData } from 'api/user/getUserList'
import useLoading from 'hooks/useLoading'
import { useMemo, useState } from 'react'

interface PaginationModel {
  page: number
  pageSize: number
}

export default function useAccount() {
  const [userListData, setUserListData] = useState<UserData[]>([])
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const { withLoading } = useLoading()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'username', headerName: 'ユーザーネーム', headerAlign: 'center' },
      {
        field: 'password',
        headerName: 'パスワード',
        headerAlign: 'center',
        // minWidth: 200,
      },
      { field: 'fullName', headerName: '名前', headerAlign: 'center' },
      {
        field: 'role',
        headerName: '役柄',
        headerAlign: 'center',
        // minWidth: 200,
      },
    ],
    []
  )

  const getUserList = async () => {
    const result = await withLoading(api.user().getUserList({ username: 'aaaa' }))
    if (result.code === 200 && result.data) {
      setUserListData(result.data)
    }
  }

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel)
    //call APi
  }
  return { columns, getUserList, userListData, paginationModel, handlePaginationModelChange }
}

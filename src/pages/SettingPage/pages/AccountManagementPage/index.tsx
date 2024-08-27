import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { StyledButton } from 'styles/styles'
import {
  Delete as DeleteIcon,
  // Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import DataTable from 'components/DataTable'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import useAccount from './hooks/useAccount'
import AccountManagementModal from 'components/Modals/AccountManagementModal'
import { UserData } from 'api/user/getUserList'

export default function AccountManagementPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const accountDataGridRef = useGridApiRef()
  const [filterValue, setFilterValue] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | undefined>()

  const { columns, getUserList, userListData, paginationModel, handlePaginationModelChange } =
    useAccount()

  useEffect(() => {
    if (accountDataGridRef.current) {
      accountDataGridRef.current.autosizeColumns({
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [userListData])

  useEffect(() => {
    getUserList()
  }, [])

  const handleAddClick = () => {
    // setSelectedProduct(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = userListData.find(user => user.userId === selectedId)
      if (selectedData) {
        setModalMode('edit')
        setSelectedUser(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = userListData.find(user => user.userId === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: 'Are you sure you want to delete this User Name : ' + selectedData.username,
        })
        if (confirmed) {
          // Perform delete operation
          console.log('Delete confirmed')
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('Please select a row in the table to delete.')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: any) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      const confirmed = await openConfirmModal({
        title: '確認してください',
        message: 'Are you sure you want to add data.',
      })
      if (confirmed) {
        // Perform delete operation
        console.log('Add confirmed')
      } else {
        console.log('Add cancelled')
      }
      // addNewSaleData()
    } else {
    }
    // After successful add/edit, refetch the data
    // await fetchSalesData(paginationModel);
  }

  const filteredRows = () => {
    return userListData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    )
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>アカウント管理</Divider>
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 2,
          p: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '40%',
            }}
          >
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <Box display={'flex'} flex={1}>
                <TextField
                  fullWidth
                  name='keyword'
                  label='検索'
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
          <Divider orientation='vertical' sx={{ marginLeft: 'auto' }}></Divider>
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
              >
                追加
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<DeleteIcon />}
                size='large'
                onClick={handleDeleteClick}
              >
                削除
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                onClick={handleEditClick}
              >
                編集
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
                visible
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <DataTable
          data={filteredRows()}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={accountDataGridRef}
          getRowId={row => row.userId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <AccountManagementModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedUser}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

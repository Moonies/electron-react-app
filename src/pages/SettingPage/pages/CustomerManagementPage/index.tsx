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
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import DataTable from 'components/DataTable'
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import useCustomer from './hooks/useCustomer'
import CustomerManagementModal, {
  ModalCustomerProps,
} from 'components/Modals/CustomerManagementModal'
import { CustomerData } from 'api/customer/getCustomerList'
import { UpdateCustomerDetailProps } from 'api/customer/updateCustomerDetail'
import { deConvertPostalCode } from 'utils/formatUtils'

export default function CustomerManagementPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const customerDataGridRef = useGridApiRef()
  const [filterValue, setFilterValue] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<ModalCustomerProps | undefined>()

  const {
    columns,
    paginationModel,
    getCusomerListData,
    customerListData,
    handlePaginationModelChange,
    updateSelectedCustomer,
    createNewCustomer,
    deleteSelectedCustomer,
  } = useCustomer()

  useEffect(() => {
    if (customerDataGridRef.current) {
      customerDataGridRef.current.autosizeColumns({
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [customerListData])

  useEffect(() => {
    getCusomerListData()
  }, [])

  const handleAddClick = () => {
    setSelectedCustomer(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = customerListData.find(item => item.id === selectedId)
      if (selectedData) {
        let selectedCustomerData: ModalCustomerProps = {
          companyCode: selectedData.companyCode,
          companyType: selectedData.companyType,
          name: selectedData.companyInfo.name,
          buildingName: selectedData.companyInfo.buildingName,
          streetAddress: selectedData.companyInfo.address.streetAddress,
          city: selectedData.companyInfo.address.city,
          prefecture: selectedData.companyInfo.address.prefecture,
          postalCode: selectedData.companyInfo.address.postalCode,
          phoneNumber: selectedData.companyInfo.phoneNumber,
          email: selectedData.companyInfo.email,
          fax: selectedData.companyInfo.fax,
          closingDay: selectedData.closingDay,
          paymentDeadline: selectedData.paymentDeadline,
          id: selectedData.id,
        }
        setModalMode('edit')
        setModalOpen(true)
        setSelectedCustomer(selectedCustomerData)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = customerListData.find(item => item.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: `この選ばれた　 ${selectedData.companyInfo.name}　を削除してもよろしいですか?`,
        })
        if (confirmed) {
          // Perform delete operation
          const result = await deleteSelectedCustomer(selectedData.id)
          if (result) getCusomerListData()
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: ModalCustomerProps) => {
    // Implement add/edit functionality
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'このデータを保存しますか。',
    })
    if (confirmed) {
      let newCustomerData = {
        // closingDay: data.closingDay,
        companyCode: data.companyCode,
        companyInfo: {
          address: {
            city: data.city,
            postalCode: deConvertPostalCode(data.postalCode),
            prefecture: data.prefecture,
            streetAddress: data.streetAddress,
          },
          buildingName: data.buildingName,
          email: data.email,
          fax: data.fax,
          name: data.name,
          phoneNumber: data.phoneNumber,
        },
        companyType: 'customer',
        // paymentDeadline: data.paymentDeadline,
      }
      // Perform delete operation
      if (modalMode === 'add') {
        // console.log(newCustomerData)
        const result = await createNewCustomer(newCustomerData)
        if (result) {
          getCusomerListData()
          setModalOpen(false)
        }
      } else {
        if (data.id) {
          //check id again when modalMode !== 'add'
          const result = await updateSelectedCustomer({ id: data.id, ...newCustomerData })
          if (result) {
            getCusomerListData()
            setModalOpen(false)
          }
        }
      }
    } else {
      console.log('Add cancelled')
    }
  }

  const filteredRows = () => {
    return customerListData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    )
  }

  const handleClear = () => {
    setFilterValue('')
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>顧客管理</Divider>
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
                  label='キーワード検索'
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {filterValue && (
                          <IconButton onClick={handleClear} edge='end'>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
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
          apiref={customerDataGridRef}
          getRowId={row => row.id}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <CustomerManagementModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedCustomer}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

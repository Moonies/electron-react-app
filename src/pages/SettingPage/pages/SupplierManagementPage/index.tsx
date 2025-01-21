import { useCallback, useEffect, useMemo, useState } from 'react'
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
import useSupplier from './hooks/useSupplier'
import { SupplierData } from 'api/supplier/getSupplierList'
import SupplierManagementModal, {
  ModalSupplierProps,
} from 'components/Modals/SupplierManagementModal'
import { deConvertPostalCode } from 'utils/formatUtils'

export default function SupplierManagementPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const supplierDataGridRef = useGridApiRef()
  const [filterValue, setFilterValue] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<ModalSupplierProps | undefined>()

  const {
    columns,
    paginationModel,
    handlePaginationModelChange,
    getSupplierListData,
    supplierListData,
    createNewSupplier,
    deleteSelectedSupplier,
    updateSelectedSupplier,
  } = useSupplier()

  useEffect(() => {
    if (supplierDataGridRef.current) {
      supplierDataGridRef.current.autosizeColumns({
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [supplierListData])

  useEffect(() => {
    getSupplierListData(paginationModel)
  }, [])

  const handleAddClick = () => {
    setSelectedSupplier(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = supplierListData.find(item => item.id === selectedId)
      if (selectedData) {
        let selectedCustomerData: ModalSupplierProps = {
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
        setSelectedSupplier(selectedCustomerData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = supplierListData.find(item => item.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: `この選ばれた　 ${selectedData.companyInfo.name}　を削除してもよろしいですか?`,
          // message: 'Are you sure you want to delete this Name : ' + selectedData.customerName,
        })
        if (confirmed) {
          const result = await deleteSelectedSupplier(selectedData.id)
          if (result) getSupplierListData(paginationModel)
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: ModalSupplierProps) => {
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'このデータを保存しますか。',
    })
    if (confirmed) {
      let newSupplierData = {
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
        companyType: 'supplier',
      }

      if (modalMode === 'add') {
        const result = await createNewSupplier(newSupplierData)
        if (result) {
          getSupplierListData(paginationModel)
          setModalOpen(false)
        }
      } else {
        //check id again
        if (data.id) {
          const result = await updateSelectedSupplier({ id: data.id, ...newSupplierData })
          if (result) {
            getSupplierListData(paginationModel)
            setModalOpen(false)
          }
        }
      }
    } else {
      //something function or nothing
      console.log('Add cancelled')
    }
  }

  const filteredRows = () => {
    return supplierListData.filter(row =>
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
          <Divider textAlign='left'>仕入先管理</Divider>
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
          apiref={supplierDataGridRef}
          getRowId={row => row.id}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <SupplierManagementModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedSupplier}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

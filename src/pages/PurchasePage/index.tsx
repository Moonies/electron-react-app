import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Button,
} from '@mui/material'
import { useGridApiRef, GridRowProps, GridRowSelectionModel } from '@mui/x-data-grid'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  UploadFile as UploadFileIcon,
  ContentPasteSearch as DetailIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StyledButton } from 'styles/styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { exportToPdf, exportToXlsx } from 'utils/exportUtils'
import useNotification from 'hooks/useNotification'
import usePurchase from './hooks/usePurchase'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import PurchaseModal, { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import useExportPurchase from './hooks/useExportPurchase'

export default function PurchasePage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    columns,
    paginationModel,
    purchaseData,
    handlePaginationModelChange,
    prepareCategorySearch,
    categorySearch,
    statusPurchase,
    convertStatus,
    dateTypeList,
    totalRows,
    getAllPurchaseData,
  } = usePurchase()
  const { exportPurchaseSelected } = useExportPurchase()
  const purchaseDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseModalDataProps>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()

  useEffect(() => {
    if (purchaseDataGridRef.current) {
      purchaseDataGridRef.current.autosizeColumns({
        // columns: ['customerName', 'productName'],
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [purchaseData])

  useEffect(() => {
    prepareCategorySearch
  }, [])

  const handleAddClick = () => {
    setSelectedPurchase(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    // if (selectionModel.length === 1) {
    //   const selectedId = selectionModel[0]
    //   const selectedData = purchaseData.find(item => item.id === selectedId)
    //   if (selectedData) {
    //     setModalMode('edit')
    //     setSelectedPurchase(selectedData)
    //     setModalOpen(true)
    //   }
    // } else {
    //   notificationModal.error('編集する表の行を選択してください。')
    // }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    // if (selectionModel.length === 1) {
    //   const selectedId = selectionModel[0]
    //   const selectedData = purchaseData.find(item => item.id === selectedId)
    //   if (selectedData) {
    //     const confirmed = await openConfirmModal({
    //       title: '確認してください',
    //       message: `この選ばれたの注番　 ${selectedData.invoiceNumber}　を削除してもよろしいですか?`,
    //       // message:
    //       //   'Are you sure you want to delete this Invoice Number: ' + selectedData.invoiceNumber,
    //     })
    //     if (confirmed) {
    //       // Perform delete operation
    //       console.log('Delete confirmed')
    //     } else {
    //       console.log('Delete cancelled')
    //     }
    //   }
    // } else {
    //   notificationModal.error('削除する行をテーブルから選択してください')
    // }
  }, [selectionModel])

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = purchaseData.find(item => item.id === selectedId)
      if (selectedData) {
        let purchaseDetail: PurchaseModalDataProps = {
          id: selectedData.id,
          orderCode: selectedData.orderCode,
          purchaseCode: selectedData.purchaseCode,
          invoiceNumber: selectedData.invoiceNumber,
          supplierCompanyId: selectedData.companyId ?? '',
          supplierCompanyName: selectedData.company?.companyInfo.name ?? '',
          component: selectedData.components.map(item => ({
            id: item.number + item.name,
            name: item.name,
            number: item.number,
            quantity: item.quantity,
            price: item.price,
          })),
          orderRequestEmployeeId: selectedData.createdBy,
          orderRequestEmployeeName: '',
          orderApprovedEmployeeId: '',
          orderApprovedEmployeeName: '',
          memo: selectedData.memo,
          registrationDate: selectedData.registrationDate,
          totalAmount: selectedData.totalAmount,
          status: selectedData.status,
          owners: selectedData.owners,
          deliveryDate: selectedData.deliveryDate,
        }
        setSelectedPurchase(purchaseDetail)
        setModalMode('view')
        setModalOpen(true)
        console.log(selectedData)
      }
    } else {
      notificationModal.error('詳細を表示するには、表の行を選択してください。')
    }
  }, [selectionModel])

  const handleExportPurchase = async () => {
    //now version is xlsx only
    if (totalRows < purchaseData.length) {
      const response = await getAllPurchaseData()
      exportPurchaseSelected(response)
    } else {
      exportPurchaseSelected(purchaseData)
    }
  }

  const handleModalConfirm = async (data: PurchaseModalDataProps) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      // addNewSaleData()
    } else {
    }
  }

  const handleStartDateChange = (date: Dayjs | null) => {
    const newStartDate = date ? date.startOf('day').toDate() : null

    handleChange('startDate', newStartDate)

    if (
      searchCriteria.endDate &&
      newStartDate &&
      dayjs(newStartDate).isAfter(dayjs(searchCriteria.endDate), 'day')
    ) {
      notificationModal.warning(
        'Start date cannot be after the end date. End date has been cleared.'
      )
      handleChange('endDate', null)
    }
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    const newEndDate = date ? date.endOf('day').toDate() : null

    handleChange('endDate', newEndDate)

    if (
      searchCriteria.startDate &&
      newEndDate &&
      dayjs(newEndDate).isBefore(dayjs(searchCriteria.startDate), 'day')
    ) {
      notificationModal.warning(
        'End date cannot be before the start date. Start date has been cleared.'
      )
      handleChange('startDate', null)
    }
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>仕入管理</Divider>
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
              width: '60%',
            }}
          >
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <TextField
                name='category'
                value={searchCriteria.category}
                select
                label='範疇項目'
                id='category-sale'
                onChange={e => handleChange('category', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'category-sale-label',
                  htmlFor: 'category',
                  component: 'span',
                }}
              >
                {categorySearch?.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.display}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name='keyword'
                label='キーワード検索'
                value={searchCriteria.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
              />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              gap={2}
              // justifyContent={'space-between'}
              flex={1}
            >
              <TextField
                name='dateType'
                value={searchCriteria.dateType ?? ''}
                select
                label='日付'
                id='category-order'
                onChange={e => handleChange('dateType', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'category-order-label',
                  htmlFor: 'category',
                  component: 'span',
                }}
              >
                <MenuItem value={''}>ない</MenuItem>
                {dateTypeList?.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.display}
                  </MenuItem>
                ))}
              </TextField>
              {searchCriteria.dateType && (
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  gap={2}
                  // justifyContent={'space-between'}
                  // flex={1}
                >
                  <DatePicker
                    label='開始日'
                    value={dayjs(searchCriteria.startDate)}
                    format='YYYY/MM/DD'
                    onAccept={handleStartDateChange}
                    views={['year', 'month', 'day']}
                  />
                  <DatePicker
                    label='終了日'
                    format='YYYY/MM/DD'
                    value={dayjs(searchCriteria.endDate)}
                    onAccept={handleEndDateChange}
                    views={['year', 'month', 'day']}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Divider orientation='vertical' flexItem sx={{ ml: 'auto' }}></Divider>
          <Box
            sx={{
              // width: '30%',
              display: 'flex',
              // justifyContent: 'flex-end',
              // alignItems: 'flex-start',
              flexDirection: 'column',
              marginRight: 4,
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              <StyledButton
                variant='outlined'
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
              >
                検索
              </StyledButton>
              {/* <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
                sx={{ visibility: 'hidden' }}
              >
                追加
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<DeleteIcon />}
                size='large'
                onClick={handleDeleteClick}
                sx={{ visibility: 'hidden' }}
              >
                削除
              </StyledButton> */}
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              {/* <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                onClick={handleEditClick}
                sx={{ visibility: 'hidden' }}
              >
                編集
              </StyledButton> */}
              <StyledButton
                variant='outlined'
                startIcon={<DetailIcon />}
                size='large'
                // sx={{ visibility: 'hidden' }}
                onClick={handleViewDetailClick}
              >
                詳細
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              {/* <StyledButton
                variant='outlined'
                startIcon={<UploadFileIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
                自動アプロード
              </StyledButton> */}
              <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                onClick={handleExportPurchase}
                // sx={{ visibility: 'hidden' }}
              >
                データ出力
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <DataTable
          data={purchaseData}
          columns={columns}
          totalRows={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={purchaseDataGridRef}
          paginationMode={'server'}
          // getRowId={row => row.purchaseId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>
      {/* waiting for prepare new data props */}
      {modalOpen && (
        <PurchaseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedPurchase}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

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
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StyledButton } from 'styles/styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { exportToPdf, exportToXlsx } from 'utils/exportUtils'
import useNotification from 'hooks/useNotification'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import PurchaseModal from 'components/Modals/PurchaseModal'
import useOrder from './hooks/useOrder'
import OrderModal from 'components/Modals/OrderModal'
import { OrderData } from 'api/order/getOrderList'
import OrderDetailPopup from './components/OrderDetailPopup'

export default function OrderPage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    paginationModel,
    orderData,
    columns,
    prepareCategorySearch,
    handlePaginationModelChange,
    categorySearch,
    statusOrder,
  } = useOrder()
  const orderDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupMode, setPopupMode] = useState<'view' | 'edit'>('view')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()

  useEffect(() => {
    if (orderDataGridRef.current) {
      orderDataGridRef.current.autosizeColumns({
        // columns: ['id', 'customerCompanyName'],
        // includeHeaders: true,
        // includeOutliers: true,
        expand: true,
      })
    }
  }, [orderData])

  useEffect(() => {
    prepareCategorySearch
  }, [])

  const handleAddClick = () => {
    setSelectedOrder(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      if (selectedData) {
        setPopupMode('edit')
        setSelectedOrder(selectedData)
        setPopupOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      // const selectedId = selectionModel[0]
      // const selectedData = purchaseData.find(item => item.purchaseId === selectedId)
      // if (selectedData) {
      //   const confirmed = await openConfirmModal({
      //     title: '確認してください',
      //     message:
      //       'Are you sure you want to delete this Invoice Number: ' + selectedData.invoiceNumber,
      //   })
      //   if (confirmed) {
      //     // Perform delete operation
      //     console.log('Delete confirmed')
      //   } else {
      //     console.log('Delete cancelled')
      //   }
      // }
    } else {
      notificationModal.error('Please select a row in the table to delete.')
    }
  }, [selectionModel])

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      if (selectedData) {
        setPopupMode('view')
        setSelectedOrder(selectedData)
        setPopupOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: OrderData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      // addNewSaleData()
    } else {
    }
    // After successful add/edit, refetch the data
    // await fetchSalesData(paginationModel);
  }

  const handlePopupConfirm = async (data?: OrderData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      // addNewSaleData()
    } else {
    }
    // After successful add/edit, refetch the data
    // await fetchSalesData(paginationModel);
  }

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>受注管理</Divider>
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
                label='範疇'
                id='category-order'
                onChange={e => handleChange('category', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'category-order-label',
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
                // fullWidth
                name='keyword'
                label='検索'
                value={searchCriteria.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
              />
              <TextField
                name='ststus'
                value={searchCriteria.status ?? ''}
                select
                label='Status'
                id='status-order'
                onChange={e => handleChange('status', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'status-order-label',
                  htmlFor: 'status',
                  component: 'span',
                }}
              >
                {statusOrder?.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant='contained' endIcon={<SearchIcon />} onClick={handleSearch}>
                Search
              </Button>
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              gap={2}
              // justifyContent={'space-between'}
              // flex={1}
            >
              <DatePicker
                label='Start Date'
                value={dayjs(searchCriteria.startDate)}
                format='YYYY/MM/DD'
                onChange={(date: Dayjs | null) =>
                  handleChange('startDate', date?.toDate() || new Date())
                }
              />
              <DatePicker
                label='End Date'
                format='YYYY/MM/DD'
                value={dayjs(searchCriteria.endDate)}
                onChange={(date: Dayjs | null) =>
                  handleChange('endDate', date?.toDate() || new Date())
                }
              />
            </Box>
          </Box>

          {/* <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            gap={3}
          ></Box> */}
          <Divider orientation='vertical' flexItem sx={{ ml: 'auto' }}></Divider>
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              // justifyContent: 'flex-end',
              // alignItems: 'flex-start',
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
                onClick={handleViewDetailClick}
                // sx={{ visibility: 'hidden' }}
              >
                details
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton variant='outlined' startIcon={<UploadFileIcon />} size='large'>
                自動アプロード
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                // onClick={handleExportPdf}
              >
                データ出力
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <DataTable
          data={orderData}
          columns={columns}
          // totalRows={orderData.length}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={orderDataGridRef}
          // getRowId={row => row.orderId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <OrderModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedOrder}
          mode={modalMode}
        />
      )}
      {popupOpen && (
        <OrderDetailPopup
          mode={popupMode}
          onClose={() => setPopupOpen(false)}
          onConfirm={handlePopupConfirm}
          open={popupOpen}
          initialData={selectedOrder}
        />
      )}
    </Box>
  )
}

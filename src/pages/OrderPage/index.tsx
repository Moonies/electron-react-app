import { useCallback, useEffect, useState } from 'react'
import { Box, TextField, MenuItem, Typography, Divider, Button } from '@mui/material'
import { useGridApiRef, GridRowSelectionModel } from '@mui/x-data-grid'
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
import useNotification from 'hooks/useNotification'
import useOrder from './hooks/useOrder'
import OrderModal from 'components/Modals/OrderModal'
import { OrderData } from 'api/order/getOrderList'
import useExportOrder from './hooks/useExportOrder'
import { pdf, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer'
import { DeliverySlipData, PDFDocument, PDFGenerator } from './components/SlipDeliveryOrder'
import useLoading from 'hooks/useLoading'
import { OrderStatus } from 'api/order'
import SelectTypeOrderDialog from 'components/Dialogs/SelectTypeOrderDialog'

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
    convertStatus,
    addNewOrder,
    editOrder,
    deleteOrder,
  } = useOrder()
  const orderDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()
  const { exportSaleSelected, prepareSlipData } = useExportOrder()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [orderType, setOrderType] = useState<string>()
  const [showPDF, setShowPDF] = useState(false)
  const { setLoading } = useLoading()

  const [slipsData, setSlipsData] = useState<DeliverySlipData>()

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
        setSelectedOrder(selectedData)
        setModalMode('edit')
        setModalOpen(true)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: `この選ばれたの受注番号　 ${selectedData.id}　を削除してもよろしいですか?`,
          // message: 'Are you sure you want to delete this order Number: ' + selectedData.id,
        })
        if (confirmed) {
          // Perform delete operation
          console.log('Delete confirmed')
        } else {
          console.log('Delete cancelled')
        }
      }
    } else {
      notificationModal.error('削除する行をテーブルから選択してください')
    }
  }, [selectionModel])

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      if (selectedData) {
        setSelectedOrder(selectedData)
        setModalMode('view')
        setModalOpen(true)
      }
    } else {
      notificationModal.error('詳細を表示するには、表の行を選択してください。')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: OrderData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      // addNewSaleData()
    } else {
    }
    switch (modalMode) {
      case 'add':
        addNewOrder(data)
        break
      case 'edit':
        editOrder(data)
        break
      case 'view':
        deleteOrder(data)
        break
      default:
        break
    }
    // After successful add/edit, refetch the data
    // await fetchNewOrderData(paginationModel);
  }

  const handleExportPdf = async () => {
    // setShowPDF(true) //for test to preview PDF
    setLoading(true)
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      // if(selectedData?.status === OrderStatus.CANCEL) has condition??
      if (selectedData) {
        if (selectedData.status === OrderStatus.ORDER) {
          const newSlipData = await prepareSlipData(selectedData)
          if (newSlipData !== undefined) {
            const blob = await pdf(
              <PDFDocument data={newSlipData} render={() => setLoading(false)} />
            ).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', '3連納品書.pdf') //name sapce is waiting to confirm
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
          //and call update status to ORDERED
        } else {
          exportSaleSelected(selectedData)
        }
      }
    } else {
      notificationModal.error('出力する行をテーブルから選択してください')
    }
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
                label='状態'
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
                    {convertStatus(item)}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant='contained'
                endIcon={<SearchIcon />}
                onClick={handleSearch}
                size='large'
              >
                検索
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
                // onClick={() => setDialogOpen(true)}
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
                startIcon={<DetailIcon />}
                size='large'
                onClick={handleViewDetailClick}
                // sx={{ visibility: 'hidden' }}
              >
                詳細
              </StyledButton>
            </Box>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<UploadFileIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
                {/* current version is not support */}
                自動アプロード
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                onClick={handleExportPdf}
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
      {dialogOpen && (
        <SelectTypeOrderDialog
          onClose={() => setDialogOpen(false)}
          onSubmit={orderType => {
            setOrderType(orderType)
            setDialogOpen(false)
            handleAddClick()
          }}
          open={dialogOpen}
        />
      )}
      {/* {showPDF && slipsData && (
        <div className='mt-4' style={{ height: '80vh' }}>
          <PDFGenerator data={slipsData} render={() => setLoading(false)} />
        </div>
      )} */}
    </Box>
  )
}

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
import SaleModal, { SaleModalDataProps } from 'components/Modals/SaleModal'
import { OrderData } from 'api/order/getOrderList'
import useExportOrder from './hooks/useExportOrder'
import { pdf, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer'
import { DeliverySlipData, PDFDocument, PDFGenerator } from './components/SlipDeliveryOrder'
import useLoading from 'hooks/useLoading'
import { OrderStatus, OrderType } from 'api/order'
import SelectTypeOrderDialog from 'components/Dialogs/SelectTypeOrderDialog'
import PurchaseModal, { PurchaseModalDataProps } from 'components/Modals/PurchaseModal'
import { PurchaseData } from 'api/purchase/getPurchaseList'
import { SaleData } from 'api/sale/getSaleList'

export default function OrderPage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    paginationModel,
    orderData,
    columns,
    prepareCategorySearch,
    prepareCategoryStatus,
    handlePaginationModelChange,
    categorySearch,
    statusOrder,
    convertStatus,
    addNewSaleOrder,
    editSaleOrder,
    addNewPurchaseOrder,
    editPurchaseOrder,
    getPurchaseDetail,
    handleDeleteOrder,
    dateTypeList,
    orderTypeList,
    handleSelectedPurchaseDetail,
    totalRows,
    handleSelectedSaleDetail,
    getSaleOrderList,
    getPurchaseOrderList,
  } = useOrder()
  const orderDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedSale, setSelectedSale] = useState<SaleModalDataProps>()
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseModalDataProps>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal, notificationSnackbar } = useNotification()
  const { exportSaleSelected, prepareSlipData, exportOrder } = useExportOrder()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [orderType, setOrderType] = useState<'Sale' | 'Purchase'>()
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
    prepareCategoryStatus
  }, [])

  const handleAddClick = () => {
    orderType === 'Sale' ? setSelectedSale(undefined) : setSelectedPurchase(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      if (selectedData) {
        if (selectedData.status === OrderStatus.CANCEL) {
          notificationModal.warning('Status is Cancel, cannot edit data.')
          return
        }
        if (selectedData.orderType === 'Sale') {
          const saleDetail = await handleSelectedSaleDetail(selectedData.id)
          setSelectedSale(saleDetail)
          setOrderType('Sale')
          setModalMode('edit')
          setModalOpen(true)
        } else {
          const purchaseDetail = await handleSelectedPurchaseDetail(selectedData.id)
          setSelectedPurchase(purchaseDetail)
          setOrderType('Purchase')
          setModalMode('edit')
          setModalOpen(true)
        }
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
          message: `この選ばれたの受注番号　 ${selectedData.orderCode}　を削除してもよろしいですか?`,
        })
        if (confirmed) {
          const response = await handleDeleteOrder(selectedData)
          if (response) {
            notificationSnackbar.success('削除終了しました。')
            handleSearch()
          }
        } else {
          //delete cancle event
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
        if (selectedData.orderType === 'Sale') {
          const saleDetail = await handleSelectedSaleDetail(selectedData.id)
          setSelectedSale(saleDetail)
          setOrderType('Sale')
          setModalMode('view')
          setModalOpen(true)
        } else {
          const purchaseDetail = await handleSelectedPurchaseDetail(selectedData.id)
          setSelectedPurchase(purchaseDetail)
          setOrderType('Purchase')
          setModalMode('view')
          setModalOpen(true)
        }
      }
    } else {
      notificationModal.error('詳細を表示するには、表の行を選択してください。')
    }
  }, [selectionModel])

  const handleModalConfirm = async (data: SaleModalDataProps | PurchaseModalDataProps) => {
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: `このデータを保存しますか。`,
    })
    if (confirmed) {
      if ('saleCode' in data) {
        switch (modalMode) {
          case 'add':
            {
              const response = await addNewSaleOrder(data)
              if (response) {
                setModalOpen(false)
                setLoading(false)
              }
            }
            break
          case 'edit':
            {
              const response = await editSaleOrder(data)
              if (response) {
                setModalOpen(false)
                setLoading(false)
                notificationSnackbar.success('Sale Order Update is Success!!')
                handleSearch()
              }
            }
            break
          case 'view':
            // deleteOrder(data as OrderData)
            break
          default:
            break
        }
      }

      if ('purchaseCode' in data) {
        switch (modalMode) {
          case 'add':
            {
              const response = await addNewPurchaseOrder(data as PurchaseModalDataProps)
              if (response) {
                notificationSnackbar.success('Purchase Order is Success!!')
                setLoading(false)
                setModalOpen(false)
              }
            }
            break
          case 'edit': {
            const response = await editPurchaseOrder(data as PurchaseModalDataProps)
            if (response) {
              setModalOpen(false)
              setLoading(false)
              notificationSnackbar.success('Purchase Order Update is Success!!')
              handleSearch()
              if (data.status === OrderStatus.CONFIRM) {
                const confirmed = await openConfirmModal({
                  title: '確認してください',
                  message: `Do you want to print 3連納品書?`,
                })
                if (confirmed) {
                  // Perform delete operation
                  //print condition
                }
              } else {
              }
            }
            break
          }
          case 'view':
            // deleteOrder(data)
            break
          default:
            break
        }
      }
    }
  }

  const handlePrintDocument = async () => {
    // setShowPDF(true) //for test to preview PDF
    setLoading(true)
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = orderData.find(order => order.id === selectedId)
      // if(selectedData?.status === OrderStatus.CANCEL) has condition??
      if (selectedData) {
        //purchase caes and need to print?
        if (
          selectedData.status === OrderStatus.CONFIRM &&
          selectedData.orderType === OrderType.PURCHASE
        ) {
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
          if (selectedData.orderType === 'Sale') {
            exportSaleSelected(selectedData)
          } else {
            // need to discuss for purchase order
            // const purchaseDetail = await handleSelectedPurchaseDetail(selectedData.id)
          }
        }
      }
    } else {
      notificationModal.error('出力する行をテーブルから選択してください')
    }
  }

  const handleExport = async () => {
    if (searchCriteria.orderType === OrderType.SALE) {
      const saleOrder = await getSaleOrderList()
      exportOrder(saleOrder)
    } else if (searchCriteria.orderType === OrderType.PURCHASE) {
      const purchaseOrder = await getPurchaseOrderList()
      exportOrder(undefined, purchaseOrder)
    } else {
      const [saleOrder, purchaseOrder] = await Promise.all([
        getSaleOrderList(),
        getPurchaseOrderList(),
      ])
      exportOrder(saleOrder, purchaseOrder)
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

  const filteredStatuses = statusOrder.filter(
    status => status.orderType === searchCriteria.orderType || status.orderType === 'All'
  )
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
                label='範疇項目'
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
                fullWidth
                name='keyword'
                label='キーワード検索'
                value={searchCriteria.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
              <TextField
                name='orderType'
                value={searchCriteria.orderType}
                select
                label='受注'
                id='category-order'
                onChange={e => handleChange('orderType', e.target.value as string)}
                sx={{ width: '30%' }}
                InputLabelProps={{
                  id: 'category-order-label',
                  htmlFor: 'category',
                  component: 'span',
                }}
              >
                {orderTypeList?.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.display}
                  </MenuItem>
                ))}
              </TextField>
              {searchCriteria.orderType !== 'All' && (
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
                  {/* <MenuItem value={''}>None</MenuItem> */}

                  {filteredStatuses?.map((item, index) => (
                    <MenuItem key={index} value={`${item.orderType}.${item.name}`}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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
            </Box>
            {searchCriteria.dateType && (
              <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
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
              </Box>
            )}
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
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
                // sx={{ visibility: 'hidden' }}
              >
                検索
              </StyledButton>{' '}
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
                startIcon={<AddIcon />}
                size='large'
                // onClick={handleAddClick}
                onClick={() => setDialogOpen(true)}
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
                startIcon={<PrintIcon />}
                size='large'
                // sx={{ visibility: 'hidden' }}
                onClick={handlePrintDocument}
              >
                データ出力
              </StyledButton>
            </Box>
            {/* <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              // current version is not support 
              <StyledButton
                variant='outlined'
                startIcon={<UploadFileIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
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
            </Box> */}
          </Box>
        </Box>
        <DataTable
          data={orderData}
          columns={columns}
          totalRows={totalRows}
          paginationModel={paginationModel}
          paginationMode={'server'}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={orderDataGridRef}
          // getRowId={row => row.orderId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && orderType === 'Sale' && (
        <SaleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedSale}
          mode={modalMode}
        />
      )}

      {modalOpen && orderType === 'Purchase' && (
        <PurchaseModal
          open={modalOpen}
          onClose={() => {
            setSelectedPurchase(undefined)
            setModalOpen(false)
          }}
          onConfirm={handleModalConfirm}
          initialData={selectedPurchase}
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
      {/* to preview and check export pdf */}
      {/* {showPDF && slipsData && (
        <div className='mt-4' style={{ height: '80vh' }}>
          <PDFGenerator data={slipsData} render={() => setLoading(false)} />
        </div>
      )} */}
    </Box>
  )
}

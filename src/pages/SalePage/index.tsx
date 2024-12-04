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
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import useSales from './hooks/useSale'
import { StyledButton } from 'styles/styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import { SaleData } from 'api/sale/getSaleList'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { exportToPdf, exportToXlsx } from 'utils/exportUtils'
import useExportSale from './hooks/useExportSale'
import useNotification from 'hooks/useNotification'
import useLoading from 'hooks/useLoading'
import SaleModal, { SaleModalDataProps } from 'components/Modals/SaleModal'
import { formatJPY } from 'utils/formatUtils'

export default function SalePage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    saleData,
    columns,
    handlePaginationModelChange,
    paginationModel,
    prepareCategorySearch,
    categorySearch,
    totalRows,
    dateTypeList,
    handleSelectedSaleDetail,
    totalSaleAmount,
    getAllSaleData,
  } = useSales()
  const saleDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedSale, setSelectedSale] = useState<SaleModalDataProps>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { printSaleInvoice, exportSale } = useExportSale()
  const { notificationModal } = useNotification()
  const { setLoading } = useLoading()

  useEffect(() => {
    if (saleDataGridRef.current) {
      saleDataGridRef.current.autosizeColumns({
        // columns: ['customerName', 'productName'],
        includeHeaders: true,
        includeOutliers: true,
        expand: true,
      })
    }
  }, [saleData])

  useEffect(() => {
    prepareCategorySearch
  }, [])

  const handleAddClick = () => {
    setSelectedSale(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = saleData.find(item => item.id === selectedId)
      if (selectedData) {
        setModalMode('edit')
        // setSelectedSale(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('編集する表の行を選択してください。')
    }
  }, [selectionModel])

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]

      const selectedData = saleData.find(item => item.id === selectedId)
      if (selectedData) {
        let newSaleData = handleSelectedSaleDetail(selectedData)
        setModalMode('view')
        setSelectedSale(newSaleData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('詳細を表示するには、表の行を選択してください。')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = saleData.find(item => item.id === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: 'Are you sure you want to delete this Invoice Number: ' + selectedData.orderCode,
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

  const handleModalConfirm = async (data: SaleModalDataProps) => {
    //something function
  }

  const handleExportPdf = async () => {
    setLoading(true)
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = saleData.find(item => item.id === selectedId)
      if (selectedData) {
        await printSaleInvoice(selectedData)
        setLoading(false)
      }
    } else {
      setLoading(false)
      notificationModal.error('印刷する行をテーブルから選択してください')
    }
  }
  const handleExport = async () => {
    if (totalRows > saleData.length) {
      const saleReport = await getAllSaleData()
      saleReport && exportSale(saleReport)
    } else {
      exportSale(saleData)
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
      notificationModal.warning('開始日は終了日より後にはできません。終了日はクリアされています。')
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
        '終了日は開始日より前に設定できません。開始日はクリアされています。'
      )
      handleChange('startDate', null)
    }
  }
  //maybe not use groupby
  // const groupBy = (
  //   array: SaleData[],
  //   key: keyof SaleData,
  //   selectColumns?: (keyof SaleData)[]
  // ) => {
  //   const groupIndexes: { [key: string]: number } = {}
  //   let index = 0
  //   return array.reduce(
  //     (result, currentValue) => {
  //       const groupKey = currentValue[key] ?? 'Unknown'
  //       const stringKey = dayjs.isDayjs(groupKey) ? groupKey.format('YYYY-MM-DD') : groupKey

  //       if (!(stringKey in groupIndexes)) {
  //         groupIndexes[stringKey] = index++
  //       }

  //       const groupIndex = groupIndexes[stringKey]

  //       if (!result[groupIndex]) {
  //         result[groupIndex] = []
  //       }

  //       const newItem: Partial<SaleData> = {}
  //       if (selectColumns) {
  //         selectColumns.forEach(column => {
  //           if (currentValue[column] !== undefined) {
  //             newItem[column] = currentValue[column] as any
  //           }
  //         })
  //       }
  //       result[groupIndex].push(newItem)
  //       return result
  //     },
  //     {} as { [index: number]: Partial<SaleData>[] }
  //   )
  // }
  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>売上管理</Divider>
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
              <TextField
                name='category'
                value={searchCriteria.category}
                select
                label='範疇項目'
                id='category-sale'
                onChange={e => handleChange('category', e.target.value as string)}
                sx={{ width: '40%' }}
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
                fullWidth
                name='keyword'
                label='キーワード検索'
                value={searchCriteria.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
              />
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2} flex={1}>
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
                <Box display={'flex'} flexDirection={'row'} gap={2}>
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

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            gap={3}
          >
            <Typography variant='h6'>
              総売上高: {formatJPY(Number(totalSaleAmount ?? 0))}
            </Typography>
            {/* summary of(product price-(cost*quantity)) */}
            {/* <Typography variant='h6'>
                  粗利: {currencyFormatter.format(Number(salesSummary.averageOrderValue))}
                </Typography> */}
          </Box>
          <Divider orientation='vertical' flexItem></Divider>
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              // marginRight: 4,
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              <StyledButton
                variant='outlined'
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
              >
                検索
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<DetailIcon />}
                size='large'
                onClick={handleViewDetailClick}
              >
                詳細
              </StyledButton>
            </Box>
            {/* <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}> */}
            {/* <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
                sx={{ visibility: 'hidden' }}
              >
                追加
              </StyledButton> */}
            {/* <StyledButton
                variant='outlined'
                startIcon={<EditIcon />}
                size='large'
                onClick={handleEditClick}
                sx={{ visibility: 'hidden' }}
              >
                編集
              </StyledButton> */}
            {/* </Box> */}
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
              {/* <StyledButton
                variant='outlined'
                startIcon={<UploadFileIcon />}
                size='large'
                sx={{ visibility: 'hidden' }}
              >
                not support in alpha test 
                自動アプロード
              </StyledButton> */}
              <StyledButton
                variant='outlined'
                startIcon={<FileDownloadIcon />}
                size='large'
                // sx={{ visibility: 'hidden' }}
                onClick={handleExport}
              >
                データ出力
              </StyledButton>
              <StyledButton
                variant='outlined'
                startIcon={<PrintIcon />}
                size='large'
                onClick={handleExportPdf}
                // sx={{ visibility: 'hidden' }}
              >
                データ印刷
              </StyledButton>
            </Box>
          </Box>
        </Box>
        <DataTable
          data={saleData}
          columns={columns}
          totalRows={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={saleDataGridRef}
          // getRowId={row => row.saleId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
          paginationMode={'server'}
        />
      </Box>

      {modalOpen && (
        <SaleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          // onConfirm={handleModalConfirm}
          initialData={selectedSale}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

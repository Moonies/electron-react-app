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
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import useSales from './hooks/useSale'
import { StyledButton } from 'styles/styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import SalesModal from 'components/Modals/SaleModal'
import { SaleData } from 'api/sale/getSaleList'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { exportToPdf, exportToXlsx } from 'utils/exportUtils'
import useExportSale from './hooks/useExportSale'
import useNotification from 'hooks/useNotification'

export default function SalePage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    salesSummary,
    saleData,
    columns,
    handlePaginationModelChange,
    paginationModel,
    currencyFormatter,
    addNewSaleData,
    prepareCategorySearch,
    categorySearch,
    totalRows,
  } = useSales()
  const saleDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedSale, setSelectedSale] = useState<SaleData | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { printColumnList } = useExportSale()
  const { notificationModal } = useNotification()

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
      const selectedData = saleData.find(item => item.orderId === selectedId)
      if (selectedData) {
        setModalMode('edit')
        setSelectedSale(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleViewDetailClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]

      const selectedData = saleData.find(item => item.id === selectedId)
      if (selectedData) {
        setModalMode('view')
        setSelectedSale(selectedData)
        setModalOpen(true)
      }
    } else {
      notificationModal.error('Please select a row in the table to view detail.')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = saleData.find(item => item.orderId === selectedId)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: '確認してください',
          message: 'Are you sure you want to delete this Invoice Number: ' + selectedData.orderId,
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

  const handleModalConfirm = async (data: SaleData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    if (modalMode === 'add') {
      addNewSaleData()
    } else {
    }
    // After successful add/edit, refetch the data
    // await fetchSaleData(paginationModel);
  }

  const handleExportPdf = () => {
    // exportToXlsx(columns, saleData)
    // printData(columns, saleData, 'Sales Quotation')
    // let xx = groupBy(saleData, 'invoiceNumber', [
    //   'customerName',
    //   'invoiceNumber',
    //   'productId',
    //   'productName',
    //   'quantity',
    //   'totalPrice',
    //   'unitPrice',
    // ])
    // exportToPdf(printColumnList, xx[4], '見積書')
    // printData(printColumnList, xx[4], 'Sales Quotation')
    // console.log(saleData)
    // console.log(xx)
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
                label='範疇'
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
                fullWidth
                name='keyword'
                label='検索'
                value={searchCriteria.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position='end'>
                //       <IconButton onClick={handleSearch} edge='end'>
                //         <SearchIcon />
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
              />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              gap={2}
              justifyContent={'space-between'}
              flex={1}
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
            {salesSummary && (
              <>
                <Typography variant='h6'>
                  売上総合: {currencyFormatter.format(Number(salesSummary.totalSales))}
                </Typography>
                <Typography variant='h6'>
                  粗利: {currencyFormatter.format(Number(salesSummary.averageOrderValue))}
                </Typography>
              </>
            )}
          </Box>
          <Divider orientation='vertical' flexItem></Divider>
          <Box
            sx={{
              // width: '30%',
              display: 'flex',
              flexDirection: 'column',
              marginRight: 4,
            }}
            gap={1}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              {/* <StyledButton
                variant='outlined'
                startIcon={<AddIcon />}
                size='large'
                onClick={handleAddClick}
                sx={{ visibility: 'hidden' }}
              >
                追加
              </StyledButton> */}
              <StyledButton
                variant='outlined'
                startIcon={<SearchIcon />}
                size='large'
                onClick={handleSearch}
              >
                search
              </StyledButton>
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
                onClick={handleViewDetailClick}
                // sx={{ visibility: 'hidden' }}
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
                not support in alpha test 
                自動アプロード
              </StyledButton> */}
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
          data={saleData}
          columns={columns}
          totalRows={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={saleDataGridRef}
          // getRowId={row => row.saleId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        />
      </Box>

      {modalOpen && (
        <SalesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedSale}
          mode={modalMode}
        />
      )}
    </Box>
  )
}

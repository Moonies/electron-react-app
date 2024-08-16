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
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StyledButton } from 'styles/styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import SalesModal from 'components/Modals/SaleModal'
import { SalesData } from 'api/sale/getSaleList'
import { useConfirmModal } from 'hooks/useConfirmModal'
import { exportToPdf, exportToXlsx } from 'utils/exportUtils'
import useNotification from 'hooks/useNotification'
import usePurchase from './hooks/usePurchase'

export default function PurchasePage() {
  const { searchCriteria, handleChange } = usePurchase()
  const salesDataGridRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedSale, setSelectedSale] = useState<SalesData | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()

  // useEffect(() => {
  //   if (salesDataGridRef.current) {
  //     salesDataGridRef.current.autosizeColumns({
  //       // columns: ['customerName', 'productName'],
  //       includeHeaders: true,
  //       includeOutliers: true,
  //       expand: true,
  //     })
  //   }
  // }, [salesData])

  // useEffect(() => {
  //   prepareCategorySearch
  // }, [])

  const handleAddClick = () => {
    setSelectedSale(undefined)
    setModalMode('add')
    setModalOpen(true)
  }

  const handleEditClick = useCallback(() => {
    if (selectionModel.length === 1) {
      // const selectedId = selectionModel[0]
      // const selectedData = salesData.find(sale => sale.saleId === selectedId)
      // if (selectedData) {
      //   setModalMode('edit')
      //   setSelectedSale(selectedData)
      //   setModalOpen(true)
      // }
    } else {
      notificationModal.error('Please select a row in the table to edit.')
    }
  }, [selectionModel])

  const handleDeleteClick = useCallback(async () => {
    if (selectionModel.length === 1) {
      // const selectedId = selectionModel[0]
      // const selectedData = salesData.find(sale => sale.saleId === selectedId)
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

  const handleModalConfirm = async (data: SalesData) => {
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
              {/* <TextField
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
              </TextField> */}
              <Box display={'flex'} flex={1}>
                {/* <TextField
                  fullWidth
                  name='keyword'
                  label='検索'
                  value={searchCriteria.keyword}
                  onChange={e => handleChange('keyword', e.target.value)}
                  InputProps={{
                    style: { fontSize: '1.2rem' },
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleSearch} edge='end'>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                /> */}
              </Box>
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
          ></Box>
          <Divider orientation='vertical' flexItem></Divider>
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
                sx={{ visibility: 'hidden' }}
              >
                visible
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
        {/* <DataTable
          data={salesData}
          columns={columns}
          totalRows={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          apiref={salesDataGridRef}
          getRowId={row => row.saleId}
          onSelected={newSelectionModel => setSelectionModel(newSelectionModel)}
        /> */}
      </Box>

      {/* {modalOpen && (
        <SalesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialData={selectedSale}
          mode={modalMode}
        />
      )} */}
    </Box>
  )
}

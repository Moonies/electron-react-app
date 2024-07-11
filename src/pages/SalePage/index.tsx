import { useEffect, useState } from 'react'
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import useSales from './hooks/useSale'
import { StyledDivider, StyledButton } from './styles'
import dayjs, { Dayjs } from 'dayjs'
import DataTable from 'components/DataTable'
import SalesModal from 'components/Modals/SaleModal'
import { SalesData } from 'api/sales/saleList'
import { showNotification } from 'store/notificationSlice'
import { useDispatch } from 'react-redux'

export default function SalePage() {
  const {
    searchCriteria,
    handleChange,
    handleSearch,
    salesSummary,
    salesData,
    columns,
    handlePaginationModelChange,
    paginationModel,
    currencyFormatter,
  } = useSales()
  const salesDataGridRef = useGridApiRef()

  useEffect(() => {
    salesDataGridRef.current.autosizeColumns({
      columns: ['customerName'],
      includeHeaders: true,
      includeOutliers: true,
      expand: true,
    })
  }, [salesData])

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedSale, setSelectedSale] = useState<SalesData | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [alertOpen, setAlertOpen] = useState(false)
  const dispatch = useDispatch()

  const handleAddClick = () => {
    setModalMode('add')
    setSelectedSale(undefined)
    setModalOpen(true)
  }

  const handleEditClick = () => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0]
      const selectedData = salesData.find(sale => sale.saleId === selectedId)
      if (selectedData) {
        setModalMode('edit')
        setSelectedSale(selectedData)
        setModalOpen(true)
      }
    } else {
      dispatch(
        showNotification({
          message: 'Please select a row in the table to edit.',
          type: 'modal',
          severity: 'error',
        })
      )
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleRowSelectChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel)
  }

  const handleModalConfirm = async (data: SalesData) => {
    // Implement add/edit functionality
    console.log('Confirmed data:', data)
    // After successful add/edit, refetch the data
    // await fetchSalesData(paginationModel);
  }
  return (
    <Box display={'flex'} flexDirection={'column'} flexGrow={1}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <StyledDivider textAlign='left'>売上管理</StyledDivider>
        </Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                <FormControl sx={{ width: '30%' }} size='small'>
                  <InputLabel id='category-label'>Category</InputLabel>
                  <Select
                    labelId='category-label'
                    name='category'
                    value={searchCriteria.category}
                    label='Category'
                    onChange={e => handleChange('category', e.target.value as string)}
                  >
                    <MenuItem value='electronics'>Electronics</MenuItem>
                    <MenuItem value='clothing'>Clothing</MenuItem>
                    <MenuItem value='books'>Books</MenuItem>
                  </Select>
                </FormControl>
                <Box display={'flex'} flex={1}>
                  <TextField
                    size='small'
                    fullWidth
                    name='keyword'
                    label='Keyword'
                    value={searchCriteria.keyword}
                    onChange={e => handleChange('keyword', e.target.value)}
                    InputProps={{
                      style: { fontSize: 24 },
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleSearch} edge='end'>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <Box display={'flex'} flexDirection={'row'} gap={2}>
                <DatePicker
                  label='Start Date'
                  value={dayjs(searchCriteria.startDate)}
                  onChange={(date: Dayjs | null) =>
                    handleChange('startDate', date?.toDate() || new Date())
                  }
                />
                <DatePicker
                  label='End Date'
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
                  {/* <Typography variant='h6'>Sales Summary</Typography> */}
                  <Typography variant='h6'>
                    売上総合: {currencyFormatter.format(Number(salesSummary.totalSales))}
                  </Typography>
                  <Typography variant='h6'>
                    粗利: {currencyFormatter.format(Number(salesSummary.averageOrderValue))}
                  </Typography>
                </>
              )}
            </Box>
            <StyledDivider orientation='vertical' flexItem></StyledDivider>
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
                  Add
                </StyledButton>
                <StyledButton variant='outlined' startIcon={<DeleteIcon />} size='large'>
                  Delete
                </StyledButton>
              </Box>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
                <StyledButton
                  variant='outlined'
                  startIcon={<EditIcon />}
                  size='large'
                  onClick={handleEditClick}
                >
                  Edit
                </StyledButton>
                <StyledButton
                  variant='outlined'
                  startIcon={<EditIcon />}
                  size='large'
                  sx={{ visibility: 'hidden' }}
                >
                  Edit
                </StyledButton>
              </Box>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
                <StyledButton variant='outlined' startIcon={<UploadFileIcon />} size='large'>
                  Upload
                </StyledButton>
                <StyledButton variant='outlined' startIcon={<PrintIcon />} size='large'>
                  Export
                </StyledButton>
              </Box>
            </Box>
          </Box>
          <DataTable
            data={salesData}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            // checkboxSelection
            apiref={salesDataGridRef}
            getRowId={row => row.saleId}
            onSelected={handleRowSelectChange}
          />
        </Box>
        <SalesModal
          open={modalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          initialData={selectedSale}
          mode={modalMode}
        />
      </LocalizationProvider>
    </Box>
  )
}

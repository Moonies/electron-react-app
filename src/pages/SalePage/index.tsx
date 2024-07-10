import { useEffect } from 'react'
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
import { useGridApiRef } from '@mui/x-data-grid'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import useSales from './hooks/useSale'
import { StyledDivider, StyledButton, DataGridContainer, StripedDataGrid } from './styles'
import dayjs, { Dayjs } from 'dayjs'

export default function SalePage() {
  const { searchCriteria, handleChange, handleSearch, salesSummary, salesData, columns } =
    useSales()
  const salesDataGridRef = useGridApiRef()

  useEffect(() => {
    salesDataGridRef.current.autosizeColumns({
      columns: ['customerName'],
      includeHeaders: true,
      includeOutliers: true,
      expand: true,
    })
  }, [salesData])

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
              }}
            >
              {salesSummary && (
                <>
                  <Typography variant='h6'>Sales Summary</Typography>
                  <Typography>Total Sales: ${salesSummary.totalSales}</Typography>
                  <Typography>Average Order Value: ${salesSummary.averageOrderValue}</Typography>
                  <Typography>Top Selling Product: {salesSummary.topSellingProduct}</Typography>
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
                <StyledButton variant='outlined' startIcon={<DeleteIcon />} size='large'>
                  Delete
                </StyledButton>
                <StyledButton variant='outlined' startIcon={<AddIcon />} size='large'>
                  Add
                </StyledButton>
              </Box>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
                <StyledButton variant='outlined' startIcon={<EditIcon />} size='large'>
                  Edit
                </StyledButton>
                <StyledButton variant='outlined' startIcon={<PrintIcon />} size='large'>
                  Export
                </StyledButton>
              </Box>
            </Box>
          </Box>
          <DataGridContainer>
            <StripedDataGrid
              apiRef={salesDataGridRef}
              getRowId={row => row.saleId}
              rows={salesData}
              columns={columns}
              // autoHeight
              disableColumnMenu
              getRowClassName={params =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
            />
          </DataGridContainer>
        </Box>
      </LocalizationProvider>
    </Box>
  )
}

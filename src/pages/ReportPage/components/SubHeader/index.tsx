import { AppBar, Box, Button, MenuItem, TextField, Toolbar } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { ReportSearchCriteria } from 'api/report'
import dayjs, { Dayjs } from 'dayjs'

interface SubHeader {
  handleSearch: () => void
  handleChange: (keyword: string, value: Date | string) => void
  searchCriteria: ReportSearchCriteria
}

export default function SubHeader({ handleChange, searchCriteria, handleSearch }: SubHeader) {
  return (
    <AppBar position='static' sx={{ margin: 1 }}>
      <Toolbar>
        <Box display={'flex'} flexDirection={'row'} gap={1} flex={1}>
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
            onChange={(date: Dayjs | null) => handleChange('endDate', date?.toDate() || new Date())}
          />
          <TextField
            id='report-type'
            select
            label='Select'
            // fullWidth
            sx={{ width: 125 }}
            value={searchCriteria.category}
            onChange={e => handleChange('category', e.target.value as string)}
          >
            <MenuItem value={0}>Year</MenuItem>
            <MenuItem value={1}>Month</MenuItem>
            <MenuItem value={2}>Week</MenuItem>
          </TextField>
          <Button
            variant='outlined'
            sx={{ width: 125, fontSize: 22, height: 48, marginY: 'auto' }}
            onClick={handleSearch}
          >
            適用
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

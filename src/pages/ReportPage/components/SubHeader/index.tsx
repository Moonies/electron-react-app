import { AppBar, Box, Button, MenuItem, TextField, Toolbar } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { ReportSearchCriteria } from 'api/report'
import dayjs, { Dayjs } from 'dayjs'

interface SubHeader {
  handleSearch: () => void
  handleChange: (keyword: string, value: Date | string | null) => void
  searchCriteria: ReportSearchCriteria
}

export default function SubHeader({ handleChange, searchCriteria, handleSearch }: SubHeader) {
  const handleStartDateChange = (date: Dayjs | null) => {
    const newStartDate = date ? date.toDate() : null
    handleChange('startDate', newStartDate)

    if (searchCriteria.endDate && newStartDate && newStartDate > searchCriteria.endDate) {
      // setOpenAlert(true);
      console.log('start > end')
      handleChange('endDate', null)
    }
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    const newEndDate = date ? date.toDate() : null
    handleChange('endDate', newEndDate)

    if (searchCriteria.startDate && newEndDate && newEndDate < searchCriteria.startDate) {
      // setOpenAlert(true);
      handleChange('startDate', null)
    }
  }

  return (
    <AppBar position='static' sx={{ padding: 1 }}>
      <Box display={'flex'} flexDirection={'row'} gap={2} flex={1} alignItems='center'>
        <DatePicker
          label='Start Date'
          value={dayjs(searchCriteria.startDate)}
          format='YYYY/MM/DD'
          // onChange={(date: Dayjs | null) => handleChange('startDate', date?.toDate() || new Date())}
          onChange={handleStartDateChange}
          // maxDate={searchCriteria.endDate ? dayjs(searchCriteria.endDate) : undefined}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
        <DatePicker
          label='End Date'
          format='YYYY/MM/DD'
          value={dayjs(searchCriteria.endDate)}
          // onChange={(date: Dayjs | null) => handleChange('endDate', date?.toDate() || new Date())}
          onChange={handleEndDateChange}
          // minDate={searchCriteria.startDate ? dayjs(searchCriteria.startDate) : undefined}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
        <TextField
          id='report-type'
          select
          label='Select'
          sx={{ width: 125 }}
          value={searchCriteria.category}
          onChange={e => handleChange('category', e.target.value as string)}
          size='small'
          defaultValue={0}
        >
          <MenuItem value={0}>Year</MenuItem>
          <MenuItem value={1}>Month</MenuItem>
          <MenuItem value={2}>Week</MenuItem>
        </TextField>
        <Button
          variant='outlined'
          sx={{ width: 125, fontSize: 22 }}
          onClick={handleSearch}
          size='small'
        >
          適用
        </Button>
      </Box>
    </AppBar>
  )
}

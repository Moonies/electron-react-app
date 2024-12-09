import { AppBar, Box, Button, MenuItem, TextField, Toolbar } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { ReportSearchCriteria } from 'api/report'
import dayjs, { Dayjs } from 'dayjs'
import useNotification from 'hooks/useNotification'

interface SubHeader {
  handleSearch: () => void
  handleChange: (keyword: string, value: Date | string | null) => void
  searchCriteria: ReportSearchCriteria
}

export default function SubHeader({ handleChange, searchCriteria, handleSearch }: SubHeader) {
  const { notificationModal } = useNotification()

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

  return (
    <AppBar position='static' sx={{ padding: 1 }}>
      <Box display={'flex'} flexDirection={'row'} gap={2} flex={1} alignItems='center'>
        <DatePicker
          label='売上開始日'
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
          label='売上終了日'
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
          label='フィルター'
          sx={{ width: 125 }}
          value={searchCriteria.category}
          onChange={e => handleChange('category', e.target.value as string)}
          size='small'
          defaultValue={'YEAR'}
        >
          <MenuItem value={'YEAR'}>年</MenuItem>
          <MenuItem value={'MONTH'}>月</MenuItem>
          {/* <MenuItem value={'WEEK'}>週</MenuItem> */}
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

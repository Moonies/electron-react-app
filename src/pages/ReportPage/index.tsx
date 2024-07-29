import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
  Rectangle,
  Dot,
  PieChart,
  Pie,
  Cell,
  BarChart,
  ReferenceLine,
  Brush,
} from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import useReport from './hooks/useReport'

interface CustomLabelRenderer {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

export default function ReportPage() {
  const [outerRadius, setOuterRadius] = useState(112)
  const containerRef = useRef<HTMLDivElement>(null)
  const { bestTopFiveProductList, profitChartData, saleChartData, worstTopFiveProductList } =
    useReport()

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400, cnt: 490 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, cnt: 350 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, cnt: 120 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, cnt: 680 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, cnt: 4000 },
  ]

  let value = 56
  const dataPieChart = [
    { name: 'Completed', value: value },
    { name: 'Remaining', value: 100 - value },
  ]

  const dataBrushBarChart = [
    { name: '1', uv: 300, pv: 456 },
    { name: '2', uv: -145, pv: 230 },
    { name: '3', uv: -100, pv: 345 },
    { name: '4', uv: -8, pv: 450 },
    { name: '5', uv: 100, pv: 321 },
    { name: '6', uv: 9, pv: 235 },
    { name: '7', uv: 53, pv: 267 },
    { name: '8', uv: 252, pv: -378 },
    { name: '9', uv: 79, pv: -210 },
    { name: '10', uv: 294, pv: -23 },
    { name: '12', uv: 43, pv: 45 },
    { name: '13', uv: -74, pv: 90 },
    { name: '14', uv: -71, pv: 130 },
    { name: '15', uv: -117, pv: 11 },
    { name: '16', uv: -186, pv: 107 },
    { name: '17', uv: -16, pv: 926 },
    { name: '18', uv: -125, pv: 653 },
    { name: '19', uv: 222, pv: 366 },
    { name: '20', uv: 372, pv: 486 },
    { name: '21', uv: 182, pv: 512 },
    { name: '22', uv: 164, pv: 302 },
    { name: '23', uv: 316, pv: 425 },
    { name: '24', uv: 131, pv: 467 },
    { name: '25', uv: 291, pv: -190 },
    { name: '26', uv: -47, pv: 194 },
    { name: '27', uv: -415, pv: 371 },
    { name: '28', uv: -182, pv: 376 },
    { name: '29', uv: -93, pv: 295 },
    { name: '30', uv: -99, pv: 322 },
    { name: '31', uv: -52, pv: 246 },
    { name: '32', uv: 154, pv: 33 },
    { name: '33', uv: 205, pv: 354 },
    { name: '34', uv: 70, pv: 258 },
    { name: '35', uv: -25, pv: 359 },
    { name: '36', uv: -59, pv: 192 },
    { name: '37', uv: -63, pv: 464 },
    { name: '38', uv: -91, pv: -2 },
    { name: '39', uv: -66, pv: 154 },
    { name: '40', uv: -50, pv: 186 },
  ]

  const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 200 },
  ]

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className='custom-tooltip'
          style={{
            backgroundColor: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            color: 'black',
          }}
        >
          <p className='label'>{`${label}`}</p>
          {payload.map(pld => (
            <p key={pld.name} style={{ color: pld.color }}>
              {`${pld.name} : ${pld.value}`}
            </p>
          ))}
        </div>
      )
    }

    return null
  }
  const RADIAN = Math.PI / 180
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff4242']

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: CustomLabelRenderer) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    // Adjust position for better centering
    const sin = Math.sin(-midAngle * RADIAN)
    const cos = Math.cos(-midAngle * RADIAN)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    const percentValue = (percent * 100).toFixed(0)
    return (
      <g>
        <text
          x={x}
          y={y}
          fill={percent > 0.1 ? 'white' : 'black'}
          textAnchor='middle'
          dominantBaseline='central'
          fontSize={percent > 0.05 ? '14' : '10'}
        >
          {percent > 0.03 ? `${percentValue}%` : ''}
        </text>
      </g>
    )
  }

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        const minDimension = Math.min(width, height)
        const newRadius = Math.max(112, minDimension / 8 - 10) // 10px padding
        setOuterRadius(newRadius)
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize() // Initial size calculation

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <Box flex={1} display={'flex'} flexDirection={'column'} p={2}>
      <AppBar position='static' sx={{ margin: 1 }}>
        <Toolbar>
          <Box display={'flex'} flexDirection={'row'} gap={1} flex={1}>
            <DatePicker
              label='Start Date'
              // value={dayjs(searchCriteria.startDate)}
              format='YYYY/MM/DD'
              // onChange={(date: Dayjs | null) =>
              //   handleChange('startDate', date?.toDate() || new Date())
              // }
            />
            <DatePicker
              label='End Date'
              format='YYYY/MM/DD'
              // value={dayjs(searchCriteria.endDate)}
              // onChange={(date: Dayjs | null) =>
              //   handleChange('endDate', date?.toDate() || new Date())
              // }
            />
            <TextField
              id='filled-select-currency'
              select
              label='Select'
              // fullWidth
              sx={{ width: 125 }}
            >
              <MenuItem value={0}>Year</MenuItem>
              <MenuItem value={1}>Month</MenuItem>
              <MenuItem value={2}>Week</MenuItem>
            </TextField>
            <Button
              variant='outlined'
              sx={{ width: 125, fontSize: 22, height: 48, marginY: 'auto' }}
            >
              適用
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        display={'flex'}
        flexDirection={'row'}
        gap={2}
        p={1}
        flex={1}
        justifyContent={'space-around'}
        maxHeight={200}
      >
        <Card sx={{ width: '20%', border: 1, borderStyle: 'solid' }}>
          <CardHeader title='Total Sale' subheader='9999.99' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              ¥123.45
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '20%', border: 1, borderStyle: 'solid' }}>
          <CardHeader title='Summary Amout of Sale' subheader='999999.99' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              ¥123.45
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '20%', border: 1, borderStyle: 'solid' }}>
          <CardHeader title='Summary' subheader='999999.0099' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              ¥123.45
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '20%', border: 1, borderStyle: 'solid' }}>
          <CardHeader title='Summary Profit' subheader='12345.67' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              ¥123.45
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: '20%', border: 1, borderStyle: 'solid' }}>
          <CardHeader title='Mission of Year xxxx~xxxx' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              ¥123.45
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box display={'flex'} flexDirection={'row'} flex={1}>
        <Box display={'flex'} flexDirection={'column'} flex={1}>
          <Box display={'flex'} flexDirection={'row'}>
            <ResponsiveContainer width='100%' height={400}>
              <ComposedChart
                data={saleChartData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke='#f5f5f5' />
                <XAxis dataKey='label' />
                <YAxis tick={{ fill: '#82ca9d' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey='totalSale' barSize={20} fill='#2196f3' />
                <Line type='monotone' dataKey='totalPresale' stroke='#b2102f' strokeWidth={3} />
                <Scatter dataKey='totalTarget' fill='#ff9100' shape='square' />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Paper elevation={24}>
                <ResponsiveContainer width='100%' height={400}>
                  <BarChart
                    width={500}
                    height={300}
                    data={dataBrushBarChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign='top' wrapperStyle={{ lineHeight: '40px' }} />
                    <ReferenceLine y={0} stroke='#000' />
                    <Brush
                      dataKey='name'
                      height={30}
                      stroke='#8884d8'
                      fill='#e0e0e0'
                      travellerWidth={10}
                    />
                    <Bar dataKey='pv' fill='#8884d8' />
                    <Bar dataKey='uv' fill='#82ca9d' />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Paper elevation={24} sx={{ height: '100%' }}>
                <ResponsiveContainer width='100%' height={400}>
                  <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout='vertical'
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis type='number' />
                    <YAxis dataKey='name' type='category' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='pv' fill='#8884d8' />
                    <Bar dataKey='amt' fill='#82ca9d' />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </Box>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          sx={{ width: '25%' }}
          p={1}
          ref={containerRef}
        >
          <Paper elevation={24} sx={{ height: '100%' }}>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={dataPieChart}
                  cx='50%'
                  cy='50%'
                  innerRadius='50%'
                  outerRadius='70%'
                  startAngle={90}
                  endAngle={-270}
                  dataKey='value'
                >
                  <Cell fill={'#8884d8'} />
                  <Cell fill='#e0e0e0' /> {/* Light gray for the unfilled portion */}
                </Pie>
                <text
                  x='50%'
                  y='50%'
                  textAnchor='middle'
                  dominantBaseline='middle'
                  className='text-3xl font-bold'
                  fill={'white'}
                >
                  {`${value}%`}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={'100%'} height={400}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={data01}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={outerRadius}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {data01.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

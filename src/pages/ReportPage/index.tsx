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
import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent'
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

interface CustomTooltipProps extends TooltipProps<number, string> {
  chartId?: string
  typeFormatValue?: 'percent' | 'currency' | ''
}

export default function ReportPage() {
  const [outerRadius, setOuterRadius] = useState(112)
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    profitChartData,
    saleChartData,
    bestSaleProductChartData,
    worstSaleProductChartData,
    getSaleReport,
    getBestSaleProductReport,
    getProfitReport,
    getWorstSaleProductReport,
  } = useReport()
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    startDate: new Date(),
    endDate: new Date(),
  })
  let value = 56
  const dataPieChart = [
    { name: 'Completed', value: value },
    { name: 'Remaining', value: 100 - value },
  ]

  const currencyFormatter = (value: number, typeValue?: 'percent' | 'currency') => {
    switch (typeValue) {
      case 'currency':
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
        }).format(value)
      case 'percent':
        return `${value}%`
      default:
        return ''
    }
  }

  const CustomTooltip = ({ active, payload, label, chartId = undefined }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      console.log(payload, chartId)
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
          {!chartId && <p className='label'>{`${label}`}</p>}
          {payload.map(pld => (
            <p key={pld.name} style={{ color: pld.color }}>
              {chartId
                ? `${pld.name} : ${pld.value}`
                : convertTooltip(pld.name ?? '', pld.value ?? 0)}{' '}
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

  const customLegendFormatter = (value: string) => {
    const labelMap: { [key: string]: string } = {
      totalUnit: 'Custom UV Label',
      totalProfit: '総利益',
      quantityPercent: '数量',
      profitPercent: '売上',
      totalSale: '売上',
      totalPreSale: '予測販売値',
      totalTarget: '目標',
    }
    return labelMap[value] || value
  }

  const convertTooltip = (label: string, value: number, payload?: Payload<number, string>) => {
    const labelMap: { [key: string]: string } = {
      totalUnit: 'Custom UV Label',
      totalProfit: '総利益',
      quantityPercent: '数量',
      profitPercent: '売上',
      totalSale: '売上',
      totalPreSale: '予測販売値',
      totalTarget: '目標',
    }
    return `${labelMap[label]} : ${value}` || value
  }
  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    getSaleReport(searchCriteria)
    getBestSaleProductReport(searchCriteria)
    getWorstSaleProductReport(searchCriteria)
    getProfitReport(searchCriteria)
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
                <Legend formatter={customLegendFormatter} />
                <Bar dataKey='totalSale' barSize={20} fill='#2196f3' />
                <Line
                  type='monotone'
                  dataKey='totalPreSale'
                  label='TotalPreSale'
                  stroke='#b2102f'
                  strokeWidth={3}
                />
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
                    data={profitChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='label' />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign='top'
                      wrapperStyle={{ lineHeight: '40px' }}
                      formatter={customLegendFormatter}
                    />
                    <ReferenceLine y={0} stroke='#000' />
                    <Brush
                      dataKey='name'
                      height={30}
                      stroke='#8884d8'
                      fill='#e0e0e0'
                      travellerWidth={10}
                    />
                    <Bar dataKey='totalProfit' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Paper elevation={24} sx={{ height: '100%' }}>
                <ResponsiveContainer width='100%' height={400}>
                  <BarChart
                    width={300}
                    height={300}
                    data={worstSaleProductChartData}
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
                    <YAxis dataKey='productName' type='category' tick={{ fill: '#ffffff' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={customLegendFormatter} />
                    <Bar dataKey='quantityPercent' fill='#8884d8' />
                    <Bar dataKey='profitPercent' fill='#82ca9d' />
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
                <Pie
                  data={bestSaleProductChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={outerRadius}
                  fill='#8884d8'
                  dataKey='profitPercent'
                  id='bestSaleProductChart'
                  nameKey={'productName'}
                >
                  {bestSaleProductChartData &&
                    bestSaleProductChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.totalProfit}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip
                  content={
                    <CustomTooltip chartId='bestSaleProductChart' typeFormatValue='percent' />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

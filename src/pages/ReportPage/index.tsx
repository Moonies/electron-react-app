import { Box, Card, CardContent, CardHeader, Paper, SvgIcon, Typography } from '@mui/material'
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
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
  BarChart,
  ReferenceLine,
  Brush,
} from 'recharts'
import BestSaleProductChart from './components/BestSaleProductChart'
import CustomTooltip from './components/CustomTooltip'
import ProgressChart from './components/ProgressChart'
import SubHeader from './components/SubHeader'
import useReport from './hooks/useReport'
import CustomIcon from 'components/CustomIcon'

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
    customLegendFormatter,
    progressChartData,
    inProgessValue,
    getTotalSale,
  } = useReport()
  const [searchCriteria, setSearchCriteria] = useState({
    category: '',
    startDate: new Date(),
    endDate: new Date(),
  })

  const handleChange = (name: string, value: string | Date) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    getSaleReport(searchCriteria)
    getBestSaleProductReport(searchCriteria)
    getWorstSaleProductReport(searchCriteria)
    getProfitReport(searchCriteria)
    getTotalSale(searchCriteria)
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
      <SubHeader
        handleChange={handleChange}
        handleSearch={handleSearch}
        searchCriteria={searchCriteria}
      />
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
          <CardHeader title='Total Sale' subheader='9999.99'></CardHeader>
          <CardContent>
            <CustomIcon name='bullsEyeTarget' color='info' fontSize='large' />
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
                    <Tooltip content={<CustomTooltip typeFormatValue='percent' />} />
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
            <ProgressChart dataPieChart={progressChartData} inProgressValue={inProgessValue} />
            <BestSaleProductChart
              bestSaleProductChartData={bestSaleProductChartData}
              outerRadius={outerRadius}
            />
            {/* <ResponsiveContainer width={'100%'} height={400}>
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
            </ResponsiveContainer> */}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

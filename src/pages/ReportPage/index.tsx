import { Box, CardContent, CardHeader, Divider, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import BestSaleProductChart from './components/BestSaleProductChart'
import ProgressChart from './components/ProgressChart'
import SubHeader from './components/SubHeader'
import useReport from './hooks/useReport'
import CustomIcon from 'components/CustomIcon'
import SaleChart from './components/SaleChart'
import SaleProfitChart from './components/SaleProfitChart'
import WorstSaleProductChart from './components/WorstSaleProductChart'
import { StyledCard } from './styles'

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
    getSummary,
    formatTextDisplay,
    summaryData,
    formatTextCompare,
    summaryCompareData,
    checkTextColor,
    calculateDateDifference,
  } = useReport()
  const [searchCriteria, setSearchCriteria] = useState({
    category: 'YEAR',
    startDate: dayjs().subtract(3, 'month').toDate(),
    endDate: new Date(),
  })
  const [labelCompare, setLabelCompare] = useState('')
  const [labelSelectedYear, setLabelSelectedYear] = useState(
    `${dayjs(searchCriteria.startDate).format('YYYY')} ~ ${dayjs(searchCriteria.endDate).format('YYYY')}`
  )

  const handleChange = (name: string, value: string | Date | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    let newSearchCriteria = {
      ...searchCriteria,
      startDate: dayjs(searchCriteria.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(searchCriteria.endDate).format('YYYY-MM-DD'),
    }
    const previousDate = calculateDateDifference(
      newSearchCriteria.startDate,
      newSearchCriteria.endDate
    )
    getSaleReport(newSearchCriteria)
    getBestSaleProductReport(newSearchCriteria)
    getWorstSaleProductReport(newSearchCriteria)
    getProfitReport(newSearchCriteria)
    getSummary(newSearchCriteria)
    setLabelCompare(`${previousDate.startDate} ~ ${previousDate.endDate}との比較`)
    setLabelSelectedYear(
      `${dayjs(searchCriteria.startDate).format('YYYY')} ~ ${dayjs(searchCriteria.endDate).format('YYYY')}`
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
        <StyledCard variant='outlined'>
          <CardHeader
            title={
              <Typography component='div' variant='h6'>
                売上総額
              </Typography>
            }
            subheader={formatTextDisplay(summaryData?.totalSale ?? 0)}
            avatar={<CustomIcon name='coins' color='action' fontSize='large' />}
          />
          <CardContent>
            <Typography>{labelCompare}</Typography>
            <Typography color={checkTextColor(summaryCompareData?.saleData)}>
              {formatTextCompare(summaryCompareData?.saleData)}
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard variant='outlined'>
          <CardHeader
            title={
              <Typography component='div' variant='h6'>
                売上数量
              </Typography>
            }
            subheader={summaryData?.totalUnit}
            avatar={<CustomIcon name='boxesStacked' color='action' fontSize='large' />}
          />
          <CardContent>
            <Typography>{labelCompare}</Typography>
            <Typography color={checkTextColor(summaryCompareData?.unitData)}>
              {formatTextCompare(summaryCompareData?.unitData, 'quantity')}
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard variant='outlined'>
          <CardHeader
            title={
              <Typography component='div' variant='h6'>
                原価総額
              </Typography>
            }
            subheader={formatTextDisplay(summaryData?.totalCost ?? 0)}
            avatar={<CustomIcon name='moneyDollar' color='secondary' fontSize='large' />}
          />
          <CardContent>
            <Typography>{labelCompare}</Typography>
            <Typography color={checkTextColor(summaryCompareData?.costData)}>
              {formatTextCompare(summaryCompareData?.costData)}
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard variant='outlined'>
          <CardHeader
            title={
              <Typography component='div' variant='h6'>
                粗利益
              </Typography>
            }
            subheader={formatTextDisplay(summaryData?.totalProfit ?? 0)}
            avatar={<CustomIcon name='handHoldingDollar' color='action' fontSize='large' />}
          />
          <CardContent>
            <Typography>{labelCompare}</Typography>
            <Typography color={checkTextColor(summaryCompareData?.profitData)}>
              {formatTextCompare(summaryCompareData?.profitData)}
            </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard variant='outlined'>
          <CardHeader
            title={
              <Typography component='div' variant='h6'>
                {labelSelectedYear}目標
              </Typography>
            }
            avatar={<CustomIcon name='bullsEyeTarget' color='action' fontSize='large' />}
          />
          <CardContent>
            <Typography variant='h4' color='text.secondary'>
              {formatTextDisplay(summaryData?.totalTarget ?? 0, true)}
            </Typography>
            <Typography>(平均)</Typography>
          </CardContent>
        </StyledCard>
      </Box>
      <Box display={'flex'} flexDirection={'row'} flex={1} gap={1}>
        <Box display={'flex'} flexDirection={'column'} flex={1}>
          <Box display={'flex'} flexDirection={'row'} flexGrow={1}>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Typography textAlign={'right'} pt={2} px={2} variant='subtitle1'>
                (百万円)
              </Typography>
              <SaleChart
                customLegendFormatter={value => customLegendFormatter(value)}
                saleChartData={saleChartData}
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={1}>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Paper elevation={24}>
                <Typography textAlign={'left'} pt={1} px={2} variant='subtitle1'>
                  総利益（粗利）
                </Typography>
                <Typography textAlign={'right'} pt={1} px={2} variant='subtitle2'>
                  (百万円)
                </Typography>
                <SaleProfitChart
                  customLegendFormatter={value => customLegendFormatter(value)}
                  profitChartData={profitChartData}
                />
              </Paper>
            </Box>
            <Box display={'flex'} flexDirection={'column'} flex={1}>
              <Paper elevation={24} sx={{ height: '100%' }}>
                <Typography textAlign={'left'} pt={1} px={2} variant='subtitle1'>
                  商品別生産効率(悪い5選)
                </Typography>
                <WorstSaleProductChart
                  customLegendFormatter={value => customLegendFormatter(value)}
                  worstSaleProductChartData={worstSaleProductChartData}
                />
              </Paper>
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} flexDirection={'column'} width={'25%'} ref={containerRef}>
          <Paper elevation={24} sx={{ height: '100%', padding: 2 }}>
            <Typography align='center' variant='h4' pt={1}>
              パフォーマンス
            </Typography>
            <Typography align='left' variant='subtitle1' pt={2}>
              <Divider textAlign='left'>売上目標達成率</Divider>
            </Typography>
            <ProgressChart dataPieChart={progressChartData} inProgressValue={inProgessValue} />
            <Typography align='left' variant='subtitle1'>
              <Divider textAlign='left'>粗利に影響する商品</Divider>
            </Typography>
            <BestSaleProductChart
              bestSaleProductChartData={bestSaleProductChartData}
              outerRadius={outerRadius}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

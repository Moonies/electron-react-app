import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import SubHeader from './components/SubHeader'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@mui/material'
import { StyledCard, StyledCardContent } from './styles'
import useKpi from './hooks/useKpi'

interface FinancialData {
  planSalesRevenue?: number
  planVariableCosts?: number
  planFixedCosts?: number
  planMarginalProfit?: number
  planMarginalProfitRate?: string
  planOperatingIncome?: number
  planOperatingExpenses?: number
  planOrdinaryProfit?: number
  actualSalesRevenue?: number
  actualVariableCosts?: number
  actualFixedCosts?: number
  actualMarginalProfit?: number
  actualMarginalProfitRate?: string
  actualOperatingIncome?: number
  actualOperatingExpenses?: number
  actualOrdinaryProfit?: number
  resultSalesRevenueIncrease?: number
  resultSalesRevenue?: number
  resultSalesRevenueIncreaseRate?: string
  resultFixedCosts?: number
  resultOperatingIncome?: string
  resultOperatingExpenses?: string
  resultSubTotal?: number
}

interface SettingPlanFinancialData {
  settingSalesRevenue?: number
  settingVariableCosts?: number
  settingFixedCosts?: number
  settingMarginalProfit?: number
  settingMarginalProfitRate?: string
  settingOperatingIncome?: number
  settingOperatingExpenses?: number
  settingOrdinaryProfit?: number
}

export default function KpiPage() {
  const [formData, setFormData] = useState<FinancialData>({})

  const [settingPlanData, setSettingPlanData] = useState<SettingPlanFinancialData>({})

  const [errors, setErrors] = useState<Partial<FinancialData>>({})

  const { getKpiData, kpiData, isShrink } = useKpi()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (value) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newErrors[key] = '必須項目です'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      console.log('Form submitted:', formData)
      // Handle form submission
    }
  }

  const handleClickGetData = () => {
    getKpiData()
  }

  useEffect(() => {
    setFormData(kpiData)
  }, [kpiData])

  return (
    <Box padding={2} display={'flex'} flexDirection={'column'} flex={1}>
      <SubHeader onSubmit={handleSubmit} onPressGetData={handleClickGetData} />
      <Box
        display={'flex'}
        flexDirection={'row'}
        flex={1}
        justifyContent='space-around'
        pt={2}
        gap={1}
      >
        <StyledCard id='plan-card'>
          <CardHeader
            title='2022xxx'
            sx={{
              textAlign: 'center',
              backgroundColor: theme => theme.palette.info.dark,
            }}
          />

          <StyledCardContent>
            <Typography sx={{ mb: 0.5 }} textAlign='right'>
              (百万円)
            </Typography>
            <TextField
              name='planSalesRevenue'
              label='売上高'
              value={formData.planSalesRevenue}
              onChange={handleChange}
              fullWidth
              type={'number'}
              required
              error={!!errors.planSalesRevenue}
              helperText={errors.planSalesRevenue}
              InputLabelProps={{ shrink: isShrink(formData.planSalesRevenue) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='planVariableCosts'
              label='変動費'
              value={formData.planVariableCosts}
              onChange={handleChange}
              fullWidth
              type={'number'}
              required
              error={!!errors.planVariableCosts}
              helperText={errors.planVariableCosts}
              InputLabelProps={{ shrink: isShrink(formData.planVariableCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='planMarginalProfit'
              label='限界利益'
              value={formData.planMarginalProfit}
              onChange={handleChange}
              type={'number'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: isShrink(formData.planMarginalProfit) }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.planMarginalProfit}
            />
            <TextField
              name='planMarginalProfitRate'
              label='限界利益率'
              value={formData.planMarginalProfitRate}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: !!formData.planMarginalProfitRate }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.planMarginalProfitRate}
            />
            <TextField
              name='planFixedCosts'
              label='固定費'
              value={formData.planFixedCosts}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.planFixedCosts}
              helperText={errors.planFixedCosts}
              InputLabelProps={{ shrink: isShrink(formData.planFixedCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='planOperatingIncome'
              label='営業外収益'
              value={formData.planOperatingIncome}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.planOperatingIncome}
              helperText={errors.planOperatingIncome}
              InputLabelProps={{ shrink: isShrink(formData.planOperatingIncome) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='planOperatingExpenses'
              label='営業外費用'
              value={formData.planOperatingExpenses}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.planOperatingExpenses}
              helperText={errors.planOperatingExpenses}
              InputLabelProps={{ shrink: isShrink(formData.planOperatingExpenses) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='planOrdinaryProfit'
              label='経常利益'
              value={formData.planOrdinaryProfit}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.planOrdinaryProfit}
              helperText={errors.planOrdinaryProfit}
              InputLabelProps={{ shrink: isShrink(formData.planOrdinaryProfit) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
          </StyledCardContent>
        </StyledCard>
        <StyledCard id='actual-card'>
          <CardHeader
            title='2023xxx'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <Typography sx={{ mb: 0.5 }} textAlign='right'>
              (百万円)
            </Typography>
            <TextField
              name='actualSalesRevenue'
              label='売上高'
              value={formData.actualSalesRevenue}
              onChange={handleChange}
              fullWidth
              type={'number'}
              required
              error={!!errors.actualSalesRevenue}
              helperText={errors.actualSalesRevenue}
              InputLabelProps={{ shrink: isShrink(formData.actualSalesRevenue) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='actualVariableCosts'
              label='変動費'
              value={formData.actualVariableCosts}
              onChange={handleChange}
              fullWidth
              type={'number'}
              required
              error={!!errors.actualVariableCosts}
              helperText={errors.actualVariableCosts}
              InputLabelProps={{
                shrink: isShrink(formData.actualVariableCosts),
              }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='actualMarginalProfit'
              label='限界利益'
              value={formData.actualMarginalProfit}
              onChange={handleChange}
              type={'number'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: isShrink(formData.actualMarginalProfit) }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='actualMarginalProfitRate'
              label='限界利益率'
              value={formData.actualMarginalProfitRate}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: !!formData.actualMarginalProfitRate }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='actualFixedCosts'
              label='固定費'
              value={formData.actualFixedCosts}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.actualFixedCosts}
              helperText={errors.actualFixedCosts}
              InputLabelProps={{ shrink: isShrink(formData.actualFixedCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='actualOperatingIncome'
              label='営業外収益'
              value={formData.actualOperatingIncome}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.actualOperatingIncome}
              helperText={errors.actualOperatingIncome}
              InputLabelProps={{ shrink: isShrink(formData.actualOperatingIncome) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='actualOperatingExpenses'
              label='営業外費用'
              value={formData.actualOperatingExpenses}
              onChange={handleChange}
              fullWidth
              required
              type={'number'}
              error={!!errors.actualOperatingExpenses}
              helperText={errors.actualOperatingExpenses}
              InputLabelProps={{ shrink: isShrink(formData.actualOperatingExpenses) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='actualOrdinaryProfit'
              label='経常利益'
              value={formData.actualOrdinaryProfit}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.actualOrdinaryProfit}
              helperText={errors.actualOrdinaryProfit}
              InputLabelProps={{ shrink: isShrink(formData.actualOrdinaryProfit) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
          </StyledCardContent>
        </StyledCard>
        <StyledCard id='result-card'>
          <CardHeader
            title='result'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <TextField
              name='resultSalesRevenueIncrease'
              label='経常利益増減'
              value={formData.resultSalesRevenueIncrease}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.resultSalesRevenueIncrease}
              helperText={errors.resultSalesRevenueIncrease}
              InputLabelProps={{ shrink: !!formData.resultSalesRevenueIncrease }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='resultSalesRevenue'
              label='売上高増減'
              value={formData.resultSalesRevenue}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.resultSalesRevenue}
              helperText={errors.resultSalesRevenue}
              InputLabelProps={{ shrink: !!formData.resultSalesRevenue }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='resultSalesRevenueIncreaseRate'
              label='限界利益率増減'
              value={formData.resultSalesRevenueIncreaseRate}
              onChange={handleChange}
              fullWidth
              type={'text'}
              error={!!errors.resultSalesRevenueIncreaseRate}
              helperText={errors.resultSalesRevenueIncreaseRate}
              InputLabelProps={{ shrink: !!formData.resultSalesRevenueIncreaseRate }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='resultFixedCosts'
              label='固定費増減要'
              value={formData.resultFixedCosts}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.resultFixedCosts}
              helperText={errors.resultFixedCosts}
              InputLabelProps={{ shrink: !!formData.resultFixedCosts }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='resultOperatingIncome'
              label='営業外収益増減'
              value={formData.resultOperatingIncome}
              onChange={handleChange}
              fullWidth
              type={'text'}
              error={!!errors.resultOperatingIncome}
              helperText={errors.resultOperatingIncome}
              InputLabelProps={{ shrink: !!formData.resultOperatingIncome }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='resultOperatingExpenses'
              label='営業が意表増減'
              value={formData.resultOperatingExpenses}
              onChange={handleChange}
              fullWidth
              type={'number'}
              error={!!errors.resultOperatingExpenses}
              helperText={errors.resultOperatingExpenses}
              InputLabelProps={{ shrink: !!formData.resultOperatingExpenses }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
          </StyledCardContent>
          <CardActions>
            <Button size='large'>小計</Button>
          </CardActions>
        </StyledCard>
        <StyledCard>
          <CardHeader
            title='setting plan'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <Typography sx={{ mb: 0.5 }} textAlign='right'>
              (百万円)
            </Typography>
            <TextField
              name='settingSalesRevenue'
              label='売上高'
              value={settingPlanData.settingSalesRevenue}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingSalesRevenue) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingVariableCosts'
              label='変動費'
              value={settingPlanData.settingVariableCosts}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingVariableCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingMarginalProfit'
              label='限界利益'
              value={settingPlanData.settingMarginalProfit}
              onChange={handleChange}
              type={'number'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingMarginalProfit) }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='settingMarginalProfitRate'
              label='限界利益率'
              value={settingPlanData.settingMarginalProfitRate}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: !!settingPlanData.settingMarginalProfitRate }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='settingFixedCosts'
              label='固定費'
              value={settingPlanData.settingFixedCosts}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingFixedCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOperatingIncome'
              label='営業外収益'
              value={settingPlanData.settingOperatingIncome}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingOperatingIncome) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOperatingExpenses'
              label='営業外費用'
              value={settingPlanData.settingOperatingExpenses}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingOperatingExpenses) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOrdinaryProfit'
              label='経常利益'
              value={settingPlanData.settingOrdinaryProfit}
              onChange={handleChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(settingPlanData.settingOrdinaryProfit) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
            />
          </StyledCardContent>
        </StyledCard>
      </Box>
    </Box>
  )
}

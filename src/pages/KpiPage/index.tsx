import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
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
import useKpi, { FinancialKpiData, SettingPlanFinancialKpiData } from './hooks/useKpi'
import useKpiGrpah from './hooks/useKpiGraph'
import BarChart, { DataPoint } from 'components/Chart/BarChart'
import { useConfirmModal } from 'hooks/useConfirmModal'
import KpiSettingModal from 'components/Modals/KpiSettingModal'
import { isShrink } from 'utils/inputUtils'
import useNotification from 'hooks/useNotification'

export default function KpiPage() {
  const [errors, setErrors] = useState<Partial<FinancialKpiData>>({})
  const [formSetting, setFormSetting] = useState<SettingPlanFinancialKpiData>({
    settingSalesRevenue: null,
    settingVariableCosts: null,
  })
  const {
    getKpiData,
    kpiData,
    kpiCalculate,
    settingPlanData,
    settingPlanCalculate,
    currentYear,
    reverseResultFormat,
    initFormData,
    saveSettingKpi,
  } = useKpi()
  const [formData, setFormData] = useState<FinancialKpiData>(initFormData)
  const { openWindow } = useKpiGrpah()
  const [planHeaderText, setPlanHeaderText] = useState('')
  const [actualHeaderText, setActualHeaderText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [planType, setPlanType] = useState<'time' | 'plan'>('time')
  const { openConfirmModal } = useConfirmModal()
  const { notificationModal } = useNotification()

  useEffect(() => console.log(kpiData), [kpiData])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: event.target.type === 'number' ? (value === '' ? null : Number(value)) : value,
    }))
    if (value) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const settingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormSetting(prev => ({
      ...prev,
      [name]: event.target.type === 'number' ? (value === '' ? null : Number(value)) : value,
    }))
    settingPlanCalculate({ ...formSetting, [name]: Number(value) })
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    Object.entries(formData).forEach(([key, value]) => {
      if (key.includes('result') ?? key.toLocaleLowerCase().includes('marginalprofit')) return
      if (value === undefined || value === null || value === '') {
        newErrors[key] = '必須項目です'
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
    } else {
      kpiCalculate(formData)
    }
  }

  const formatDisplayValue = (value: number | string | undefined | null): string => {
    if (typeof value === 'number') {
      return value.toFixed(2)
    }
    return value ?? ''
  }

  const handleClickGetData = () => {
    getKpiData(planType)
  }

  const handleOpenChart = () => {
    const chartData: DataPoint[] = [
      { name: '限界利益', value: reverseResultFormat(formData.resultOrdinaryProfit) ?? 0 },
      { name: '固定費', value: reverseResultFormat(formData.resultFixedCosts) ?? 0 },
      { name: '外収益', value: reverseResultFormat(formData.resultOperatingExpenses) ?? 0 },
      { name: '外費用', value: reverseResultFormat(formData.resultOperatingExpenses) ?? 0 },
      { name: '売上', value: reverseResultFormat(formData.resultSalesRevenue) ?? 0 },
    ]
    openWindow(BarChart, { data: chartData })
  }

  const handleReset = async () => {
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'Are you sure you want to reset data? \n data is all to be reset',
    })

    if (confirmed) {
      setFormData(initFormData)
      setFormSetting({ settingSalesRevenue: null, settingVariableCosts: null })
      setErrors({})
    }
  }

  const handleSave = () => {
    setModalOpen(true)
  }

  const handleSetting = (id: number) => {
    let newText = id === 1 ? currentYear - 1 + ' 年実績' : currentYear + ' 計画'
    setPlanHeaderText(newText)
    setPlanType(id === 1 ? 'time' : 'plan')
  }

  const handleModalConfirm = (inputYear: number) => {
    if (inputYear < currentYear - 1 || inputYear > currentYear + 1) {
      notificationModal.warning('KPI設定は去年と今年又と次の年のみ設定できます')
    } else {
      setModalOpen(false)
      saveSettingKpi(inputYear, formSetting)
    }
  }

  useEffect(() => {
    setPlanHeaderText(currentYear - 1 + ' 年実績')
    setActualHeaderText(currentYear + ' 年実績')
  }, [])
  useEffect(() => {
    setFormData({ ...kpiData })
    setErrors({})
  }, [kpiData])

  useEffect(() => {
    setFormSetting(settingPlanData)
  }, [settingPlanData])

  return (
    <Box padding={2} display={'flex'} flexDirection={'column'} flex={1}>
      <SubHeader
        onSubmit={handleSubmit}
        onPressGetData={handleClickGetData}
        onPressReset={handleReset}
        onPressSave={handleSave}
        onPressSetting={index => handleSetting(index)}
      />
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
            title={planHeaderText}
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
              value={formData.planSalesRevenue ?? ''}
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
              value={formData.planVariableCosts ?? ''}
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
              value={formatDisplayValue(formData.planMarginalProfit)}
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
              value={formData.planMarginalProfitRate ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
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
              value={formData.planFixedCosts ?? ''}
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
              value={formData.planOperatingIncome ?? ''}
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
              value={formData.planOperatingExpenses ?? ''}
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
              value={formatDisplayValue(formData.planOrdinaryProfit)}
              onChange={handleChange}
              fullWidth
              type={'number'}
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
            title={actualHeaderText}
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <Typography sx={{ mb: 0.5 }} textAlign='right'>
              (百万円)
            </Typography>
            <TextField
              name='actualSalesRevenue'
              label='売上高'
              value={formData.actualSalesRevenue ?? ''}
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
              value={formData.actualVariableCosts ?? ''}
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
              value={formatDisplayValue(formData.actualMarginalProfit)}
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
              value={formData.actualMarginalProfitRate ?? ''}
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
              value={formData.actualFixedCosts ?? ''}
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
              value={formData.actualOperatingIncome ?? ''}
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
              value={formData.actualOperatingExpenses ?? ''}
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
              value={formatDisplayValue(formData.actualOrdinaryProfit)}
              onChange={handleChange}
              fullWidth
              type={'number'}
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
            title='概要'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <TextField
              name='resultOrdinaryProfit'
              label='経常利益増減額'
              value={formData.resultOrdinaryProfit ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{
                shrink: isShrink(formData.resultOrdinaryProfit),
              }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultOrdinaryProfit}
            />
            <TextField
              name='resultSalesRevenue'
              label='売上高増減要因'
              value={formData.resultSalesRevenue ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{ shrink: isShrink(formData.resultSalesRevenue) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultSalesRevenue}
            />
            <TextField
              name='resultSalesRevenueIncreaseRate'
              label='限界利益率増減要因'
              value={formData.resultSalesRevenueIncreaseRate ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{ shrink: isShrink(formData.resultSalesRevenueIncreaseRate) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultSalesRevenueIncreaseRate}
            />
            <TextField
              name='resultFixedCosts'
              label='固定費増減要因'
              value={formData.resultFixedCosts ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{ shrink: isShrink(formData.resultFixedCosts) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultFixedCosts}
            />
            <TextField
              name='resultOperatingIncome'
              label='営業外収益増減要因'
              value={formData.resultOperatingIncome ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{ shrink: isShrink(formData.resultOperatingIncome) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultOperatingIncome}
            />
            <TextField
              name='resultOperatingExpenses'
              label='営業外費用増減要因'
              value={formData.resultOperatingExpenses ?? ''}
              onChange={handleChange}
              fullWidth
              type={'text'}
              InputLabelProps={{ shrink: isShrink(formData.resultOperatingExpenses) }}
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
              color='info'
              focused={!!formData.resultOperatingExpenses}
            />
          </StyledCardContent>
          <CardActions>
            <Button size='large' onClick={handleOpenChart} variant='outlined'>
              小計
            </Button>
            <Typography>{formData.resultSubTotal}</Typography>
          </CardActions>
        </StyledCard>
        <StyledCard id='setting-card'>
          <CardHeader
            title='希望年計画設置'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.info.dark }}
          />
          <StyledCardContent>
            <Typography sx={{ mb: 0.5 }} textAlign='right'>
              (百万円)
            </Typography>
            <TextField
              name='settingSalesRevenue'
              label='売上高'
              value={formSetting.settingSalesRevenue ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingSalesRevenue) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingVariableCosts'
              label='変動費'
              value={formSetting.settingVariableCosts ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingVariableCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingMarginalProfit'
              label='限界利益'
              value={formSetting.settingMarginalProfit ?? ''}
              onChange={settingChange}
              type={'number'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: isShrink(formSetting.settingMarginalProfit) }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='settingMarginalProfitRate'
              label='限界利益率'
              value={formSetting.settingMarginalProfitRate ?? ''}
              onChange={settingChange}
              fullWidth
              type={'text'}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: !!formSetting.settingMarginalProfitRate }}
              margin='normal'
              variant='standard'
              size='small'
              color='info'
            />
            <TextField
              name='settingFixedCosts'
              label='固定費'
              value={formSetting.settingFixedCosts ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingFixedCosts) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOperatingIncome'
              label='営業外収益'
              value={formSetting.settingOperatingIncome ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingOperatingIncome) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOperatingExpenses'
              label='営業外費用'
              value={formSetting.settingOperatingExpenses ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingOperatingExpenses) }}
              margin='normal'
              size='small'
              color='info'
            />
            <TextField
              name='settingOrdinaryProfit'
              label='経常利益'
              value={formSetting.settingOrdinaryProfit ?? ''}
              onChange={settingChange}
              fullWidth
              type={'number'}
              InputLabelProps={{ shrink: isShrink(formSetting.settingOrdinaryProfit) }}
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
      {modalOpen && (
        <KpiSettingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={intputYear => handleModalConfirm(intputYear)}
        />
      )}
    </Box>
  )
}

import React, { useState } from 'react'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import SubHeader from './components/SubHeader'
import { Card, CardContent, CardHeader, TextField, Typography } from '@mui/material'

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
}

export default function KpiPage() {
  const [formData, setFormData] = useState<FinancialData>({
    planSalesRevenue: undefined,
    planVariableCosts: undefined,
    planFixedCosts: undefined,
    planMarginalProfit: undefined,
    planMarginalProfitRate: undefined,
    planOperatingIncome: undefined,
    planOperatingExpenses: undefined,
    planOrdinaryProfit: undefined,
  })

  const [errors, setErrors] = useState<Partial<FinancialData>>({})

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
      if (!value) {
        newErrors[key] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      console.log('Form submitted:', formData)
      // Handle form submission
    }
  }
  return (
    <Box padding={3} display={'flex'} flexDirection={'column'} flexGrow={1}>
      <SubHeader onSubmit={handleSubmit} />
      <Box
        display={'flex'}
        flexDirection={'row'}
        flexShrink={1}
        justifyContent='space-around'
        pt={2}
        gap={1}
      >
        <Card sx={{ minWidth: '33%' }}>
          <CardHeader
            title='2022xxx'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.primary.dark }}
          />

          <CardContent sx={{ overflow: 'auto' }}>
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
              margin='normal'
              size='small'
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
              margin='normal'
              size='small'
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
              margin='normal'
              variant='standard'
              size='small'
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
              margin='normal'
              variant='standard'
              size='small'
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
              margin='normal'
              size='small'
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
              margin='normal'
              size='small'
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
              margin='normal'
              size='small'
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
              margin='normal'
              InputProps={{
                readOnly: true,
              }}
              variant='standard'
              size='small'
            />
          </CardContent>
        </Card>
        <Card sx={{ minWidth: '33%' }}>
          <CardHeader
            title='2023xxx'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.primary.dark }}
          />
        </Card>
        <Card sx={{ minWidth: '33%' }}>
          <CardHeader
            title='result'
            sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.primary.dark }}
          />
        </Card>
      </Box>
    </Box>
  )
}

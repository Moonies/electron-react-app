import { BestSaleProductReportData } from 'api/report/getBestSaleProductReportData'
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import CustomTooltip from '../CustomTooltip'

interface CustomLabelRenderer {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

interface BestSaleProductChart {
  outerRadius: number
  bestSaleProductChartData?: BestSaleProductReportData[]
}
export default function BestSaleProductChart({
  outerRadius,
  bestSaleProductChartData,
}: BestSaleProductChart) {
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
  return (
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
              <Cell key={`cell-${entry.totalProfit}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip chartId='bestSaleProductChart' typeFormatValue='percent' />}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

import { SaleReportData } from 'api/report/getSaleReportData'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CustomTooltip from '../CustomTooltip'

interface SaleChartProps {
  saleChartData?: SaleReportData[]
  customLegendFormatter: (value: string) => string
}
export default function SaleChart({ customLegendFormatter, saleChartData }: SaleChartProps) {
  return (
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
        <XAxis dataKey='label' tick={{ fill: '#ffffff' }} />
        <YAxis tick={{ fill: '#ffffff' }} tickFormatter={value => (value / 1000000).toFixed(2)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={customLegendFormatter} verticalAlign='top' />
        <Bar dataKey='totalSale' barSize={40} fill='#2196f3' />
        <Line
          type='monotone'
          dataKey='totalPreSale'
          label='TotalPreSale'
          stroke='#FF0606'
          strokeWidth={3}
        />
        <Scatter dataKey='totalTarget' fill='#ff9100' shape='square' />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

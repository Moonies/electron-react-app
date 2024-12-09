import { ProfitReportData } from 'api/report/getProfitReportData'
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CustomTooltip from '../CustomTooltip'

interface SaleProfitChartProps {
  profitChartData?: ProfitReportData[]
  customLegendFormatter: (value: string) => string
}
export default function SaleProfitChart({
  customLegendFormatter,
  profitChartData,
}: SaleProfitChartProps) {
  return (
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
        <XAxis dataKey='label' tick={{ fill: '#ffffff' }} />
        <YAxis tick={{ fill: '#ffffff' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign='top'
          wrapperStyle={{ lineHeight: '40px' }}
          formatter={customLegendFormatter}
        />
        <ReferenceLine y={0} stroke='#000' />
        <Brush dataKey='label' height={30} stroke='#8884d8' fill='#e0e0e0' travellerWidth={10} />
        <Bar dataKey='totalProfit' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  )
}

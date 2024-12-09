import { WorstProductReportData } from 'api/report/getWorstSaleProductReportData'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CustomTooltip from '../CustomTooltip'
interface WorstSaleProductChartProps {
  worstSaleProductChartData?: WorstProductReportData[]
  customLegendFormatter: (value: string) => string
}
export default function WorstSaleProductChart({
  customLegendFormatter,
  worstSaleProductChartData,
}: WorstSaleProductChartProps) {
  return (
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
        <XAxis type='number' tick={{ fill: '#ffffff' }} />
        <YAxis dataKey='name' type='category' tick={{ fill: '#ffffff' }} />
        <Tooltip content={<CustomTooltip typeFormatValue='percent' />} />
        <Legend formatter={customLegendFormatter} />
        <Bar dataKey='quantityPercentage' fill='#8884d8' />
        <Bar dataKey='profitPercentage' fill='#82ca9d' />
      </BarChart>
    </ResponsiveContainer>
  )
}

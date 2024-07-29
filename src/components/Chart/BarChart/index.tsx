import React, { useCallback } from 'react'
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export interface DataPoint {
  name: string
  value: number
}

interface ChartComponentProps {
  data: DataPoint[]
}

const BarChart: React.FC<ChartComponentProps> = ({ data }) => {
  return (
    <div style={{ width: 700, height: 400 }}>
      <ResponsiveContainer width={'100%'}>
        <Chart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' barSize={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#82ca9d' : '#ff0000'} />
            ))}
          </Bar>{' '}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChart

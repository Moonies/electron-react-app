import React, { useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'

export interface DataPoint {
  name: string
  value: number
}

interface ChartComponentProps {
  data: DataPoint[]
}

interface CustomWindowProps {
  content: React.ReactNode
}

const Chart: React.FC<ChartComponentProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' barSize={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#82ca9d' : '#ff0000'} />
            ))}
          </Bar>{' '}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart

import React from 'react'
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from 'recharts'

export interface DataPoint {
  name: string
  value: number
}

interface ChartComponentProps {
  data: DataPoint[]
}

export default function SummaryResultChart({ data }: ChartComponentProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: 4,
            color: 'black',
          }}
        >
          <p className='label'>{`${label}:　${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 18,
          }}
        >
          (百万円)
        </span>
      </div>
      <div style={{ width: 700, height: 400 }}>
        <ResponsiveContainer width={'100%'}>
          <Chart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey='value' barSize={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#82ca9d' : '#ff0000'} />
              ))}
            </Bar>
          </Chart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

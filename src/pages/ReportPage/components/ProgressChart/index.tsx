import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface DataProgressChart {
  name: string
  value: number
}

interface ProgressChart {
  inProgressValue?: number
  dataPieChart?: DataProgressChart[]
}
export default function ProgressChart({ dataPieChart, inProgressValue }: ProgressChart) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={dataPieChart}
          cx='50%'
          cy='50%'
          innerRadius='50%'
          outerRadius='70%'
          startAngle={90}
          endAngle={-270}
          dataKey='value'
        >
          <Cell fill={'#8884d8'} />
          <Cell fill='#e0e0e0' /> {/* Light gray for the unfilled portion */}
        </Pie>
        <text
          x='50%'
          y='50%'
          textAnchor='middle'
          dominantBaseline='middle'
          className='text-3xl font-bold'
          fill={'white'}
        >
          {inProgressValue && `${inProgressValue}%`}
        </text>
      </PieChart>
    </ResponsiveContainer>
  )
}

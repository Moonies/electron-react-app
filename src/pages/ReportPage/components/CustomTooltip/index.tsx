import useReport from 'pages/ReportPage/hooks/useReport'
import { TooltipProps } from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  chartId?: string
  typeFormatValue?: 'percent' | 'currency' | ''
}

export default function CustomTooltip({
  active,
  payload,
  label,
  chartId = undefined,
  typeFormatValue = 'currency',
}: CustomTooltipProps) {
  const { currencyFormatter, convertTooltip } = useReport()
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          color: 'black',
        }}
      >
        {!chartId && <p className='label'>{`${label}`}</p>}
        {payload.map(pld => (
          <p key={pld.name} style={{ color: pld.color }}>
            {chartId
              ? `${pld.name} : ${currencyFormatter(pld.value, typeFormatValue)}`
              : convertTooltip(pld.name ?? '', currencyFormatter(pld.value, typeFormatValue))}
          </p>
        ))}
      </div>
    )
  }

  return null
}

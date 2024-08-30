import { Grid, Paper, Toolbar, Typography } from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Box } from '@mui/system'

export default function DashboardPage() {
  return (
    <Box flex={1} padding={3}>
      {/* <Toolbar /> */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant='h4'>Welcome to Hayaraku</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant='h6'>建築構造中</Typography>
            {/* Add a list of recent activities here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

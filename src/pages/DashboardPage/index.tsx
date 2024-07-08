import { Grid, Paper, Toolbar, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';


const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

export default function DashboardPage() {

  return (
    <Box flex={1} padding={3}>
      <Toolbar />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4">Dashboard</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Sales Overview</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Recent Activity</Typography>
            {/* Add a list of recent activities here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

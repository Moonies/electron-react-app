import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function SalePage() {
    return (
        <Box>
            <Paper sx={{ padding: 20 }}>
                <Typography variant="h4">Sales</Typography>
                <Typography paragraph>
                    This is the Sales page. Add your sales-related content here.
                </Typography>
            </Paper>
        </Box>
    )
}

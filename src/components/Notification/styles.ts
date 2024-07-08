import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';

export const StyledAlert = styled(Alert)(({ theme }) => ({
    padding: '10px 16px', // Increase overall padding
    '& .MuiAlert-message': {
        fontSize: '1.1rem', // Increase font size
    },
    '& .MuiAlert-icon': {
        fontSize: '2rem', // Increase icon size
    },
    '& .MuiAlert-action': {
        paddingTop: 6, // Adjust padding to align with larger text
    },
}));

// You can add more styled components here as needed
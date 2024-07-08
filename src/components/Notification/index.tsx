import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { RootState } from 'store/index';
import { clearNotification } from 'store/notificationSlice';
import { StyledAlert } from './styles';

const Notification: React.FC = () => {
    const dispatch = useDispatch();
    const { message, type, severity } = useSelector((state: RootState) => state.notification);

    const handleClose = () => {
        dispatch(clearNotification());
    };

    if (type === 'modal') {
        return (
            <Dialog open={!!message} onClose={handleClose}>
                <DialogTitle>{severity === 'error' ? 'Error' : 'Notification'}</DialogTitle>
                <DialogContent>{message}</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={type === 'alert' ? null : 6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

        >
            <StyledAlert onClose={handleClose} severity={severity}
                variant="filled"
                sx={{ width: '100%', color: 'white' }}

            >
                {message}
            </StyledAlert>
        </Snackbar>
    );
};

export default Notification;
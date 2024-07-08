import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    message: string | null;
    type: 'snackbar' | 'alert' | 'modal' | null;
    severity: 'error' | 'warning' | 'info' | 'success';
}

const initialState: NotificationState = {
    message: null,
    type: null,
    severity: 'info',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<NotificationState>) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.severity = action.payload.severity;
        },
        clearNotification: (state) => {
            state.message = null;
            state.type = null;
        },
    },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
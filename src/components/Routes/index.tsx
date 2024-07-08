import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from 'pages/LoginPage';
import Dashboard from 'pages/DashboardPage';
import SalePage from 'pages/SalePage';
import KpiPage from 'pages/KpiPage';
import { RootState } from 'store/index';

const Routes: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    console.log(isAuthenticated)
    return (
        <RouterRoutes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/sales" element={<SalePage />} />
            {/* <Route path="/orders" element={<OrderPage />} /> */}
            {/* <Route path="/store" element={<StorePage />} /> */}
            <Route path="/kpi" element={<KpiPage />} />
            {/* <Route path="/reports" element={<ReportPage />} /> */}
            {/* <Route path="/products" element={<ProductPage />} /> */}
            {/* <Route path="/settings" element={<SettingPage />} /> */}
            <Route path="*" element={<Navigate to="/login" />} />
        </RouterRoutes>
    );
};

export default Routes;
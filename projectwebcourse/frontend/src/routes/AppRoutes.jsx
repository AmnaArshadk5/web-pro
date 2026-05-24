import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Wallet from '../pages/Wallet';
import Transactions from '../pages/Transactions';
import TransactionReceipt from '../pages/TransactionReceipt';
import Expenses from '../pages/Expenses';
import Budgets from '../pages/Budgets';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Marketplace from '../pages/Marketplace';
import Financing from '../pages/Financing';
import Profile from '../pages/Profile';
import RetailerDashboard from '../pages/RetailerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminWallets from '../pages/AdminWallets';
import AdminTransactions from '../pages/AdminTransactions';
import AdminCategories from '../pages/AdminCategories';
import AdminReports from '../pages/AdminReports';
import AdminFinancing from '../pages/AdminFinancing';
import AdminFlagged from '../pages/AdminFlagged';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionReceipt />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/wallets" element={<AdminWallets />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/financing" element={<AdminFinancing />} />
        <Route path="/admin/flagged" element={<AdminFlagged />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;

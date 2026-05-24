import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/admin/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getDashboardAnalytics = async () => {
  const response = await axios.get(API_URL + 'dashboard', getAuthHeaders());
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get(API_URL + 'users', getAuthHeaders());
  return response.data;
};

const blockUser = async (id) => {
  const response = await axios.patch(API_URL + `users/${id}/block`, {}, getAuthHeaders());
  return response.data;
};

const unblockUser = async (id) => {
  const response = await axios.patch(API_URL + `users/${id}/unblock`, {}, getAuthHeaders());
  return response.data;
};

const getFlaggedTransactions = async () => {
  const response = await axios.get(API_URL + 'transactions/flagged', getAuthHeaders());
  return response.data;
};

const getAllWallets = async () => {
  const response = await axios.get(API_URL + 'wallets', getAuthHeaders());
  return response.data;
};

const getAllTransactions = async () => {
  const response = await axios.get(API_URL + 'transactions', getAuthHeaders());
  return response.data;
};

const getTransactionVolumeReport = async () => {
  const response = await axios.get(API_URL + 'reports/transaction-volume', getAuthHeaders());
  return response.data;
};

const getSystemBalanceReport = async () => {
  const response = await axios.get(API_URL + 'reports/system-balance', getAuthHeaders());
  return response.data;
};

const getAuditLogs = async () => {
  const response = await axios.get(API_URL + 'audit-logs', getAuthHeaders());
  return response.data;
};

const updateTransactionStatus = async (id, status) => {
  const response = await axios.patch(API_URL + `transactions/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};

const toggleWalletStatus = async (id) => {
  const response = await axios.patch(API_URL + `wallets/${id}/toggle-status`, {}, getAuthHeaders());
  return response.data;
};

const adminService = {
  getDashboardAnalytics,
  getUsers,
  blockUser,
  unblockUser,
  getFlaggedTransactions,
  getAllWallets,
  getAllTransactions,
  getTransactionVolumeReport,
  getSystemBalanceReport,
  getAuditLogs,
  updateTransactionStatus,
  toggleWalletStatus,
};

export default adminService;

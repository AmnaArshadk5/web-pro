import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/transactions/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getTransactions = async (query = '') => {
  const response = await axios.get(`${API_URL}${query}`, getAuthHeaders());
  return response.data;
};

const getTransactionById = async (id) => {
  const response = await axios.get(API_URL + id, getAuthHeaders());
  return response.data;
};

const transactionService = {
  getTransactions,
  getTransactionById,
};

export default transactionService;

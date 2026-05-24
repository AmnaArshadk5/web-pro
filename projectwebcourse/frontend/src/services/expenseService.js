import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/expenses/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getExpenses = async (query = '') => {
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

const getExpenseSummary = async () => {
  const response = await axios.get(API_URL + 'summary', getAuthHeaders());
  return response.data;
};

const createExpense = async (expenseData) => {
  const response = await axios.post(API_URL, expenseData, getAuthHeaders());
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  const response = await axios.put(API_URL + id, expenseData, getAuthHeaders());
  return response.data;
};

const deleteExpense = async (id) => {
  const response = await axios.delete(API_URL + id, getAuthHeaders());
  return response.data;
};

const expenseService = {
  getExpenses,
  getExpenseSummary,
  createExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;

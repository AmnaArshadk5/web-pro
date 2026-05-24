import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/budgets/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getCurrentBudget = async () => {
  const response = await axios.get(API_URL + 'current', getAuthHeaders());
  return response.data;
};

const createBudget = async (budgetData) => {
  const response = await axios.post(API_URL, budgetData, getAuthHeaders());
  return response.data;
};

const budgetService = {
  getCurrentBudget,
  createBudget,
};

export default budgetService;

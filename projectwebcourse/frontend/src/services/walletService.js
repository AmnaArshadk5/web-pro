import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/wallet';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getWallet = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const getWalletSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeaders());
  return response.data;
};

const deposit = async (amount, description) => {
  const response = await axios.post(`${API_URL}/deposit`, { amount, description }, getAuthHeaders());
  return response.data;
};

const withdraw = async (amount, description) => {
  const response = await axios.post(`${API_URL}/withdraw`, { amount, description }, getAuthHeaders());
  return response.data;
};

const transfer = async (receiverEmail, amount, description) => {
  const response = await axios.post(`${API_URL}/transfer`, { receiverEmail, amount, description }, getAuthHeaders());
  return response.data;
};

const walletService = {
  getWallet,
  getWalletSummary,
  deposit,
  withdraw,
  transfer,
};

export default walletService;

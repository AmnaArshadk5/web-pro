import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/loans';

const getMyLoans = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const applyForLoan = async (loanData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };
  const response = await axios.post(API_URL, loanData, config);
  return response.data;
};

const payInstallment = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };
  const response = await axios.post(`${API_URL}/${id}/pay`, {}, config);
  return response.data;
};

const loanService = { getMyLoans, applyForLoan, payInstallment };
export default loanService;

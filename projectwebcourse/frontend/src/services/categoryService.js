import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getCategoriesAdmin = async () => {
  const response = await axios.get(`${API_URL}categories`, getAuthHeaders());
  return response.data;
};

const createCategory = async (data) => {
  const response = await axios.post(`${API_URL}admin/categories`, data, getAuthHeaders());
  return response.data;
};

const updateCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}admin/categories/${id}`, data, getAuthHeaders());
  return response.data;
};

const toggleCategoryStatus = async (id) => {
  const response = await axios.patch(`${API_URL}admin/categories/${id}/disable`, {}, getAuthHeaders());
  return response.data;
};

const categoryService = {
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  toggleCategoryStatus
};

export default categoryService;

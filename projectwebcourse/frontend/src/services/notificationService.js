import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/notifications/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

const getNotifications = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const markAsRead = async (id) => {
  const response = await axios.patch(API_URL + id + '/read', {}, getAuthHeaders());
  return response.data;
};

const markAllAsRead = async () => {
  const response = await axios.patch(API_URL + 'read-all', {}, getAuthHeaders());
  return response.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;

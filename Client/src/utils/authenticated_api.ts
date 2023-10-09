import axios from 'axios';

const authenticated_api = axios.create({
  baseURL: 'https://housemates-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

authenticated_api.interceptors.request.use(
  (config) => {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authenticated_api;
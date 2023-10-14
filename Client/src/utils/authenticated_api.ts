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

authenticated_api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    sessionStorage.clear()
    window.location.reload()
  }
  return error;
});

export default authenticated_api;
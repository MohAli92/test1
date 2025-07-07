import axios from 'axios';

// Dynamic API URL detection
const getApiUrl = () => {
  console.log('🔍 Detecting API URL...');
  console.log('- Current URL:', window.location.href);
  console.log('- Hostname:', window.location.hostname);
  console.log('- Origin:', window.location.origin);
  console.log('- REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim() !== '') {
    console.log('✅ Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Check if we're in GitHub Codespaces
  if (window.location.hostname.includes('github.dev')) {
    // Extract the codespace URL and replace port 3000 with 5000
    const currentUrl = window.location.origin;
    const codespaceUrl = currentUrl.replace(':3000', ':5000');
    console.log('✅ Detected GitHub Codespaces');
    console.log('- Current URL:', currentUrl);
    console.log('- API URL:', codespaceUrl);
    return codespaceUrl;
  }
  
  // Check for other cloud environments
  if (window.location.hostname.includes('codespaces') || 
      window.location.hostname.includes('gitpod') ||
      window.location.hostname.includes('stackblitz')) {
    const currentUrl = window.location.origin;
    const apiUrl = currentUrl.replace(':3000', ':5000');
    console.log('✅ Detected Cloud Environment');
    console.log('- Current URL:', currentUrl);
    console.log('- API URL:', apiUrl);
    return apiUrl;
  }
  
  // Default to localhost for local development
  console.log('✅ Using localhost for local development');
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

console.log('🚀 Final API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', config.url);
    } else {
      console.log('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
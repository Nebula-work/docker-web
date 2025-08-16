import axios from 'axios';

// Create a new Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api/v1", // Set base URL from .env file
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// This runs BEFORE each request is sent
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from local storage or your state management
        const token = localStorage.getItem('authToken');
        if (token) {
            // If the token exists, add it to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error (this is less common)
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
// This runs AFTER a response is received
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code within the range of 2xx causes this function to trigger
        // Simply return the response
        return response;
    },
    (error) => {
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        const { response } = error;

        // Handle specific error statuses globally
        if (response) {
            switch (response.status) {
                case 401:
                    console.error('Unauthorized access - 401');
                    //TODO window.location.href = '/login'; // Or dispatch a logout action
                    break;
                case 403:
                    console.error('Forbidden - 403');
                    break;
                case 404:
                    console.error('Not Found - 404');
                    break;
                case 500:
                    console.error('Internal Server Error - 500');
                    break;
                default:
                    console.error(`Unhandled HTTP Error: ${response.status}`);
            }
        } else if (error.request) {
            console.error('Network Error: No response received.');
            error.message = 'Network error. Please check your connection.';
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
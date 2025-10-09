import axios from 'axios';

const API = axios.create({
  baseURL: process.env.DOMAIN_API || '/api',
  withCredentials: true,
});

/**
 * Response interceptor to unwrap standardized API responses
 * Transforms { success: true, data: {...} } to just the data
 * Throws on { success: false, error: "..." }
 */
API.interceptors.response.use(
  (response) => {
    const { data } = response;

    // If response has standardized format
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success) {
        // Return just the data payload
        return { ...response, data: data.data };
      } else {
        // Transform error response to rejection
        const error = new Error(data.error || 'Request failed');
        error.response = response;
        error.isApiError = true;
        return Promise.reject(error);
      }
    }

    // Pass through non-standardized responses (backward compatibility)
    return response;
  },
  (error) => {
    // Network errors or non-2xx responses
    if (error.response?.data?.error) {
      // Enhance error message with backend error
      error.message = error.response.data.error;
    } else if (error.response?.data?.success === false) {
      error.message = error.response.data.error || 'Request failed';
    }
    return Promise.reject(error);
  },
);

export default API;

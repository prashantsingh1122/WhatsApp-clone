import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const messageService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Get messages for a specific contact
  getMessages: async (waId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${waId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send a new message
  sendMessage: async (waId, messageBody, messageType = 'text') => {
    const response = await api.post('/messages', {
      wa_id: waId,
      message_body: messageBody,
      message_type: messageType
    });
    return response.data;
  },

  // Update message status
  updateMessageStatus: async (messageId, status) => {
    const response = await api.put(`/messages/${messageId}/status`, {
      status
    });
    return response.data;
  },

  // Process webhook (for testing)
  processWebhook: async (payload) => {
    const response = await api.post('/webhook', payload);
    return response.data;
  }
};

export default api;

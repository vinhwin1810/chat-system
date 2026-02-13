import axios from './axios';

export const conversationsAPI = {
  getAll: async () => {
    const response = await axios.get('/api/conversations');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/api/conversations/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post('/api/conversations', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/api/conversations/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/api/conversations/${id}`);
    return response.data;
  },

  getMessages: async (id) => {
    const response = await axios.get(`/api/conversations/${id}/messages`);
    return response.data;
  },
};

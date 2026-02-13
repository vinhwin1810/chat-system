import axios from './axios';

export const messagesAPI = {
  send: async (formData) => {
    // Returns a response object for streaming
    return axios.post('/api/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'stream',
    });
  },

  getById: async (id) => {
    const response = await axios.get(`/api/messages/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/api/messages/${id}`);
    return response.data;
  },
};

// Function to handle SSE streaming
export const streamMessage = async (formData, onChunk, onDone, onError) => {
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

  const response = await fetch(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'chunk') {
              onChunk(data.content, data.messageId);
            } else if (data.type === 'done') {
              onDone(data.message);
            } else if (data.type === 'error') {
              onError(data.error);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    onError(error.message);
  }
};

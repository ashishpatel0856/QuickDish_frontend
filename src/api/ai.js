import api from "../services/api";

export const aiAPI = {

    chat: (message, sessionId = null) => {
    const userId = localStorage.getItem('userId');
    return api.post('/ai/chat', {
      message,
      sessionId
    }, {
      headers: {
        'X-User-Id': userId
      }
    });
  },

  smartSearch: (query, userId = null) => {
    return api.get('/ai/search/smart', {
      params: { query, userId }
    });
  }
};

export default aiAPI;
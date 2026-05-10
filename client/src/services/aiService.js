import api from './api';

export const sendChat = async (messages) => {
  const { data } = await api.post('/ai/chat', { messages });
  return data;
};

export const parseProduct = async (text) => {
  const { data } = await api.post('/ai/parse-product', { text });
  return data;
};

import axios from 'axios';

// Cria uma instância do Axios com o endereço base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // A porta do seu backend
});

// Interceptador (Opcional, mas profissional):
// Toda vez que fizermos uma requisição, ele verifica se tem token salvo e anexa.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;

import MSALClientService from '@/services/MSALClientService';
import axios, { AxiosRequestHeaders } from 'axios';

const { VITE_SPIRI_MOVE_API_URL } = import.meta.env;

class ApiService {
  api = axios.create({
    baseURL: VITE_SPIRI_MOVE_API_URL,
    withCredentials: true,
  });

  constructor() {
    this.api.interceptors.request.use(async (config) => {
      const accessToken = await MSALClientService.getAccessToken();
      config.headers = { Authorization: `Bearer ${accessToken}` } as AxiosRequestHeaders;
      return config;
    });
  }
}

export default new ApiService().api;

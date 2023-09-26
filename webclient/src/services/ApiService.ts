import MSALClientService from '@/services/MSALClientService';
import axios, { AxiosRequestHeaders } from 'axios';
import { getCurrentLanguage } from '@/utils/languages';

const { VITE_SPIRI_MOVE_API_URL } = import.meta.env;

export class ApiService {

  api = axios.create({
    withCredentials: true,
  });

  constructor() {
    this.api.interceptors.request.use(async (config) => {
      const accessToken = await MSALClientService.getAccessToken();
      config.headers = { Authorization: `Bearer ${accessToken}` } as AxiosRequestHeaders;
      config.baseURL = String(new URL(getCurrentLanguage(), VITE_SPIRI_MOVE_API_URL));
      return config;
    });
  }
}

export default new ApiService().api;

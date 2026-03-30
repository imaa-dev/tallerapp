import axios, { AxiosInstance } from 'axios';
import { appUrl } from '@/config/env';

const api: AxiosInstance = axios.create({
  baseURL: appUrl,
});
export default api;

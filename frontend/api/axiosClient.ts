import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../redux/store';
import jwt_decode from 'jwt-decode';
import { refreshToken } from '../slices/AuthSlice';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const auth = store?.getState()?.auth;
    const accessToken = auth?.data?.accessToken;
    const currentDate = new Date();
    if (accessToken) {
      const decodedToken: { exp: number } = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await store.dispatch(refreshToken());
        if (config?.headers) {
          config.headers['token'] = `Bearer ${
            store?.getState()?.auth?.data?.accessToken
          }`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

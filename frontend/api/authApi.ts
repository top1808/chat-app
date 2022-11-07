import axios from 'axios';
import { User } from '../models/User';
import axiosClient from './axiosClient';

const authApi = {
  register(body: User) {
    const url = 'auth/register';
    return axiosClient.post(url, body);
  },
  login(body: User) {
    const url = 'auth/login';
    return axiosClient.post(url, body);
  },
  logout(params: { accessToken: string; id: string }) {
    const url = 'auth/logout';
    const { accessToken, id } = params;
    console.log(
      '🚀 ~ file: authApi.ts ~ line 17 ~ logout ~ accessToken',
      accessToken
    );
    return axiosClient.post(
      url,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
  },
  refreshToken() {
    const url = 'auth/refresh';
    return axios.get(`http://localhost:8080/v1/${url}`, {
      withCredentials: true,
    });
  },
};

export default authApi;

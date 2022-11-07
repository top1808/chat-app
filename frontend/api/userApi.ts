import { Auth } from './../models/Auth';
import axiosClient from './axiosClient';

const userApi = {
  getAll: (params: Auth) => {
    const url = 'user';
    return axiosClient.get(url, {
      headers: {
        token: `Bearer ${params.accessToken}`,
      },
    });
  },
};
export default userApi;

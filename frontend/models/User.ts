export interface User {
  username: string;
  password: string;
  email: string;
  admin: boolean;
  _id: string;
}

export interface UserReponse {
  user: User;
  accessToken: string;
}

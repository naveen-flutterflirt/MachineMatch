export type UserType = 'admin' | 'user';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  userType: UserType;
  status: 'active' | 'pending_verification' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponse {
  success: boolean;
  token?: string;
  data: IUser;
}

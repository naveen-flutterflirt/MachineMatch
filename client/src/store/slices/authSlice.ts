import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/user';
import Cookies from 'js-cookie';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

const getInitialAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false, token: null };
  }

  const token = Cookies.get('token') || localStorage.getItem('token') || null;
  const userJson = localStorage.getItem('user');
  let user: IUser | null = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; token?: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      const tokenToSave = action.payload.token || state.token;
      if (tokenToSave) {
        state.token = tokenToSave;
        Cookies.set('token', tokenToSave, { expires: 7 });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', tokenToSave);
        }
      }

      if (typeof window !== 'undefined' && action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

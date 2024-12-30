import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';
import { TUser } from '../utils/types';

// Тип состояния
interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  authRequest: boolean;
  authError: string | null;
  profileRequest: boolean;
  profileError: string | null;
  loginUserRequest: boolean;
  loginUserError: string | null;
}

// начальное состояние
const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  authRequest: false,
  authError: null,
  profileRequest: false,
  profileError: null,
  loginUserRequest: false,
  loginUserError: null
};

// Асинхронные действия
// Логин
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue('Invalid email or password');
    }
  }
);

// выход и логина
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue('Error during logout');
    }
  }
);

// проверка профиля
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('User is not authenticated');
    }
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

// обновление профиля
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData: Partial<TUser>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue('Failed to update user data');
    }
  }
);

// слайс
export const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // логин
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload as string;
      })

      // логаут
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.profileRequest = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileRequest = false;
        state.profileError = action.payload as string;
        state.isAuthChecked = true;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.profileRequest = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileRequest = false;
        state.profileError = action.payload as string;
      });
  }
});

export const { setAuthChecked } = userAuthSlice.actions;

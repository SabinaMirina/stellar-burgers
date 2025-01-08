import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  refreshToken
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

// Начальное состояние
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

// Логин пользователя
export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(userData);
    if (!response.success) throw new Error('Ошибка логина');
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    console.log(
      'Логин выполнен. Сохранён refreshToken:',
      response.refreshToken
    );
    return response.user;
  } catch (error: any) {
    console.error('Ошибка при логине:', error.message || error);
    return rejectWithValue(error.message || 'Ошибка входа');
  }
});

// Асинхронное действие: логаут
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return rejectWithValue('Отсутствует refreshToken');
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('Логаут выполнен. refreshToken удалён.');
    } catch (error: any) {
      console.error('Ошибка при логауте:', error.message || error);
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

// Асинхронное действие: получение профиля
export const fetchUserProfile = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    if (!response.success) throw new Error('Ошибка получения профиля');
    return response.user;
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      console.warn('Токен истёк, пытаемся обновить...');
      try {
        const refreshData = await refreshToken();
        setCookie('accessToken', refreshData.accessToken.split('Bearer ')[1]);
        const retryResponse = await getUserApi();
        if (!retryResponse.success)
          throw new Error('Ошибка повторного запроса');
        return retryResponse.user;
      } catch (refreshError: any) {
        console.error('Ошибка обновления токена:', refreshError);
        return rejectWithValue(
          'Ошибка авторизации, пожалуйста, войдите снова.'
        );
      }
    } else {
      console.error('Ошибка профиля:', error);
      return rejectWithValue('Ошибка авторизации.');
    }
  }
});

// Асинхронное действие: обновление профиля
export const updateUserProfile = createAsyncThunk<
  TUser,
  Partial<TUser>,
  { rejectValue: string }
>('auth/updateUserProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    if (!response.success) {
      throw new Error('Failed to update user data');
    }
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update user data');
  }
});

// Слайс авторизации
// Слайс авторизации
export const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true; // Успешная авторизация
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload || 'Ошибка логина';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authError = action.payload || 'Ошибка логаута';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.authRequest = true;
        state.authError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true; // Завершаем проверку
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.authRequest = false;
        state.authError = action.payload || 'Ошибка авторизации';
        state.user = null;
        state.isAuthChecked = true; // Завершаем проверку
      });
  }
});

export const { setAuthChecked } = userAuthSlice.actions;

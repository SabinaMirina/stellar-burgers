import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi } from '../utils/burger-api';
import { setCookie } from '../utils/cookie';
import { TUser } from '../utils/types'; // Импорт типа TUser

// интерфейс состояния
interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userData: TUser | null; // Исправляем тип
  registerError: string | null;
}

// начальное состояние
const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: null,
  registerError: null
};

// асинхронное действие для регистрации пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// слайс
export const userRegisterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userData = action.payload;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.payload as string;
      });
  }
});
